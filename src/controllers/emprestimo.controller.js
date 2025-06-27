import emprestimoService from "../services/emprestimo.service.js"
import livroService from "../services/livro.service.js"
import solicitacaoService from "../services/solicitacao.service.js"

const createEmprestimo = async (req, res) => {
    // ID do leitor: autenticação
    // ID da solicitacao: passado pelo body
    // Data emprestimo: Date().toISOString() -- Momento que roda o programa (agora)

    // Regra de negocio: 14 dias para devolução
    // So pode criar emprestimo se quantidade livro for maior que zero
    
    const [ dataEmprestimo, dataDevolucaoEmprestimo ] = criarDatas(14) // Retorna data dos emprestimos
    const { solicitacao_id } = req.body // Ta sendo passado pelo body mas pode ser passado pelo params tambem (criterio dos devs)
    if(!solicitacao_id){
        return res.status(400).json({ message: 'Necessario informar uma solicitacao' })
    }

    const solicitacao = (await solicitacaoService.getById(solicitacao_id))[0]
    if(!solicitacao){
        return res.status(404).json({ message: 'Solicitacao não encontrada' })
    }

    const livro = (await livroService.getById(solicitacao.livro_id))[0] // Pega o livro pelo id fornecido  

    const emprestimo = [
        solicitacao_id,
        dataEmprestimo,
        dataDevolucaoEmprestimo
    ]

    try{
        const result = await emprestimoService.insert(emprestimo)
                            // Quantidade                          // Campo                 // Id
        await livroService.update([livro['quantidade_disponivel'] - 1], ['quantidade_disponivel'], solicitacao.livro_id)
        res.status(201).json({ message: 'Emprestimo aprovado!', result })
    }catch(erro){
        console.log(erro)
        return res.status(400).json({ message: 'Erro no emprestimo' })
    }
}

const atualizarEmprestimo = async (req, res) => {
    try{
        const { id } = req.params
        const { status } = req.body
        const statusEmprestimos = { ativo: '1', devolvido: '2', atrasado: '3' }

        if(!status){
            return res.status(400).json({ message: 'Erro: Informe um status para atualizar' })
        }
 
        const emprestimo = (await emprestimoService.getById(id))[0]

        if(emprestimo.status === 'devolvido'){
            return res.status(400).json({ message: 'Livro já foi devolvido' })
        }

        if(emprestimo.status === status){
            return res.status(400).json({ message: 'Status igual o anterior' })
        }

        if(!status || !statusEmprestimos[status]){
            return res.status(400).json({ message: 'Status informado não existe!' })
        }

        const solicitacao = (await solicitacaoService.getById(emprestimo.solicitacao_id))[0]
        const livro = (await livroService.getById(solicitacao.livro_id))[0]

        const result = await emprestimoService.update(status, emprestimo.id, dataFormatada(new Date()))

        if(status === 'devolvido'){
            await livroService.update([livro['quantidade_disponivel'] + 1], ['quantidade_disponivel'], livro.id)
        }

        res.status(201).json({ message: 'Ok!', result })

    }catch(err){
        return res.status(400).json({ message: 'Erro na devolução do livro!', err: err })
    }
}

const getAllEmprestimos = async (req, res) => {
    const result = await emprestimoService.getAll()
    res.status(200).json({ message: "Ok!", result })
}

const getEmprestimosAtivosFromUser = async (req, res) => {
    try{
        // Se não for passado nada no body, ele le como se fosse o id do token
        const leitor_id = req.params?.id ?? req.decodedToken.id
        
        const result = await emprestimoService.getAllFromUser(leitor_id)

        if(result.length == 0){
            return res.status(404).json({ message: "Nenhum emprestimo encontrado!" })
        }

        res.status(200).json({ message: "Ok!", result })
    }catch(erro){
        res.status(400).json({ message: "Erro!", erro: erro })
    }
}

function dataFormatada(data){
    const msOffset = (data.getTimezoneOffset() * 60) * 1000
    const dataLocal = new Date(data.getTime() - msOffset)
    return dataLocal.toISOString().split('T')[0]
}

function criarDatas(dias){
    const dataAgora = new Date()
    const dataDepois = new Date()

    dataDepois.setDate(dataAgora.getDate() + dias)

    const dataEmprestimo = dataFormatada(dataAgora)
    const dataDevolucaoEmprestimo = dataFormatada(dataDepois)

    return [dataEmprestimo, dataDevolucaoEmprestimo]
}


export { createEmprestimo, getAllEmprestimos, atualizarEmprestimo, getEmprestimosAtivosFromUser }
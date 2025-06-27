import livroService from "../services/livro.service.js"
import solicitacaoService from "../services/solicitacao.service.js"

const createSolicitacao = async (req, res) => {
    const { livro_id } = req.body // Ta sendo passado pelo body mas pode ser passado pelo params tambem (criterio dos devs)
    const livro = (await livroService.getById(livro_id))[0] // Pega o livro pelo id fornecido  
    const { id: leitor_id } = req.decodedToken // Recupera o id do leitor pelo token fornecido
    let data = new Date()
    const dataSolicitacao = dataFormatada(data)

    const repetido = await solicitacaoService.getByFields(
        ['leitor_id', 'livro_id', 'status'], [leitor_id, livro_id, 'pendente']
    )
    
    if(repetido.length > 0){
        console.log(repetido)
        return res.status(404).json({ message: 'Solicitação já foi feita!' })
    }
    if(!livro){
        return res.status(404).json({ message: 'Livro não encontrado' })
    }
    if(livro['quantidade_disponivel'] < 1){
        return res.status(409).json({ message: 'Livro esgotado' })
    }

    const solicitacao = [
        livro_id,
        leitor_id,
        dataSolicitacao
    ]

    try{
        const result = await solicitacaoService.insert(solicitacao)

        res.status(201).json({ message: 'Solicitacao feita!', result })
    }catch(erro){
        console.log(erro)
        return res.status(400).json({ message: 'Erro na solicitacao' })
    }
}

const aprovarSolicitacao = async (req, res) => {
    const { solicitacao_id } = req.body // Ta sendo passado pelo body mas pode ser passado pelo params tambem (criterio dos devs)
    if(!solicitacao_id){
        return res.status(400).json({ message: 'Necessario informar uma solicitacao' })
    }

    const solicitacao = (await solicitacaoService.getById(solicitacao_id))[0]
    if(!solicitacao){
        return res.status(404).json({ message: 'Solicitacao não encontrada' })
    }

    const result = await solicitacaoService.updateStatus('aprovado', solicitacao_id)
    res.status(201).json({ message: 'Solicitacao atualizada!', result })
}

function dataFormatada(data){
    const msOffset = (data.getTimezoneOffset() * 60) * 1000
    const dataLocal = new Date(data.getTime() - msOffset)
    return dataLocal.toISOString().split('T')[0]
}


export { createSolicitacao, aprovarSolicitacao }
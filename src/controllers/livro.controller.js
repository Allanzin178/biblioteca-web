import livroService from "../services/livro.service.js"

const createLivro = async (req, res) => {
    try{
        const { titulo, autor, ano_publicacao, quantidade_disponivel } = req?.body ?? {}

        if(!titulo || !autor || !quantidade_disponivel){
            return res.status(400).json({ message: 'Campos de titulo/autor/quantidade_disponivel são obrigatorios!'})
        }

        const livro = [
            titulo,
            autor, 
            ano_publicacao || null,
            quantidade_disponivel
        ]

        const result = (await livroService.insert(livro))[0]

        res.status(201).json({ message: 'Livro criado!', result})
    }catch(err){
        if(err.code === 'ER_DUP_ENTRY'){
            return res.status(409).json({ message: 'Esse livro ja foi cadastrado! Adicione +1 quantidade caso queira cadas mais uma unidade' })
        }
        res.status(500).json({ message: 'Erro interno', error: err })
    }
}

const updateLivro = async (req, res) => {
    const { titulo, autor, ano_publicacao, quantidade_disponivel } = req?.body || {}
    const { id } = req.params
    if(!titulo && !autor && !ano_publicacao && (quantidade_disponivel === undefined || quantidade_disponivel === "" || isNaN(quantidade_disponivel)) ){
        return res.status(400).json({ message: 'Preencha ao menos um campo!'})
    }

    const data = { titulo, autor, ano_publicacao, quantidade_disponivel }
    const livro = []
    const campos = []

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
    for(const [key, value] of Object.entries(data)){
        if(value !== undefined){
            livro.push(value)
            campos.push(key)
        }
    }

    const livroAtualizado = (await livroService.update(livro, campos, id))

    res.status(201).json({ message: "Atualizado!", result: livroAtualizado })
}

const getAllLivros = async (req, res) => {
    const result = await livroService.getAll()
    res.status(200).json({ message: "Ok!", result })
}

const getLivroById = async (req, res) => {
    const { id } = req.params
    const result = await livroService.getById(id)
    res.status(200).json({ message: "Ok!", result })
}

const deleteLivro = async (req, res) => {
    const { id } = req.params
    const result = await livroService.delete(id)
    res.status(200).json({ message: 'Deu bom', result })
}
export { createLivro, updateLivro, getAllLivros, deleteLivro, getLivroById }
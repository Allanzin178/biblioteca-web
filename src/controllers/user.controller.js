import userService from "../services/user.service.js"

const createUser = async (req, res) => {
    try{
        const { nome, email, senha, perfil } = req?.body ?? {}
        if(!nome || !email || !senha){
            return res.status(400).json({ message: 'Campos de nome/email/senha são obrigatorios!'})
        }

        const user = [
            nome,
            email,
            senha,
            perfil || 'leitor'
        ]

        const token = await userService.insert(user)
        res.status(201).json({ token })
    }catch (err) {
        if(err.code === 'ER_DUP_ENTRY'){
            return res.status(409).json({ message: 'Email já cadastrado!' })
        }
        if(err.code === 'WARN_DATA_TRUNCATED'){
            return res.status(406).json({ message: 'Erro! (Possivel valor invalido no campo \'perfil\')' })
        }
        res.status(500).json({ message: 'Erro interno', error: err.message })
    }
    
}

const getAllUsers = async (req, res) => {
    // TODO: Autorizar apenas perfil bibliotecario
    const result = await userService.getAll()
    res.status(200).json({ message: 'Ok!', result })
}

const deleteUser = async (req, res) => {
    // TODO: Fazer erro caso id nao seja encontrado
    const { id } = req.params
    const result = await userService.delete(id)
    res.status(200).json({ message: 'Deu bom', result })
}

export { createUser, getAllUsers, deleteUser }
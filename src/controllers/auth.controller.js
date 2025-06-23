import authService from "../services/auth.service.js"
import bcrypt from 'bcrypt'

const login = async (req, res) => {
    const { email, senha } = req.body || {}
    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' })
    }

    const result = (await authService.login(email))[0]

    if(!result){
        return res.status(404).send({ message: "Usuario invalido" })
    }

    const passwordIsValid = await bcrypt.compare(senha, result.senha)

    if(!passwordIsValid){
        return res.status(404).send({ message: "Senha invalida" })
    }

    const token = await authService.generateToken(result.id)
    
    res.status(200).json({ token })
}

export { login }
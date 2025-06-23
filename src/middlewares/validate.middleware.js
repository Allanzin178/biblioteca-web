import emprestimoService from "../services/emprestimo.service.js"
import livroService from "../services/livro.service.js"
import userService from "../services/user.service.js"

const validateUser = async (req, res, next) => {
    const { id } = req?.params ?? {} // o ? verifica se req existe (quase sempre existe) e o ?? diz que se params for null ou undefined usa {} (serve como tratamento de erros)
    if(!id) return res.status(400).json({ message: 'Id invalido!' })
    
    const result = await userService.getById(id)
    if(!result || result.length === 0){
        return res.status(404).json({ message: 'Usuario não encontrado!' })
    }
    return next()
}   

const validateLivro = async (req, res, next) => {

    const { id } = req?.params ?? {}
    if(!id) return res.status(400).json({ message: 'Id invalido!' })

    const result = await livroService.getById(id)
    if(!result || result.length === 0){
        return res.status(404).json({ message: 'Livro não encontrado!' })
    }
    return next()

}

const validateEmprestimo = async (req, res, next) => {

    const { id } = req?.params ?? {}
    if(!id) return res.status(400).json({ message: 'Id invalido!' })
        
    const result = await emprestimoService.getById(id)
    if(!result || result.length === 0){
        return res.status(404).json({ message: 'Emprestimo não encontrado!' })
    }
    return next()

}

export { validateUser, validateLivro, validateEmprestimo }
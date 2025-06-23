import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import userService from '../services/user.service.js'

dotenv.config()

const authMiddleware = (req, res, next) => {
    const { authorization } = req?.headers ?? {}
    
    if(!authorization){
        return res.status(401).send("Unauthorized")
    }

    const parts = authorization.split(" ")

    if(parts.length !== 2){
        return res.status(401).send("Autorização mal formatada")
    }

    const [ schema, token ] = parts

    if(schema !== "Bearer"){
        return res.status(401).send("Autorização mal formatada")
    }

    jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
        if(error){
            return res.status(401).json({ message: "Token invalido!" })
        }
        const user = await userService.getById(decoded.id)
        if(user.length < 1){
            return res.status(401).json({ message: "Token invalido!" })
        }

        req.userPerfil = user[0].perfil
        req.decodedToken = decoded
        
        return next()
    })
}

export { authMiddleware }
import jwt from "jsonwebtoken"
import promiseSql from "./promise.service.js"
import dotenv from 'dotenv'
dotenv.config()

class AuthService{
    login = (email) => {
        const query = 'SELECT id, email, senha FROM users WHERE email = ?'
        return promiseSql(query, email)
    }

    generateToken = async (id) => { 
        return jwt.sign({ id: id }, process.env.SECRET_JWT, { expiresIn: 86400 })
    }
}

const authService = new AuthService()

export default authService
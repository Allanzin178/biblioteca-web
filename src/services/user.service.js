import authService from "./auth.service.js"
import bcrypt from 'bcrypt'
import promiseSql from "./promise.service.js"


class UserService{
    insert = async (user)=>{
        const query = 'INSERT INTO users (nome, email, senha, perfil) VALUES (?)'
        user[2] = await bcrypt.hash(user[2], 10)
        const result = await promiseSql(query, [user])
        return authService.generateToken(result.insertId)
    }

    getAll = () => {
        const query = 'SELECT * FROM users'
        return promiseSql(query)
    }

    getById = (id) => {
        const query = 'SELECT * FROM users WHERE id = ?'
        return promiseSql(query, id)
    }

    // TODO: Fazer erro caso id nao seja encontrado
    delete = (id) => {
        const query = 'DELETE FROM users WHERE id = ?'
        return promiseSql(query, id)
    }
}

const userService = new UserService()

export default userService
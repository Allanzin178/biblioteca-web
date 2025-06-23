import promiseSql from "./promise.service.js"

class EmprestimoService{
    insert = async (emprestimo)=>{
        const query = 'INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista) VALUES (?)'
        const result = await promiseSql(query, [emprestimo])
        return promiseSql('SELECT * FROM emprestimos WHERE id = ?', result.insertId)
    }

    getAll = () => {
        const query = 'SELECT * FROM emprestimos'
        return promiseSql(query)
    }

    update = async (status, id, dataDevolucaoReal)=>{
        
        const valores = [ status ]
        const campos = [ 'status = ?' ]

        if(dataDevolucaoReal && status == 'devolvido'){
            valores.push(dataDevolucaoReal)
            campos.push('data_devolucao_real = ?')
        }

        const query = `UPDATE emprestimos SET ${campos.join(', ')} WHERE id = ?`
        promiseSql(query, [...valores, id])
        return promiseSql('SELECT * FROM emprestimos WHERE id = ?', id)
    }

    getById = (id) => {
        const query = 'SELECT * FROM emprestimos WHERE id = ?'
        return promiseSql(query, id)
    }

    getByFields = (campos, valores, and = true) => {
        const camposFormatados = campos.map((chave)=>{
            return `${chave} = ?`
        })
        const query = `SELECT * FROM emprestimos WHERE ${camposFormatados.join(and ? ' AND ' : ' OR ')}`
        return promiseSql(query, valores)
    }
}

const emprestimoService = new EmprestimoService()

export default emprestimoService

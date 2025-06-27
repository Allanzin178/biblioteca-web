import promiseSql from "./promise.service.js"

class EmprestimoService{
    insert = async (emprestimo)=>{
        const query = 'INSERT INTO emprestimos (solicitacao_id, data_emprestimo, data_devolucao_prevista) VALUES (?)'
        const result = await promiseSql(query, [emprestimo])
        return promiseSql('SELECT * FROM emprestimos WHERE id = ?', result.insertId)
    }

    getAll = () => {
        const query = `SELECT 
            e.*, s.leitor_id, s.livro_id
            FROM emprestimos e
            LEFT JOIN solicitacoes_emprestimo s ON s.id = e.solicitacao_id`
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

    getAllFromUser = (id, status = 'ativo') =>{
        const query = `SELECT e.* 
                        FROM emprestimos e
                        INNER JOIN solicitacoes_emprestimo s ON s.id = e.solicitacao_id
                        WHERE s.leitor_id = ? AND e.status = ?`
        return promiseSql(query, [id, status])
    }
}

const emprestimoService = new EmprestimoService()

export default emprestimoService

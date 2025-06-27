import promiseSql from "./promise.service.js"

class SolicitacaoService{
    insert = async (solicitacao)=>{
        const query = 'INSERT INTO solicitacoes_emprestimo (livro_id, leitor_id, data_solicitacao) VALUES (?)'
        const result = await promiseSql(query, [solicitacao])
        return promiseSql('SELECT * FROM solicitacoes_emprestimo WHERE id = ?', result.insertId)
    }

    updateStatus = async (status, id)=>{
        const query = `UPDATE solicitacoes_emprestimo SET status = ? WHERE id = ?`
        promiseSql(query, [status, id])
        return promiseSql('SELECT * FROM solicitacoes_emprestimo s INNER JOIN emprestimos e ON e.solicitacao_id = s.id WHERE s.id = ?', id)
    }

    getById = (id) => {
        const query = 'SELECT * FROM solicitacoes_emprestimo WHERE id = ?'
        return promiseSql(query, id)
    }

    getByFields = (campos, valores, and = true) => {
        const camposFormatados = campos.map((chave)=>{
            return `${chave} = ?`
        })
        const query = `SELECT * FROM solicitacoes_emprestimo WHERE ${camposFormatados.join(and ? ' AND ' : ' OR ')}`
        return promiseSql(query, valores)
    }
}

const solicitacaoService = new SolicitacaoService()

export default solicitacaoService

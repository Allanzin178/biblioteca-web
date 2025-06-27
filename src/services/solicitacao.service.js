import promiseSql from "./promise.service.js"

class SolicitacaoService{
    insert = async (solicitacao)=>{
        const query = 'INSERT INTO solicitacoes_emprestimo (livro_id, leitor_id, data_solicitacao) VALUES (?)'
        const result = await promiseSql(query, [solicitacao])
        return promiseSql('SELECT * FROM solicitacoes_emprestimo WHERE id = ?', result.insertId)
    }

    updateStatus = async (status, id)=>{
        const query = `UPDATE solicitacoes_emprestimo SET status = ? WHERE id = ?`
        await promiseSql(query, [status, id])
        const solicitacao = await promiseSql('SELECT * FROM solicitacoes_emprestimo WHERE id = ?', id)
        const emprestimo = await promiseSql('SELECT * FROM emprestimos WHERE solicitacao_id = ?', id)
        return [...solicitacao, ...emprestimo]
    }

    getAll = () => {
        const query = 'SELECT * FROM solicitacoes_emprestimo'
        return promiseSql(query)
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

import promiseSql from "./promise.service.js"

class LivroService{
    insert = async (livro)=>{
        const query = 'INSERT INTO livros (titulo, autor, ano_publicacao, quantidade_disponivel) VALUES (?)'
        
        // Verificando se há livro repitido
        const repetido = await promiseSql('SELECT id FROM livros WHERE titulo = ? AND autor = ?', [ livro[0], livro[1] ])
        if(repetido.length > 0){
            const erro = new Error('Livro já cadastrado')
            erro.code = 'ER_DUP_ENTRY'
            throw erro
        }

        // Inserindo
        const result = await promiseSql(query, [livro])

        const livroAdicionado = await promiseSql('SELECT titulo, autor, ano_publicacao, quantidade_disponivel FROM livros WHERE id = ?', result.insertId)
        return livroAdicionado
    }

    getDisponiveis = () => {
        const query = 'SELECT * FROM livros WHERE quantidade_disponivel > 0'
        return promiseSql(query)
    }

    getAll = () => {
        const query = 'SELECT * FROM livros'
        return promiseSql(query)
    }

    getById = (id) => {
        const query = 'SELECT * FROM livros WHERE id = ?'
        return promiseSql(query, id)
    }

    update = (livro, campos, id) => {
        const camposFormatados = campos.map((chave)=>{
            return `${chave} = ?`
        })
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
        const query = `UPDATE livros SET ${camposFormatados.join()} WHERE id = ?`
        promiseSql(query, [...livro, id])
        return promiseSql('SELECT * FROM livros WHERE id = ?', id)
    }

    // TODO: Fazer erro caso id nao seja encontrado
    delete = (id) => {
        const query = 'DELETE FROM livros WHERE id = ?'
        return promiseSql(query, id)
    }
}

const livroService = new LivroService()

export default livroService
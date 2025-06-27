class Cookies {
    setCookie(chave, valor, duracao) {
        const data = new Date()
        data.setTime(data.getTime() + (duracao * 24 * 60 * 60 * 1000))
        let expires = 'expires=' + data.toUTCString()
        document.cookie = chave + '=' + valor + ';' + expires + ';path=/'
    }

    getCookie(chave) {
        const name = chave + '='
        const decodedCookie = decodeURIComponent(document.cookie)
        const cookieArray = decodedCookie.split(';')
        const cookieEncontrado = cookieArray.find((cookie) => {
            const c = cookie.trim()
            return c.startsWith(name)
        })
        return cookieEncontrado?.substring(name.length)
    }

    deleteCookie(chave) {
        document.cookie = chave + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    }
}

class Sistema {
    signup(dados) {
        fetch('/usuarios/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        }).then(async (response) => {
            const resposta = await response.json()
            if (!response.ok) {
                alert(resposta.message, resposta.error ?? undefined)
            } else {
                cookies.setCookie('token', resposta.token, 1)
                window.location.href = '/pages/home.html'
                console.log(response)
            }
        })
    }

    login(usuario) {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        }).then(async (response) => {
            const resposta = await response.json()
            if (!response.ok) {
                alert(resposta.message, resposta.error ?? undefined)
            } else {
                cookies.setCookie('token', resposta.token, 1)
                window.location.href = '/pages/home.html'
            }
        })
    }

    logout() {
        cookies.deleteCookie('token')
        window.location.href = '/pages/login.html'
    }

    async getPerfil() {
        const response = await fetch('/usuarios/tokenUser', {
            headers: {
                Authorization: `Bearer ${cookies.getCookie('token')}`
            }
        })
        const resposta = await response.json()
        return resposta.user.perfil
    }
}

const cookies = new Cookies()
let livroEditandoId = null
const sistema = new Sistema()

function mostrarSecao(secaoId) {
    document.querySelectorAll('.secao').forEach(secao => {
        secao.style.display = 'none';
    });
    document.getElementById(secaoId).style.display = 'block';
}

async function carregarLivrosLeitor() {
    try {
        const response = await fetch('/livros');
        const livros = await response.json();
        
        const container = document.getElementById('livros');
        container.innerHTML = '<h2>Biblioteca:</h2>';
        
        for(let chave in livros){
            if(chave === 'result'){
                livros[chave].forEach(livro => {
                    const livroDiv = document.createElement('div');
                    livroDiv.className = 'livro';
                    livroDiv.innerHTML = `
                        <div class="livro-info">
                            <span>Titulo: ${livro.titulo}</span>
                            <span>Autor: ${livro.autor}</span>
                            <span>Ano: ${livro.ano_publicacao ?? 'Não informado'}</span>
                            <span>Quantidade disponivel: ${livro.quantidade_disponivel}</span>
                        </div>
                        <button class="livro-btn" onclick="solicitar(${livro.id})">
                            <span>
                                <i class="material-symbols-outlined"> shopping_cart_checkout </i>
                                <span>Solicitar</span>
                            </span>
                        </button>
                    `;
                    container.appendChild(livroDiv);
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        alert('Erro ao carregar livros. Tente novamente mais tarde.');
    }
}

async function carregarEmprestimosAtivosLeitor() {
    try {
        const response = await fetch('/emprestimos/fromUser/', {
            headers: {
                Authorization: `Bearer ${cookies.getCookie('token')}`
            }
        });
        const emprestimos = await response.json();
        
        const container = document.getElementById('livros');
        container.innerHTML = '<h2>Meus livros:</h2>';
        
        for(let chave in emprestimos){
            if(chave === 'result'){
                emprestimos[chave].forEach(emprestimo => {
                    const emprestimoDiv = document.createElement('div');
                    emprestimoDiv.className = 'livro';
                    emprestimoDiv.innerHTML = `
                        <div class="livro-info">
                            <span>Titulo: ${emprestimo.titulo_livro}</span>
                            <span>Data de devolução: ${new Date(emprestimo.data_devolucao_prevista).toLocaleDateString()}</span>
                            <span>Status: ${emprestimo.status}</span>
                        </div>
                    `;
                    container.appendChild(emprestimoDiv);
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        alert('Erro ao carregar livros. Tente novamente mais tarde.');
    }
}

async function solicitar(id) {
    try {
        const livro_id = {
            livro_id: id
        }
        const response = await fetch('/solicitacao/criar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.getCookie('token')}`
            },
            body: JSON.stringify(livro_id)
        });
        const resposta = await response.json();
        alert(resposta.message)
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        alert('Erro ao carregar livros. Tente novamente mais tarde.');
    }
}

async function carregarLivros() {
    try {
        const response = await fetch('/livros');
        const livros = await response.json();
        
        const container = document.getElementById('lista-livros');
        container.innerHTML = '';
        
        for(let chave in livros){
            if(chave === 'result'){
                livros[chave].forEach(livro => {
                    const livroDiv = document.createElement('div');
                    livroDiv.className = 'livro';
                    livroDiv.innerHTML = `
                        <div class="livro-info">
                            <h3>${livro.titulo}</h3>
                            <p>Autor: ${livro.autor}</p>
                            <p>Ano: ${livro.ano_publicacao || 'Não informado'}</p>
                            <p>Disponíveis: ${livro.quantidade_disponivel}</p>
                            
                        </div>
                        <button onclick="editarLivro(${livro.id})" class="livro-btn">Editar</button>
                        <button onclick="removerLivro(${livro.id})" class="livro-btn">Remover</button>
                    `;
                    container.appendChild(livroDiv);
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        alert('Erro ao carregar livros. Tente novamente mais tarde.');
    }
}

async function carregarEmprestimos() {
    try {
        const response = await fetch('/emprestimos/', {
            headers: {
                Authorization: `Bearer ${cookies.getCookie('token')}`
            }
        });
        const emprestimos = await response.json();
        
        const container = document.getElementById('lista-emprestimos');
        container.innerHTML = '';
        
        for(let chave in emprestimos){
            if(chave === 'result'){
                emprestimos[chave].forEach(emp => {
                    const empDiv = document.createElement('div');
                    empDiv.className = 'livro';
                    empDiv.innerHTML = `
                        <div class="livro-info">
                            <p>Nome do leitor: ${emp.nome_leitor}</p>
                            <p>Titulo do livro: ${emp.titulo_livro}</p>
                            <p>Data Empréstimo: ${new Date(emp.data_emprestimo).toLocaleDateString()}</p>
                            <p>Data Devolução Prevista: ${new Date(emp.data_devolucao_prevista).toLocaleDateString()}</p>
                            ${emp.status === 'devolvido' ? 
                                `<p>Data Devolução Real: ${new Date(emp.data_devolucao_real).toLocaleDateString()}</p>` : ''}
                            <p>Status: ${emp.status}</p>
                        </div>
                        ${(emp.status === 'ativo' || emp.status === 'atrasado') ? 
                                `<button onclick="registrarDevolucao(${emp.id})" class="livro-btn">Registrar Devolução</button>` : ''}
                    `;
                    container.appendChild(empDiv);
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar empréstimos:', error);
        alert('Erro ao carregar empréstimos. Tente novamente mais tarde.');
    }
}

async function carregarSolicitacoes() {
    try {
        const response = await fetch('/solicitacao/', {
            headers: {
                Authorization: `Bearer ${cookies.getCookie('token')}`
            }
        });
        const solicitacoes = await response.json();
        
        const container = document.getElementById('lista-solicitacoes');
        container.innerHTML = '';
        
        for(let chave in solicitacoes){
            if(chave === 'result'){
                solicitacoes[chave].forEach(sol => {
                    const solDiv = document.createElement('div');
                    solDiv.className = 'livro';
                    solDiv.innerHTML = `
                        <div class="livro-info">
                            <p>Data Solicitação: ${new Date(sol.data_solicitacao).toLocaleDateString()}</p>
                            <p>Livro solicitado: ${sol.titulo_livro}</p>
                            <p>Usuario que solicitou: ${sol.nome_usuario}</p>
                            <p>Status: ${sol.status}</p>
                        </div>
                        ${(sol.status === 'pendente') ? 
                                `<button onclick="aprovarSolicitacao(${sol.id})" class="livro-btn">Aprovar solicitação</button>` : ''}
                    `;
                    container.appendChild(solDiv);
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
        alert('Erro ao carregar solicitações. Tente novamente mais tarde.');
    }
}

async function aprovarSolicitacao(id){
    const solicitacao_id = {
        solicitacao_id: id
    }
    const response = await fetch(`/solicitacao/aprovar`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.getCookie('token')}`
        },
        body: JSON.stringify(solicitacao_id)
    });
    const resposta = await response.json()

    alert(resposta.message);
    carregarSolicitacoes()
    carregarEmprestimos()
    carregarLivros()
}

async function adicionarLivro(e) {
    e.preventDefault();
    
    const livro = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        ano_publicacao: document.getElementById('ano').value || null,
        quantidade_disponivel: document.getElementById('quantidade').value
    };
    
    try {
        const response = await fetch('/livros/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.getCookie('token')}`
            },
            body: JSON.stringify(livro)
        });
        
        if (response.ok) {
            alert('Livro adicionado com sucesso!');
            document.getElementById('form-adicionar-livro').reset();
            carregarLivros();
        } else {
            const erro = await response.json();
            alert(erro.message);
        }
    } catch (error) {
        console.error('Erro ao adicionar livro:', error);
        alert('Erro ao adicionar livro. Tente novamente mais tarde.');
    }
}

function fecharModal() {
    document.getElementById('modal-editar').classList.remove('show');
    livroEditandoId = null;
}

async function salvarEdicao(dadosLivro) {
    try {
        const response = await fetch(`/livros/${livroEditandoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.getCookie('token')}`
            },
            body: JSON.stringify(dadosLivro)
        });
        
        console.log('Salvando livro:', dadosLivro);

        alert('Livro editado com sucesso!');
        fecharModal();
        carregarLivros();
        
    } catch (error) {
        console.error('Erro ao editar livro:', error);
        alert('Erro ao editar livro. Tente novamente mais tarde.');
    }
}

async function editarLivro(id) {
    const response = await fetch(`/livros/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${cookies.getCookie('token')}`
        },
    })
    const resposta = await response.json()
    const livro = {}
    if (!resposta) return;

    for(let chave in resposta){
        if(chave === 'result'){
            livro.titulo = resposta[chave][0].titulo
            livro.autor = resposta[chave][0].autor
            livro.ano_publicacao = resposta[chave][0].ano_publicacao
            livro.quantidade_disponivel = resposta[chave][0].quantidade_disponivel
        }
    }

    livroEditandoId = id;
    
    document.getElementById('edit-titulo').value = livro.titulo;
    document.getElementById('edit-autor').value = livro.autor;
    document.getElementById('edit-ano').value = livro.ano_publicacao || '';
    document.getElementById('edit-quantidade').value = livro.quantidade_disponivel;
    
    document.getElementById('modal-editar').classList.add('show');
}

async function removerLivro(id) {
    if (confirm('Tem certeza que deseja remover este livro?')) {
        try {
            const response = await fetch(`/livros/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${cookies.getCookie('token')}`
                }
            });
            
            if (response.ok) {
                alert('Livro removido com sucesso!');
                carregarLivros();
            } else {
                const erro = await response.json();
                alert(erro.message);
            }
        } catch (error) {
            console.error('Erro ao remover livro:', error);
            alert('Erro ao remover livro. Tente novamente mais tarde.');
        }
    }
}

async function registrarDevolucao(id) {

    const devolucao = {
        status: 'devolvido'
    }
    const response = await fetch(`/emprestimos/atualizar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.getCookie('token')}`
        },
        body: JSON.stringify(devolucao)
    });
    
    if (response.ok) {
        alert('Devolução registrada com sucesso!');
        carregarEmprestimos();
    } else {
        const erro = await response.json();
        alert(erro.message);
    }
    
}


function signOperation(event, acao) {
    event.preventDefault()
    const form = event.target
    const dados = {}

    for (let input of form.elements) {
        if (((input.type === 'text' || input.type === 'email' || input.type === 'password') || (input.type === 'radio' && input.checked)) && !input.disabled) {
            dados[input.name] = input.value
        }
    }
    if (acao === 'login') {
        sistema.login(dados)
    }
    if (acao === 'signup') {
        sistema.signup(dados)
    }
}

function deslogar() {
    sistema.logout()
}

window.addEventListener('DOMContentLoaded', async () => {
    let formLogin = document.getElementById('formLogin')
    let formCadastro = document.getElementById('formCadastro')
    

    if (formLogin) { 
        formLogin.addEventListener('submit', event => signOperation(event, 'login')) 
    }
    if (formCadastro) { 
        formCadastro.addEventListener('submit', event => signOperation(event, 'signup')) 
    }

    if ((window.location.pathname == '/pages/login.html' || window.location.pathname == '/pages/cadastro.html') && cookies.getCookie('token')) { 
        window.location.href = '/pages/home.html' 
    }
    if ((window.location.pathname == '/pages/home.html') && !cookies.getCookie('token')) { 
        window.location.href = '/pages/login.html' 
    }
    if ((window.location.pathname == '/pages/bibliotecario.html') && !cookies.getCookie('token')) { 
        window.location.href = '/pages/login.html' 
    }
    if(cookies.getCookie('token')) {
        const userPerfil = await sistema.getPerfil()
        if((window.location.pathname == '/pages/bibliotecario.html') && userPerfil !== 'bibliotecario'){
            window.location.href = '/pages/login.html' 
        }
        if((window.location.pathname == '/pages/home.html') ){
            if(userPerfil === 'bibliotecario'){
                window.location.href = '/pages/bibliotecario.html' 
            }
            carregarLivrosLeitor()
        }
        if((window.location.pathname == '/pages/livros.html') ){
            if(userPerfil === 'bibliotecario'){
                window.location.href = '/pages/bibliotecario.html' 
            }
            carregarEmprestimosAtivosLeitor()
        }
    }

    document.getElementById('form-editar-livro').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const dadosLivro = {
            titulo: document.getElementById('edit-titulo').value,
            autor: document.getElementById('edit-autor').value,
            ano_publicacao: document.getElementById('edit-ano').value || null,
            quantidade_disponivel: parseInt(document.getElementById('edit-quantidade').value)
        };
        
        salvarEdicao(dadosLivro);
    });
    
    document.getElementById('modal-editar').addEventListener('click', function(e) {
        if (e.target === this) {
            fecharModal();
        }
    });

    if (document.getElementById('form-adicionar-livro')) {
        document.getElementById('form-adicionar-livro').addEventListener('submit', adicionarLivro);
        carregarLivros();
        carregarEmprestimos();
        carregarSolicitacoes()
    }

});
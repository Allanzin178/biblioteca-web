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

    verificaCargo() {
        // Implementação futura
    }
}

const cookies = new Cookies()
const sistema = new Sistema()

// Funções da biblioteca
function mostrarSecao(secaoId) {
    document.querySelectorAll('.secao').forEach(secao => {
        secao.style.display = 'none';
    });
    document.getElementById(secaoId).style.display = 'block';
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
                            <button onclick="editarLivro(${livro.id})">Editar</button>
                            <button onclick="removerLivro(${livro.id})">Remover</button>
                        </div>
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
                            <p>Data Empréstimo: ${new Date(emp.data_emprestimo).toLocaleDateString()}</p>
                            <p>Data Devolução Prevista: ${new Date(emp.data_devolucao_prevista).toLocaleDateString()}</p>
                            ${emp.status === 'devolvido' ? 
                                `<p>Data Devolução Real: ${new Date(emp.data_devolucao_real).toLocaleDateString()}</p>` : ''}
                            <p>Status: ${emp.status}</p>
                            ${(emp.status === 'ativo' || emp.status === 'atrasado') ? 
                                `<button onclick="registrarDevolucao(${emp.id})">Registrar Devolução</button>` : ''}
                        </div>
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

async function adicionarLivro(e) {
    e.preventDefault();
    
    const livro = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        ano_publicacao: document.getElementById('ano').value || null,
        quantidade_disponivel: document.getElementById('quantidade').value
    };
    
    try {
        const response = await fetch('/livros', {
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

async function editarLivro(id) {
    alert('Funcionalidade de edição será implementada aqui');
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
    try {
        const response = await fetch(`/emprestimos/${id}/devolver`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${cookies.getCookie('token')}`
            }
        });
        
        if (response.ok) {
            alert('Devolução registrada com sucesso!');
            carregarEmprestimos();
        } else {
            const erro = await response.json();
            alert(erro.message);
        }
    } catch (error) {
        console.error('Erro ao registrar devolução:', error);
        alert('Erro ao registrar devolução. Tente novamente mais tarde.');
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

// Event Listeners
window.addEventListener('DOMContentLoaded', () => {
    let formLogin = document.getElementById('formLogin')
    let formCadastro = document.getElementById('formCadastro')

    if (formLogin) { formLogin.addEventListener('submit', event => signOperation(event, 'login')) }
    if (formCadastro) { formCadastro.addEventListener('submit', event => signOperation(event, 'signup')) }

    if ((window.location.pathname == '/pages/login.html' || window.location.pathname == '/pages/cadastro.html') && cookies.getCookie('token')) { 
        window.location.href = '/pages/home.html' 
    }
    if ((window.location.pathname == '/pages/home.html') && !cookies.getCookie('token')) { 
        window.location.href = '/pages/login.html' 
    }

    // Adiciona os event listeners específicos da biblioteca se estiver na página correta
    if (document.getElementById('form-adicionar-livro')) {
        document.getElementById('form-adicionar-livro').addEventListener('submit', adicionarLivro);
        carregarLivros();
        carregarEmprestimos();
    }
});
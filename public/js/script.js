class Cookies {
    setCookie(chave, valor, duracao){
        const data = new Date()
        data.setTime(data.getTime() + (duracao*24*60*60*1000))
        let expires = 'expires=' + data.toUTCString()
        document.cookie = chave + '=' + valor + ';' + expires + ';path=/'
    }

    getCookie(chave) {
        const name = chave + '='
        const decodedCookie = decodeURIComponent(document.cookie)
        const cookieArray = decodedCookie.split(';')
        const cookieEncontrado = cookieArray.find((cookie)=>{
            const c = cookie.trim()
            return c.startsWith(name)
        })
        return cookieEncontrado?.substring(name.length)
    }

    deleteCookie(chave) {
        document.cookie = chave + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    }
}

class Usuario {

    signup(dados) {
        fetch('/usuarios/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        }).then(async (response)=>{
            const resposta = await response.json()
            if(!response.ok){
                alert(resposta.message, resposta.error ?? undefined)
            }else{
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
        }).then(async (response)=>{
            const resposta = await response.json()
            if(!response.ok){
                alert(resposta.message, resposta.error ?? undefined)
            }else{
                cookies.setCookie('token', resposta.token, 1)
                window.location.href = '/pages/home.html'
            }
        })
    }

    logout() {
        cookies.deleteCookie('token')
    }
}

const cookies = new Cookies()
const usuario = new Usuario()

window.addEventListener('DOMContentLoaded', ()=>{
    let formLogin = document.getElementById('formLogin')
    let formCadastro = document.getElementById('formCadastro')

    if(formLogin) { formLogin.addEventListener('submit', event => signOperation(event, 'login')) }
    if(formCadastro) { formCadastro.addEventListener('submit', event => signOperation(event, 'signup')) }

    if((window.location.pathname == '/pages/login.html' || window.location.pathname == '/pages/cadastro.html') && cookies.getCookie('token')) { window.location.href = '/pages/home.html' }
    if((window.location.pathname == '/pages/home.html') && !cookies.getCookie('token')) { window.location.href = '/pages/login.html' }
})

function signOperation(event, acao){
    event.preventDefault()
    const form = event.target
    const dados = {}

    for(let input of form.elements){
        if(((input.type === 'text' || input.type === 'email' || input.type === 'password') || (input.type === 'radio' && input.checked)) && !input.disabled){
            dados[input.name] = input.value
        }
    }
    if(acao === 'login'){
        usuario.login(dados)
    }
    if(acao === 'signup'){
        usuario.signup(dados)
    }
    
}

function deslogar(){
    usuario.logout()
    window.location.href = '/pages/login.html'
}


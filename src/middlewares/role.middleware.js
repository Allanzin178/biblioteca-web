const isBibliotecario = async (req, res, next) => {
    const perfil = req.userPerfil
    console.log('Verificando perfil: \n- Id: ' + req.decodedToken.id + " - Perfil: " + perfil)
    if(perfil !== 'bibliotecario'){
        return res.status(403).json({ message: 'Apenas bibliotecarios podem realizar esta ação'})
    }
    next()
}

const isLeitor = async (req, res, next) => {
    const perfil = req.userPerfil
    console.log('Verificando perfil: \n- Id: ' + req.decodedToken.id + " - Perfil: " + perfil)
    if(perfil !== 'leitor'){
        return res.status(403).json({ message: 'Apenas leitores podem realizar esta ação'})
    }
    next()
}

export { isBibliotecario, isLeitor }
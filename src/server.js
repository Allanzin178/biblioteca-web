import express from 'express'
import userRoutes from './routes/user.routes.js'
import livroRoutes from './routes/livro.routes.js'
import emprestimoRoutes from './routes/emprestimo.routes.js'
import authRoutes from './routes/auth.route.js'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/login', authRoutes)
app.use('/livros', livroRoutes)
app.use('/emprestimos', emprestimoRoutes)
app.use('/usuarios', userRoutes)

app.listen(3000, () => {
    console.log("Servidor on!")
})
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

// Rotas
import userRoutes from './routes/user.routes.js'
import livroRoutes from './routes/livro.routes.js'
import emprestimoRoutes from './routes/emprestimo.routes.js'
import authRoutes from './routes/auth.route.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/login', authRoutes)
app.use('/livros', livroRoutes)
app.use('/emprestimos', emprestimoRoutes)
app.use('/usuarios', userRoutes)

app.listen(3000, () => {
    console.log("Servidor on!")
})
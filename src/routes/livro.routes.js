import { Router } from 'express'
import { createLivro, getAllLivros, updateLivro, deleteLivro, getLivroById } from '../controllers/livro.controller.js'
import { validateLivro } from '../middlewares/validate.middleware.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { isBibliotecario } from '../middlewares/role.middleware.js'
const router = Router()

router.get('/', getAllLivros)
router.post('/cadastro', authMiddleware, isBibliotecario, createLivro)
router.get('/:id', validateLivro, getLivroById)
router.put('/:id', authMiddleware, isBibliotecario, validateLivro, updateLivro)
router.delete('/:id', authMiddleware, isBibliotecario, validateLivro, deleteLivro)

export default router
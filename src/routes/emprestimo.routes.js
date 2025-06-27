import { Router } from 'express'
import { atualizarEmprestimo, createEmprestimo, getAllEmprestimos, getEmprestimosAtivosFromUser } from '../controllers/emprestimo.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { isBibliotecario, isLeitor } from '../middlewares/role.middleware.js'
import { validateEmprestimo } from '../middlewares/validate.middleware.js'
const router = Router()

router.put('/atualizar/:id', authMiddleware, isBibliotecario, validateEmprestimo, atualizarEmprestimo)
router.get('/', authMiddleware, isBibliotecario, getAllEmprestimos)
router.get('/fromUser', authMiddleware, getEmprestimosAtivosFromUser)
router.get('/fromUser/:id', authMiddleware, getEmprestimosAtivosFromUser)


export default router
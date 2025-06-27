import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { isBibliotecario, isLeitor } from '../middlewares/role.middleware.js'
import { createSolicitacao, aprovarSolicitacao } from '../controllers/solicitacao.controller.js'
const router = Router()

router.post('/criar/', authMiddleware, isLeitor, createSolicitacao)
router.put('/aprovar/', authMiddleware, isBibliotecario, aprovarSolicitacao)

export default router
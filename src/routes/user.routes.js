import { Router } from 'express'
import { createUser, getAllUsers, getUserByToken, deleteUser } from '../controllers/user.controller.js'
import { validateUser } from '../middlewares/validate.middleware.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
const router = Router()

router.get('/', getAllUsers)
router.get('/tokenUser', authMiddleware, getUserByToken)
router.post('/cadastro', createUser)
router.delete('/:id', validateUser, authMiddleware, deleteUser)

export default router
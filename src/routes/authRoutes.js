import express from 'express'
import passport from 'passport'
import authMiddleware from '../middlewares/authMiddleware.js'
import authIsAdmin from '../middlewares/authIsAdmin.js'

const router = express.Router()

//rotas de teste de autentificação
router.get('/get-user', authMiddleware, (req, res) =>  {
    res.send(`Autorizado: ${req.user.nome}`)
})

router.get('/get-user/admin', authMiddleware, authIsAdmin, (req, res) =>  {
    res.send(`Autorizado: ${req.user.nome}`)
})
export default router
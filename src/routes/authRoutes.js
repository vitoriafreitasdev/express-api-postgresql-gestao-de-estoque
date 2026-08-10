import express from 'express'
import passport from 'passport'
import authMiddleware from '../utils/authMiddleware.js'
import authIsAdmin from '../utils/authIsAdmin.js'

const router = express.Router()

//rotas de teste de autentificação
router.get('/get-user', authMiddleware, (req, res) =>  {
    //verificar aqui ou no authMiddleware se o usuario ainda esta na sessao, antes fazer o teste de usuario sem sessao, mas com o token

    res.send(`Autorizado: ${req.user.nome}`)
})

router.get('/get-user/admin', authMiddleware, authIsAdmin, (req, res) =>  {
    res.send(`Autorizado: ${req.user.nome}`)
})
export default router
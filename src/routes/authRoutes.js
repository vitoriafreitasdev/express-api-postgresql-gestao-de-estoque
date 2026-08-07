import express from 'express'
import passport from 'passport'
import authMiddleware from '../utils/authMiddleware.js'
const router = express.Router()

router.get('/get-user', authMiddleware, (req, res) =>  {
    res.send(req.user)
})
export default router
import express from 'express'
import passport from 'passport'
import loginController from '../controllers/loginController.js'
const router = express.Router()

router.post('/worker', passport.authenticate('local'), (req, res) => loginController.jwtToken(req, res))


export default router

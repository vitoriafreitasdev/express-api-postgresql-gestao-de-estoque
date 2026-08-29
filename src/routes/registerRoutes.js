import express from 'express'
import passport from 'passport'
import registerController from '../controllers/registerController.js'
import loginController from '../controllers/loginController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import authIsAdmin from '../middlewares/authIsAdmin.js'

const router = express.Router()

router.post('/company', (req, res) =>  registerController.registerCompany(req, res))
router.post('/worker', registerController.registerWorker, passport.authenticate('local'), (req, res) => loginController.jwtToken(req, res))
router.post('/product', authMiddleware, authIsAdmin, (req, res) => registerController.registerProducts(req, res))

export default router
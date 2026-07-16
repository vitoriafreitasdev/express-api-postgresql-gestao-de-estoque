import express from 'express'
import registerController from '../controllers/registerController.js'
const router = express.Router()

router.post('/company', (req, res) =>  registerController.registerCompany(req, res))

export default router
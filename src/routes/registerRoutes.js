import express from 'express'
import registerController from '../controllers/registerController.js'
const router = express.Router()

router.post('/company', (req, res) =>  registerController.registerCompany(req, res))
router.post('/worker', (req, res) =>  registerController.registerWorker(req, res))


export default router
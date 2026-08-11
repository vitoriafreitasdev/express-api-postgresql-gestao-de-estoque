import express from 'express'
import passport from 'passport'
import updateAndDelController from '../controllers/updateAndDelController.js'
import authMiddleware from '../utils/authMiddleware.js'
import authIsAdmin from '../utils/authIsAdmin.js'

const router = express.Router()

router.put('/update/produto/:id', (req, res) => updateAndDelController.updateProdutos(req, res))

export default router
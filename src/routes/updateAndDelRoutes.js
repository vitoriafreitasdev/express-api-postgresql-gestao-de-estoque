import express from 'express'
import passport from 'passport'
import updateAndDelController from '../controllers/updateAndDelController.js'
import authMiddleware from '../utils/authMiddleware.js'
import authIsAdmin from '../utils/authIsAdmin.js'

const router = express.Router()

router.put('/update/produto/:id', authMiddleware, authIsAdmin, (req, res) => updateAndDelController.updateProdutos(req, res))
router.delete('/delete/produto/:id', authMiddleware, authIsAdmin, (req, res) => updateAndDelController.deleteProduto(req, res))
router.put('/sellProducts', authMiddleware, (req, res) => updateAndDelController.sellProducts(req, res))


export default router
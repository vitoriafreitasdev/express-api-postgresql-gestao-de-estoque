import express from 'express'
import passport from 'passport'
import updateAndDelController from '../controllers/updateAndDelController.js'
import authMiddleware from '../utils/authMiddleware.js'
import authIsAdmin from '../utils/authIsAdmin.js'
import sellUpdates from '../utils/sellUpdatesMiddleware.js'
const router = express.Router()

router.put('/update/produto/:id', authMiddleware, authIsAdmin, (req, res) => updateAndDelController.updateProdutos(req, res))
router.delete('/delete/produto/:id', authMiddleware, authIsAdmin, (req, res) => updateAndDelController.deleteProduto(req, res))
router.put('/sellProducts', authMiddleware, updateAndDelController.sellProducts, sellUpdates)


export default router
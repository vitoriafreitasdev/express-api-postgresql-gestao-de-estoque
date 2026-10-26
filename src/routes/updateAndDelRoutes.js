import express from 'express'
import updateAndDelController from '../controllers/updateAndDelController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import authIsAdmin from '../middlewares/authIsAdmin.js'
import sellUpdates from '../middlewares/sellUpdates.js'

const router = express.Router()

router.put('/update/produto/:id', authMiddleware, authIsAdmin, (req, res) => updateAndDelController.updateProdutos(req, res))
router.delete('/delete/produto/:id', authMiddleware, authIsAdmin, (req, res) => updateAndDelController.deleteProduto(req, res))
router.put('/sellProducts', authMiddleware, updateAndDelController.sellProducts, sellUpdates)


export default router
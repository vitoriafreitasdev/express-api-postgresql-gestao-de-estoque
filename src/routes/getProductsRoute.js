import express from 'express'
import getProdutosController from '../controllers/getProdutosController.js'

const router = express.Router()

router.get('/produtosBaixoEstoque', (req, res) => getProdutosController.produtosBaixoEstoque(req, res))

router.get('/:id', (req, res) => getProdutosController.mostrarProduto(req, res))


export default router
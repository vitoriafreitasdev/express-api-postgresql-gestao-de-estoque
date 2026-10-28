import express from 'express'
import getProdutosController from '../controllers/getProdutosInfoController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import authIsAdmin from '../middlewares/authIsAdmin.js'

const router = express.Router()

router.get('/produtosBaixoEstoque', authMiddleware, authIsAdmin, (req, res) => getProdutosController.produtosBaixoEstoque(req, res))
router.get('/relatorio', authMiddleware, authIsAdmin, (req, res) => getProdutosController.buscarRelatorio(req, res))
router.get('/relatorio_vendas_por_periodo', authMiddleware, authIsAdmin, (req, res) => getProdutosController.buscarVendasPorPeriodo(req, res))
router.get('/:id', (req, res) => getProdutosController.mostrarProduto(req, res))
router.get('/', authMiddleware, (req, res) => getProdutosController.mostrarProdutos(req, res))


export default router
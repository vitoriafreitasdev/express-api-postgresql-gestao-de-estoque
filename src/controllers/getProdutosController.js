import Produtos from "../models/Produtos.js"
import bwipjs from 'bwip-js'; 
import fs from 'fs'
//fazer => Histórico de movimentações por período
//fazer => Relatório de produtos mais vendidos e margem de lucro
const getProdutosController = {
    mostrarProduto: async (req, res) => {
        try {
            const {id} = req.params
            const produto = await Produtos.find('id', id)
        
            try {
                const imageBuffer = await bwipjs.toBuffer({
                bcid:        'code128',       // Barcode type
                text:        produto.codigo_de_barras,    // Text to encode
                scale:       3,               // 3x scaling factor
                height:      10,              // Bar height, in millimeters
                includetext: true,            // Show human-readable text
                textxalign:  'center',        // Always good to set this
                })

                const base64 = imageBuffer.toString('base64')
            
                return res.status(200).json({produto: produto, codigoBarrasImg: base64})
            } catch (error) {
                return res.status(400).json({msg: "Erro no servidor, tente novamente mais tarde.", error: error.message})
            }

        } catch (error) {
            return res.status(400).json({msg: "Erro no servidor, tente novamente mais tarde.", error: error.message})
        }

    },
    produtosBaixoEstoque: async (req, res) => {
        try {
            const produtosBaixoEstoque = await Produtos.getProductsLowStock()
            return res.status(200).json({produtos_baixo_estoque: produtosBaixoEstoque})
        } catch (error) {
            return res.status(400).json({msg: "Erro no servidor, tente novamente mais tarde.", error: error.message})
        }
    }
}

export default getProdutosController
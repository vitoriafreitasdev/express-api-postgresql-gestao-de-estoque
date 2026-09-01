import Produtos from "../models/Produtos.js"
import RelatorioVendas from "../models/RelatorioVendas.js";
import bwipjs from 'bwip-js'; 

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
            console.log(error)
            return res.status(400).json({msg: "Erro no servidor, tente novamente mais tarde.", error: error.message})
        }

    },
    produtosBaixoEstoque: async (req, res) => {
        try {
            const produtosBaixoEstoque = await Produtos.getProductsLowStock()
            return res.status(200).json({produtos_baixo_estoque: produtosBaixoEstoque})
        } catch (error) {
            console.log(error)
            return res.status(400).json({msg: "Erro no servidor, tente novamente mais tarde.", error: error.message})
        }
    },
    buscarRelatorio: async (req, res) => {
        try {
            const relatorio = await RelatorioVendas.get()
            res.status(200).json({relatorio: relatorio})
        } catch (error) {
            console.log(error)
            return res.status(400).json({msg: "Erro no servidor, tente novamente mais tarde.", error: error.message})            
        }
    },
    buscarVendasPorPeriodo: async (req, res) => {
        try {
            const {periodo} = req.body
            const relatorio = await RelatorioVendas.get()
            const vendasDoPeriodo = relatorio.filter((venda) =>{
                const data = venda.data_de_venda.toLocaleString().split(',')[0]
                if(periodo.includes(data.split('/')[1])){
                    return true
                }
                return false
            })
            
            const lucroPorPeriodo = vendasDoPeriodo.reduce((acomulador, valor) => {
                acomulador += Number(valor.lucro_da_venda_total)
                return acomulador
            }, 0)

            res.status(200).json({vendasDoPeriodo: vendasDoPeriodo, vendaTotal: lucroPorPeriodo})
        } catch (error) {
            console.log(error)
            return res.status(400).json({msg: "Erro no servidor, tente novamente mais tarde.", error: error.message})
        }
    }
}

export default getProdutosController
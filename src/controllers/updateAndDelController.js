import pool from "../db.js";

import Produtos from "../models/Produtos.js";

const updateAndDelController = {
    updateProdutos: async (req, res) => {
        try {
            const {id} = req.params
            const produtoFind = await Produtos.find('id', id)

            const produto = new Produtos(produtoFind.id, produtoFind.nome, produtoFind.preco, produtoFind.preco_de_venda, produtoFind.quantidade, produtoFind.codigo_de_barras, produtoFind.id_empresa_fk)
            
            if(req.body.nome) await produto.update('nome', req.body.nome)
            if(req.body.preco) await produto.update('preco', req.body.preco)
            if(req.body.preco_de_venda) await produto.update('preco_de_venda', req.body.preco_de_venda)
            if(req.body.quantidade) await produto.update('quantidade', req.body.quantidade)
            if(req.body.codigo_de_barras) await produto.update('codigo_de_barras', req.body.codigo_de_barras)

            res.status(201).json({msg: "Atualizado com sucesso.", data: produto})
        } catch (error) {
            res.status(500).json({msg: "Erro no sistema, tente novamente.", error: error.message})
        }
    },
    deleteProduto: async (req, res) => {
        try {
            const {id} = req.params
            await Produtos.delete(id)
            res.status(201).json({msg: "Deletado com sucesso."})
        } catch (error) {
            res.status(500).json({msg: "Erro no sistema, tente novamente.", error: error.message})
        }
    }, 
    sellProducts: async (req, res, next) => {
        try {
            
            const {list} = req.body
            if(list.length > 1){
                const items = list.map((item) => item.codigo_de_barras)
                const result = await Produtos.findMany('codigo_de_barras', items)
                if(!result) return res.status(400).json({msg: "Nenhum resultado encotrado."})
                //colocando a lista e os resultaddos na mesma ordem
                const resultSorted = result.sort((a, b) => a.codigo_de_barras - b.codigo_de_barras)
                const listSorted = list.sort((a, b) => a.codigo_de_barras - b.codigo_de_barras)
                
                let productsAtt = []
                let productsSemEstoque = []
                let quantidadeDisponivelInsuficiente = []
                let lucroTotal = 0

                if(resultSorted.length !== listSorted.length){
                    const newResult = resultSorted.map((item) => (item.codigo_de_barras))
                    const filter = items.filter((item) => !newResult.includes(item))

                    return res.status(400).json({msg:"Alguns dos produtos não foi encontrado.", nao_encontrados: filter})
                }
                for(let i = 0; i < resultSorted.length; i++){
        
                    const quantidadeDeVenda = listSorted[i].quantidade
                    const produto = await Produtos.updateQuant(resultSorted[i], quantidadeDeVenda)

                    if(!produto){
                        productsSemEstoque.push(produto)
                        quantidadeDisponivelInsuficiente.push(produto)
                        continue
                    }

                    const lucro = (resultSorted[i].preco_de_venda - resultSorted[i].preco) * quantidadeDeVenda
                    lucroTotal += lucro
                    const obj = {produto, lucro, quantidadeDeVenda}

                    productsAtt.push(obj)
                }
                req.produtos_vendidos = productsAtt
                req.produtos_sem_estoque = productsSemEstoque
                req.quantidade_disponivel_insuficiente = quantidadeDisponivelInsuficiente
                req.lucro_total = lucroTotal

                return next()
            }
            
            const quantidadeDeProduto = list[0].quantidade
            const produto = await Produtos.find('codigo_de_barras', list[0].codigo_de_barras)

            if(produto == null) return res.status(400).json({msg:"Produto não encontrado."})
            
            const update = await Produtos.updateQuant(produto, quantidadeDeProduto)

            if(update == null) {
                return res.status(400).json({msg:"Produto sem estoque suficiente para o pedido."})
            }

            const lucroTotal = update.preco_de_venda - update.preco

            req.produtos_vendidos = update
            req.produtos_sem_estoque = null
            req.quantidade_disponivel_insuficiente = null
            req.lucro_total = lucroTotal

            return next()
            
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Erro no sistema, tente novamente.", error: error.message})
        }
    }
}

export default updateAndDelController
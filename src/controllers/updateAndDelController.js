import pool from "../db.js";
import Empresas from "../models/Empresas.js"; 
import Funcionarios from "../models/Funcionarios.js";
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
            
                    const produto = new Produtos(resultSorted[i].id, resultSorted[i].nome, resultSorted[i].preco, resultSorted[i].preco_de_venda, resultSorted[i].quantidade, resultSorted[i].codigo_de_barras, resultSorted[i].id_empresa_fk)
                    const quantidadeDeVenda = listSorted[i].quantidade
                    const quantidade = produto.quantidade - quantidadeDeVenda

                    if(produto.quantidade == 0){
                        productsSemEstoque.push(produto)
                        continue
                    }

                    if(quantidade < 0){
                        quantidadeDisponivelInsuficiente.push(produto)
                        continue
                    }

                    
                    await produto.update('quantidade', quantidade)

                    const lucro = (produto.preco_de_venda - produto.preco) * quantidadeDeVenda
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
            else{
                const result = await Produtos.find('codigo_de_barras', list[0].codigo_de_barras)
                const quantidadeDeProduto = list[0].quantidade
                
                if(!result) return res.status(400).json({msg: "Nenhum resultado encotrado."})

                if(result.quantidade == 0){
                    return res.status(400).json({msg: "Produto sem estoque."})
                }
                const produto = new Produtos(result.id, result.nome, result.preco, result.preco_de_venda, result.quantidade, result.codigo_de_barras, result.id_empresa_fk)
                
                const quantidade = produto.quantidade - quantidadeDeProduto

                if(quantidade < 0) {
                    return res.status(400).json({msg:"Produto sem estoque suficiente para o pedido."})
                }

            
                await produto.update('quantidade', quantidade)
                
                const lucroTotal = produto.preco_de_venda - produto.preco

                req.produtos_vendidos = produto
                req.produtos_sem_estoque = null
                req.quantidade_disponivel_insuficiente = null
                req.lucro_total = lucroTotal

                return next()
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Erro no sistema, tente novamente.", error: error.message})
        }
    }
}

export default updateAndDelController
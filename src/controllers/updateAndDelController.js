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
    sellProducts: async (req, res) => {
        try {
            const {list} = req.body

            if(list.length > 1){
                const items = list.map((item) => item.itemIdentificador)
                const quantidadeList = list.map((item) => item.quantidade)
   
                const result = await Produtos.findMany('codigo_de_barras', items)
                
                let productsAtt = []
                let productsSemEstoque = []

                if(!result) return res.status(400).json({msg: "Nenhum resultado encotrado."})

                
                for(let i = 0; i < result.length; i++){
            
                    const produto = new Produtos(result[i].id, result[i].nome, result[i].preco, result[i].preco_de_venda, result[i].quantidade, result[i].codigo_de_barras, result[i].id_empresa_fk)

                    if(result[i].quantidade == 0){
                        productsSemEstoque.push(produto)
                        continue
                    }
                    const quantidade = result[i].quantidade - quantidadeList[i] 
    
                    if(quantidade > 0){
                        await produto.update('quantidade', quantidade)
                    }else{
                        await produto.update('quantidade', 0)
                    }

                    productsAtt.push(produto)

                }
    
                
                if(result.length !== list.length){
                    //items que não foram encotrados
                    let itemsNotIncluded = []
                
                    for(let i = 0; i < list.length; i++){
                        for(let j = 0; j < result.length; j++){
                            if(result[j].codigo_de_barras !== list[i].itemIdentificador){
                                itemsNotIncluded.push(list[i].itemIdentificador)
                            }
                        }
                    }

                    return res.status(400).json({msg:"Algum dos produtos não foi encontrado.", nao_encotrados: itemsNotIncluded, produtos_sem_estoque: productsSemEstoque, atualizados: productsAtt})
                }
                
                return res.status(200).json({msg: "Sucesso.", atualizados: productsAtt, produtos_sem_estoque: productsSemEstoque})
               
            }
            else{
                const result = await Produtos.find('codigo_de_barras', list[0].itemIdentificador)
                if(!result) return res.status(400).json({msg: "Nenhum resultado encotrado."})

                const produto = new Produtos(result.id, result.nome, result.preco, result.preco_de_venda, result.quantidade, result.codigo_de_barras, result.id_empresa_fk)
                const quantidade = result.quantidade - 1 
    
                if(quantidade > 0){
                    await produto.update('quantidade', quantidade)
                }else{
                    await produto.update('quantidade', 0)
                }

                return res.status(200).json({msg: "Sucesso.", data: produto})
            }

            //falta colocar o total do preço

        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Erro no sistema, tente novamente.", error: error.message})
        }
    }
}

export default updateAndDelController
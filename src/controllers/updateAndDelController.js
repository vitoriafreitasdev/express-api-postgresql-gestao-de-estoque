import pool from "../db.js";
import Empresas from "../models/Empresas.js"; 
import Funcionarios from "../models/Funcionarios.js";
import Produtos from "../models/Produtos.js";

const updateAndDelController = {
    updateProdutos: async (req, res) => {
        const {id} = req.params
        
        const produtoFind = await Produtos.find('id', id)

        const produto = new Produtos(produtoFind.id, produtoFind.nome, produtoFind.preco, produtoFind.preco_de_venda, produtoFind.quantidade, produtoFind.codigo_de_barras, produtoFind.id_empresa_fk)
        
        if(req.body.nome) await produto.update('nome', req.body.nome)
        if(req.body.preco) await produto.update('preco', req.body.preco)
        if(req.body.preco_de_venda) await produto.update('preco_de_venda', req.body.preco_de_venda)
        if(req.body.quantidade) await produto.update('quantidade', req.body.quantidade)
        if(req.body.codigo_de_barras) await produto.update('codigo_de_barras', req.body.codigo_de_barras)

        res.send(produto)

    }
}

export default updateAndDelController
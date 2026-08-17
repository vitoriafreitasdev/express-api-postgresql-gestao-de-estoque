import pool from "../db.js";

class ProdutosBaixoEstoque{
    constructor(idProduto, idEmpresa, quantidade){
        this.idProduto = idProduto
        this.idEmpresa = idEmpresa
        this.quantidade = quantidade
    }
    async create(){
        try {
            const create = await pool.query(`INSERT INTO ProdutosBaixoEstoque(id_produto, id_empresa, quantidade) VALUES($1, $2, $3) RETURNING *`, [this.idProduto, this.idEmpresa, this.quantidade]) 
            if(create.rowCount > 0){
                return create.rows
            }
            return null
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async updateQuantidade(quantidade){
        try {
            await pool.query(`UPDATE ProdutosBaixoEstoque SET quantidade = $1`, [quantidade])
            this.quantidade = quantidade
            return true
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async delete(){
        try {
            await pool.query(`DELETE FROM ProdutosBaixoEstoque WHERE id_produto = $1 AND id_empresa  = $2`, [this.idProduto, this.idEmpresa])
            return true
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default ProdutosBaixoEstoque
import pool from "../db.js";

class RelatorioVendas{
    constructor(idProduto, idEmpresa, idVendedor, quantidade, dataDeVenda){
        this.idProduto = idProduto
        this.idEmpresa = idEmpresa
        this.idVendedor = idVendedor
        this.quantidade = quantidade
        this.dataDeVenda = dataDeVenda
    }

    async create(){
        try {
            await pool.query(`INSERT INTO Relatorio_vendas(id_produto, id_empresa, id_vendedor, quantidade_vendida, data_de_venda) VALUES($1, $2, $3, $4, $5)`, [this.idProduto, this.idEmpresa, this.idVendedor, this.quantidade, this.dataDeVenda])
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async get(){
        try {
            const find = await pool.query(`SELECT (id_produto, id_empresa, id_vendedor, quantidade_vendida, data_de_venda) FROM Relatorio_vendas RETURNING *`)
            if(find.rowCount > 0){
                return find.rows
            }
            return null
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async deleteAll(){
        try {
           await pool.query(`DELETE FROM Relatorio_vendas`)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default RelatorioVendas
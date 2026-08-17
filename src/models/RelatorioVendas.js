import pool from "../db.js";

class RelatorioVendas{
    constructor(id_produto, id_empresa, id_vendedor, quantidade_vendida, data_de_venda){
        this.id_produto = id_produto
        this.id_empresa = id_empresa
        this.id_vendedor = id_vendedor
        this.quantidade_vendida = quantidade_vendida
        this.data_de_venda = data_de_venda
    }

    create(){
        try {
            const create = await pool.query(`INSERT INTO Relatorio_vendas(id_produto, id_empresa, id_vendedor, quantidade_vendida, data_de_venda) VALUES($1, $2, $3, $4, $5) RETURNING *`, [this.id_produto, this.id_empresa, this.id_vendedor, this.quantidade_vendida, this.data_de_venda])
            if(create.rowCount > 0){
                return create.rows
            }
            return null
        } catch (error) {
            throw new Error(error.message)
        }
    }

    deleteAll(){
        try {
           await pool.query(`DELETE FROM Relatorio_vendas`)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
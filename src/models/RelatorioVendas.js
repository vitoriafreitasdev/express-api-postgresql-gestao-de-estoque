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
            throw new Error(error)
        }
    }

    static async get(){
        try {
            const find = await pool.query(`SELECT 
                                                p.nome as produto, e.nome as empresa, f.nome as funcionario, r.quantidade_vendida, r.data_de_venda, 
                                                p.quantidade as quantidade_restante, p.preco_de_venda, p.preco as preco_de_compra, 
                                                (p.preco_de_venda - p.preco) * r.quantidade_vendida as lucro_da_venda_total
                                            FROM Relatorio_vendas r
                                                INNER JOIN Produtos p
                                                    ON p.id = r.id_produto
                                                INNER JOIN Funcionarios f
                                                    ON f.id = r.id_vendedor
                                                INNER JOIN Empresas e
                                                    ON e.id = r.id_empresa`)
            if(find.rowCount > 0){
                return find.rows
            }
            return null
        } catch (error) {
            throw new Error(error)
        }
    }
    static async deleteAll(){
        try {
           await pool.query(`DELETE FROM Relatorio_vendas`)
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default RelatorioVendas
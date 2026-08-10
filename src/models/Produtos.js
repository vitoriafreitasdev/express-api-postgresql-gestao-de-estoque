/*
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    preco NUMERIC(6, 2),
    quantidade INTEGER NOT NULL DEFAULT 0, 
    codigo_de_barras VARCHAR(50) NOT NULL,
    id_empresa_fk INTEGER NOT NULL,
*/

import pool from "../db.js"

class Produtos{
    constructor(nome, preco, quantidade, preco_de_venda, codigo_de_barras, id_empresa_fk){
        this.id = null 
        this.preco = preco
        this.quantidade = quantidade
        this.preco_de_venda = preco_de_venda
        this.codigo_de_barras = codigo_de_barras
        this.id_empresa_fk = id_empresa_fk
    }

    async create(){
        try {
            const result = await pool.query(`INSERT INTO Produtos (nome, preco, quantidade, preco_de_venda, codigo_de_barras, id_empresa_fk) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [this.nome, this.preco, this.quantidade, this.preco_de_venda, this.codigo_de_barras, this.id_empresa_fk])
            this.id = result.rows[0].id
            return result
        } catch (error) {
            throw new Error(error)
        }
    }
    
    static async find(nameValue, value){
        try {
            const find = await pool.query(`SELECT * FROM Produtos WHERE ${nameValue} = $1`, [value])
            if(find.rowCount > 0){
                return find.rows[0]
            }
            return null
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default Produtos
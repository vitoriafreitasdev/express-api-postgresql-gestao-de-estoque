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
    constructor(id = null, nome, preco, preco_de_venda, quantidade, codigo_de_barras, id_empresa_fk){
        this.id = id 
        this.nome = nome
        this.preco = preco
        this.quantidade = quantidade
        this.preco_de_venda = preco_de_venda
        this.codigo_de_barras = codigo_de_barras
        this.id_empresa_fk = id_empresa_fk
    }

    async create(){
        try {
            const result = await pool.query(`INSERT INTO Produtos (nome, preco, preco_de_venda, quantidade, codigo_de_barras, id_empresa_fk) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [this.nome, this.preco, this.preco_de_venda, this.quantidade, this.codigo_de_barras, this.id_empresa_fk])
            this.id = result.rows[0].id
            return result.rows[0]
        } catch (error) {
            throw new Error(error)
        }
    }

    async update(valueToUpdate, value){
        try {
            const result = await pool.query(`UPDATE Produtos SET ${valueToUpdate} = $1 WHERE id = ${this.id} RETURNING *`, [value])
            if(valueToUpdate == 'nome') this.nome = result.rows[0].nome
            if(valueToUpdate == 'preco') this.preco = result.rows[0].preco
            if(valueToUpdate == 'preco_de_venda') this.preco_de_venda = result.rows[0].preco_de_venda
            if(valueToUpdate == 'quantidade') this.quantidade = result.rows[0].quantidade
            if(valueToUpdate == 'codigo_de_barras') this.codigo_de_barras = result.rows[0].codigo_de_barras

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
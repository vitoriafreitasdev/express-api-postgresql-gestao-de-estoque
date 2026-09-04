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
    constructor(id, nome, preco, preco_de_venda, quantidade, codigo_de_barras, id_empresa_fk){
        this.id = id
        this.nome = nome
        this.preco = preco
        this.preco_de_venda = preco_de_venda
        this.quantidade = quantidade
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

    async updateQuant(quantidade){
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const productRes = await client.query(
            'SELECT quantidade FROM Produtos WHERE id = $1 FOR UPDATE', 
            [this.id]);
  
            const stock = productRes.rows[0].quantidade;

            if (stock <= 0) {
                await client.query('ROLLBACK');
                return null
            }

            // 3. Decrease stock
            await client.query(
                'UPDATE Produtos SET quantidade = quantidade - $1 WHERE id = $2', 
                [quantidade, this.id]
            );

            await client.query('COMMIT');
            
            this.quantidade = this.quantidade - quantidade
            return true

            } catch (error) {
                await client.query('ROLLBACK');
                return null
            } finally {
                client.release();
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

        } 
        catch(error) {
            throw new Error(error)
        }
    }

    static async delete(id){
        try{
            await pool.query(`DELETE from Produtos WHERE id = $1`, [id])
        }
        catch(error) {
            throw new Error(error)
        }
    }
    
    static async findMany(value, valuesList){
        try {
            const query = `SELECT id, nome, preco, preco_de_venda, quantidade, codigo_de_barras, id_empresa_fk FROM Produtos WHERE ${value} in 
            (${valuesList.map( (x, index) => {return `$${index+1}`} )})`
            const find = await pool.query(query, valuesList)
            if(find.rowCount > 0){
                return find.rows
            }
            return null
        } 
        catch (error) {
            throw new Error(error)
        }
    }
    static async find(nameValue, value){
        try {
            const find = await pool.query(`SELECT id, nome, preco, preco_de_venda, quantidade, codigo_de_barras, id_empresa_fk FROM Produtos WHERE ${nameValue} = $1`, [value])
            if(find.rowCount > 0){
                return find.rows[0]
            }
            return null
        } 
        catch (error) {
            throw new Error(error)
        }
    }

    static async getProductsLowStock(){
        try {
            const find = await pool.query(`SELECT id, nome, preco, preco_de_venda, quantidade, codigo_de_barras, id_empresa_fk FROM Produtos WHERE quantidade <= 20`)
            if(find.rowCount > 0){
                return find.rows
            }
            return null
        } catch (error) {
            throw new Error(error)
        }
    }

}

export default Produtos
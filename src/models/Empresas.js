import pool from "../db.js";

class Empresas{
    constructor(nome, cnpj){
        this.id = null
        this.nome = nome
        this.cnpj = cnpj
    }

    async create(){
        const result = await pool.query(`INSERT INTO Empresas (nome, CNPJ) VALUES ($1, $2) RETURNING *`, [this.nome, this.cnpj])
        this.id = result.rows[0].id
        return result
    }
    static async find(nameValue, value){
        const find = await pool.query(`SELECT * FROM Empresas WHERE ${nameValue} = $1`, [value])
        return find.rows
    }
    static async findAll(){
        const find = await pool.query(`SELECT * FROM Empresas`)
        return find.rows

        
    }
}

export default Empresas
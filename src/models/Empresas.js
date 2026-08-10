import pool from "../db.js";

class Empresas{
    constructor(nome, cnpj){
        this.id = null
        this.nome = nome
        this.cnpj = cnpj
    }

    async create(){
        try {
            const result = await pool.query(`INSERT INTO Empresas (nome, CNPJ) VALUES ($1, $2) RETURNING *`, [this.nome, this.cnpj])
            this.id = result.rows[0].id
            return result
        } catch (error) {
            throw new Error(error)
        }
    }
    static async find(nameValue, value){
        try{
            const find = await pool.query(`SELECT * FROM Empresas WHERE ${nameValue} = $1`, [value])
            if(find.rowCount > 0){
                return find.rows
            }
            return null
        }
        catch (error) {
            throw new Error(error)
        }
    }
    static async findAll(){
        try{
            const find = await pool.query(`SELECT * FROM Empresas`)
            if(find.rowCount > 0){
                return find.rows
            }
            return null
        }
        catch (error) {
            throw new Error(error)
        }
    }
}

export default Empresas
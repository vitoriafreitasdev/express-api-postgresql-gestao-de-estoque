import pool from "../db.js";

class Funcionarios{
    constructor (nome, email, senha, isAdmin, id_empresa_fk){
        this.id = null
        this.nome = nome
        this.senha = senha 
        this.isAdmin = isAdmin
        this.email = email
        this.id_empresa_fk = id_empresa_fk
    }

    async create(){
        const result = await pool.query(`INSERT INTO Funcionarios (nome, senha, isAdmin, email, id_empresa_fk) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [this.nome, this.senha, this.isAdmin, this.email, this.id_empresa_fk])
        this.id = result.rows[0].id
        return result
    }

    static async find(nameValue, value){
        const find = await pool.query(`SELECT * FROM Funcionarios WHERE ${nameValue} = $1`, [value])
        if(find.rowCount > 0){
            return find.rows[0]
        }
        return null
    }
}

export default Funcionarios
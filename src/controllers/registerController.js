import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const registerController = {
    registerCompany: async (req, res) => {
        const {name, cnpj} = req.body  
        const hashCnpj = await bcrypt.hash(cnpj, 10)
        //pegando as empresas que tem o mesmo nome
        const existingCompanys = await pool.query(`SELECT * FROM Empresas WHERE nome = $1`, [name])
        //verificando se a empresas com o mesmo nome tem o mesmo cnpj, se tiver retorna verdadeiro
        const exists = existingCompanys.rows.find(async (company) => {
            const compare = await bcrypt.compare(cnpj, company.cnpj)
            if (compare) {
                return true
            } else{
                return false
            }
        })
        if(exists){
            return res.status(400).json({message: "Empresa já existente."})
        }
        const result = await pool.query(`INSERT INTO Empresas (nome, CNPJ) VALUES ($1, $2) RETURNING *`, [name, hashCnpj])
        return res.status(201).json({message: "Criado com sucesso", data: result.rows[0]})
    }
}

export default registerController
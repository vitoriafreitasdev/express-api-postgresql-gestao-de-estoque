import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import Empresas from "../models/Empresas.js"; 

const registerController = {
    registerCompany: async (req, res) => {
        const {nome, cnpj} = req.body  
        //fazer validação se o cnpj esta em um formato valido AA.AAA.AAA/AAAA-XX ou XX.XXX.XXX/XXXX-XX
        const match = cnpj.match(/^\w{2}\.\w{3}\.\w{3}\/\w{4}\-\d{2}$/)

        if(!match){
            return res.status(400).json({message: "CNPJ com formato inválido."})
        }
        
        const existingCompanys = await Empresas.findAll()
        
        const exist = existingCompanys.find((company) => bcrypt.compareSync(cnpj, company.cnpj))

        if(exist) return res.status(400).json({message: "Empresa já existente."})  
        const hashCnpj = await bcrypt.hash(cnpj, 10)
        const newCompany = new Empresas(nome, hashCnpj)
        const result = await newCompany.create()

        return res.status(201).json({message: "Criado com sucesso", data: newCompany})
    },
    registerWorker: async (req, res) => {
        const {nome, email, senha, isAdmin, nomeEmpresa, empresaCnpj} = req.body 

        const existingCompanys = await Empresas.find("nome", nomeEmpresa)
        const exist = existingCompanys.find((company) => bcrypt.compareSync(empresaCnpj, company.cnpj))
        
        res.send(exist)
    }
}

export default registerController
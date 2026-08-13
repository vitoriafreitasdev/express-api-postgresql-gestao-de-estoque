import pool from "../db.js";
import bcrypt from "bcryptjs";
import Empresas from "../models/Empresas.js"; 
import Funcionarios from "../models/Funcionarios.js";
import Produtos from "../models/Produtos.js";

const registerController = {
    registerCompany: async (req, res) => {
        try {
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
        } catch (error) {
            return res.status(500).json({message: "Erro no sistema, tente novamente mais tarde.", error: error.message})
        }
    },
    registerWorker: async (req, res, next) => {
        try {
            const {nome, email, senha, isAdmin, nomeEmpresa, empresaCnpj} = req.body 

            const existingCompanys = await Empresas.find("nome", nomeEmpresa)
            const exist = existingCompanys.find((company) => bcrypt.compareSync(empresaCnpj, company.cnpj))
            if(!exist){
                return res.status(400).json({message: "Empresa não encontrada."}) 
            }

            const companyId = exist.id
            const hashPass = await bcrypt.hash(senha, 10)
            const worker = new Funcionarios(nome, email, hashPass, isAdmin, companyId) 
           
            await worker.create()
            
            return next()
        } catch (error) {
            return res.status(500).json({message: "Erro no sistema, tente novamente mais tarde.", error: error.message})
        }
        
    },
    registerProducts: async (req, res) => {
       try {
            const {nome, preco, preco_de_venda, quantidade, codigo_de_barras} = req.body
            const id_empresa_fk = req.user.id_empresa_fk

            //verificando se o comprimento do codigo de barras passa do valor maximo de caracteres do banco de dados
            if(codigo_de_barras.length > 50){
                return res.status(400).json({message: "Comprimento máximo do codigo barras atingido (50 caracteres)."})
            } 

            const existingCompanys = await Empresas.find("id", id_empresa_fk)
         
            if(!existingCompanys){
                    return res.status(400).json({message: "Empresa não encontrada."}) 
            }
            const newProduct = new Produtos(null, nome, preco, preco_de_venda, quantidade, codigo_de_barras, id_empresa_fk)

            const result = await newProduct.create()
            res.send(result)
       } catch (error) {
            if(error.message === 'error: duplicar valor da chave viola a restrição de unicidade \"produtos_codigo_de_barras_key\"'){
                return res.status(500).json({message: "Produto com esse código de barras já existente.", error: error.message})
            }
            return res.status(500).json({message: "Erro no sistema, tente novamente mais tarde.", error: error.message})
       }
    }
}

export default registerController
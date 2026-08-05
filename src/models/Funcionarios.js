import pool from "../db.js";

class Funcionarios{
    constructor (nome, email, senha, isAdmin, id_empresa_fk){
        this.id = null
        this.nome = nome
        this.senha = senha 
        this.isAdmin = isAdmin
        this.email = id_empresa_fk
    }
}
import passport from 'passport';
import passportLocal from 'passport-local'
import pool from '../db.js';
import Funcionarios from '../models/Funcionarios.js';
import bcrypt from 'bcryptjs';
const LocalStrategy = passportLocal.Strategy;

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
}

const verifyPassword = async (text, passwordHash) => {
    return await bcrypt.compare(text, passwordHash)
}

const verifyCallback =  (usernameField, passwordField, cb) => {

    Funcionarios.find("email", usernameField)
        .then( async (data) => {
            if(!data) {return cb(null, false)}
       
            const isCorrect = await verifyPassword(passwordField, data.senha)
      
            if(isCorrect){
                return cb(null, data)
            }
            else{
                return cb(null, false)
            }
        })
        .catch((err) => {cb(err)})

}

const strategy = new LocalStrategy(customFields, verifyCallback)

passport.use(strategy)


passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser((userId, cb) => {
    Funcionarios.find('id', userId)
        .then((data) => {
            const objToReturn = {
                id: data.id,
                nome: data.nome, 
                email: data.email,
                isadmin: data.isadmin,
                id_empresa_fk: data.id_empresa_fk
            }
            cb(null, objToReturn)
        })
        .catch(err => cb(err))
})
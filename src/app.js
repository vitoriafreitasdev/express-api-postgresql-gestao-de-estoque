
import express from 'express'

import registerRouter from './routes/registerRoutes.js'
import loginRouter from './routes/loginRoutes.js'
import authRouter from './routes/authRoutes.js'
import updateDelRouter from './routes/updateAndDelRoutes.js'
import getProductsRouter from './routes/getProductsRoute.js'

import passport from 'passport';
import session from 'express-session'
import connectPg from 'connect-pg-simple'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import path from 'path'

import './passport/config.js'

const PostgresqlStore = connectPg(session);
const sessionStore = new PostgresqlStore({
  conString: process.env.STRING_CONN_SESSION,
});

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = 5003
const app = express()

//aqui conseguimos fazer requisição para com a mesma origem com a configuração atual da session e do JWT (com sameSite: lax e secure: false)
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

// app.use(cors({
//     origin: 'http://127.0.0.1:5500', // URL Front-End de teste
//     credentials: true 
// }))


//para usar no browser vindo de uma dominio diferente precisa sameSite: 'none' e secure = true, mas para isso precisa ser https
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    secure: false,    
    httpOnly: true,                                 
    sameSite: 'lax',      
    maxAge: 24 * 60 * 60 * 1000 
  }, 
  store: sessionStore
}));

app.use(passport.initialize())
app.use(passport.session())
//rotade teste de autenticação
app.use('/auth', authRouter)
//11 endpoints no total 
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/edit', updateDelRouter)
app.use('/produtosget', getProductsRouter)



app.listen(port, () => {
    console.log("Server is listening on port: ", port)
})
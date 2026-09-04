
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

import './passport/config.js'

const PostgresqlStore = connectPg(session);
const sessionStore = new PostgresqlStore({
  conString: process.env.STRING_CONN_SESSION,
});

const port = 5003
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(cors({
    origin: 'http://127.0.0.1:5500', // URL Front-End de teste
    credentials: true 
}))

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,               
    secure: false,                   
    sameSite: 'lax',                 
    maxAge: 24 * 60 * 60 * 1000 
  }, 
  store: sessionStore
}));

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => { 
  res.send(`<div>Bem vindo</div`)
})

//para testes
app.get('/login', (req, res) => { 
  const form = '<h1>Login Page</h1><form method="POST" action="/login/worker">\
    Enter Username:<br><input type="text" name="email">\
    <br>Enter Password:<br><input type="password" name="senha">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
})


app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/auth', authRouter)
app.use('/edit', updateDelRouter)
app.use('/produtosget', getProductsRouter)


app.listen(port, () => {
    console.log("Server is listening on port: ", port)
})
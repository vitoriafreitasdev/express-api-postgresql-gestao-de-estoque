
import express from 'express'
import registerRouter from './routes/registerRoutes.js'
import loginRouter from './routes/loginRoutes.js'
import authRouter from './routes/authRoutes.js'
import passport from 'passport';
import session from 'express-session'
import connectPg from 'connect-pg-simple'
import cookieParser from 'cookie-parser'

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

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,               
    secure: false,                   
    sameSite: 'auto',                 
    maxAge: 24 * 60 * 60 * 1000 
  }, 
  store: sessionStore
}));

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => { 
  res.send(`<div>Bem vindo</div`)
})

app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/auth', authRouter)

app.listen(port, () => {
    console.log("Server is listening on port: ", port)
})
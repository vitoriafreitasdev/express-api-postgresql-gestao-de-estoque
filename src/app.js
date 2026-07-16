
import express from 'express'
import registerRouter from './routes/registerRoutes.js'

const port = 5003
const app = express()

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => { res.send('Bem vindo')})

app.use('/register', registerRouter)

app.listen(port, () => {
    console.log("Server is listening on port: ", port)
})

import fs from 'fs'
import path from 'path'
import jsonwebtoken from 'jsonwebtoken'

const currentDir = import.meta.dirname;

const pathToKeyPub = path.join(currentDir, '../utils/id_rsa_pub.pem');

const PUB_KEY = fs.readFileSync(pathToKeyPub, 'utf8');

function authMiddleware(req, res, next){

  const token = req.cookies['jwt'] ? req.cookies['jwt'].token : null
  const sessionExpire = !req.user ? true : false 
  
  if(token && !sessionExpire)
  {
    try {
      const verification = jsonwebtoken.verify(token, PUB_KEY, {algorithms: ['RS256']})

      req.jwt = verification
      next()
    } catch (error) {
      console.log(error)
      res.status(401).json({msg: 'Não autorizado, token inválido.', err: error.message})
    }
    
  }
  else {
    
    if(!token && sessionExpire) return res.status(401).json({msg: 'Não autorizado, sem token de acesso e sessão expirou.'})
    
    if(sessionExpire) return res.status(401).json({msg: 'Não autorizado, sessão expirou.'})

    return res.status(401).json({msg: 'Não autorizado, sem token de acesso.'})

  }

}

export default authMiddleware
import fs from 'fs'
import path from 'path'
import jsonwebtoken from 'jsonwebtoken'

const currentDir = import.meta.dirname;

const pathToKeyPub = path.join(currentDir, 'id_rsa_pub.pem');

const PUB_KEY = fs.readFileSync(pathToKeyPub, 'utf8');

function authMiddleware(req, res, next){
  const token = req.cookies['jwt'].token

  if(token)
  {
    try {
      const verification = jsonwebtoken.verify(token, PUB_KEY, {algorithms: ['RS256']})
      req.jwt = verification
      next()
    } catch (error) {
      console.log(error)
      res.status(401).json({msg: 'Unauthorized', err: error.message})
    }
    
  }
  else {
    res.status(401).json({msg: 'Sem token de acesso.'})
  }

}

export default authMiddleware
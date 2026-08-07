import jsonwebtoken from "jsonwebtoken"
import fs from 'fs'
import path from 'path'

const currentDir = import.meta.dirname;

const pathToKey = path.join(currentDir, 'id_rsa_priv.pem');

const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

function issueJWT(userId) {
  
  const expiresIn = '1d';

  const payload = {
    sub: userId,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: signedToken,
    expires: expiresIn
  }
}
export default issueJWT
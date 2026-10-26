import jwt from "jsonwebtoken"

import issueJWT from "../utils/issueJWT.js"

const loginController = {
    jwtToken: (req, res) => {
        try {
            
            const jwt = issueJWT(req.user.id)
            //aqui para testar no browser precisa ser sameSite: 'none' e secure: true e usando cors com credentials como true
            res.cookie('jwt', jwt, {maxAge: 24 * 60 * 60 * 1000 , httpOnly:true, 
                sameSite: 'lax', secure: false}) 

            res.json({msg: "Login bem sucedido", user: req.user})
        } catch (error) {
            return res.status(500).json({message: "Erro no sistema, tente novamente mais tarde.", error: error.message})
        }
    }
}

export default loginController
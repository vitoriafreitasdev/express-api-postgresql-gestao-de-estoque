import jwt from "jsonwebtoken"
import issueJWT from "../utils/issueJWT.js"

const loginController = {
    jwtToken: (req, res) => {
        try {
            const jwt = issueJWT(req.user.id)
            res.cookie('jwt', jwt, {maxAge: 24 * 60 * 60 * 1000 , httpOnly:true}) 
            res.json({msg: "Login bem sucedido", user: req.user})
        } catch (error) {
            return res.status(500).json({message: "Erro no sistema, tente novamente mais tarde.", error: error.message})
        }
    }
}

export default loginController
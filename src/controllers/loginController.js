import jwt from "jsonwebtoken"
import issueJWT from "../utils/issueJWT.js"


const loginController = {
    jwtToken: (req, res) => {
        const jwt = issueJWT(req.user.id)
        res.cookie('jwt', jwt, {maxAge: 24 * 60 * 60 * 1000 , httpOnly:true}) 
        res.json({msg: "Login bem sucedido", user: req.user})
    }
}

export default loginController
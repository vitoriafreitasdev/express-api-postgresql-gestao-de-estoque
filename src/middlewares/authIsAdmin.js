
const authIsAdmin = (req, res, next) => {
    if(req.user.isadmin){
        return next()
    }
    return res.status(401).json({msg: "Não autorizado, apenas administradores."})
}

export default authIsAdmin
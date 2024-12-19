const jwt = require("jsonwebtoken")

const userAuth = async(req,res, next) => {
    const {token} = req.cookies;

    if(!token) {
        return res.json({succes: false, message: "Not authorized. login again"})
    }

    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        
        if(tokenDecode.id) {
            req.body.userId = tokenDecode.id
        }
        else {
            return res.json({succes: false, message: "Not authorized. login again"})
        
        }

        next()

    } catch (error) {
        return res.json({succes: false, message: error.message})
        
    }
}

module.exports = userAuth
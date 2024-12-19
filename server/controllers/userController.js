const userModel = require("../models/user_model")


const getUserData = async(req,res) => {
    try {
        const {userId} = req.body;

        const user = await userModel.findById(userId)

        if(!user) {
            return res.json({
                success: false,
                message: "user not found"
            })
        }

        return res.json({
            success: true,
            userData: {
                name: user.username,
                isAccountVerified: user.isAccountVerified
            }
        })
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

module.exports = getUserData
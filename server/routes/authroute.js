const { register, login, logout, sendVerifyOtp, verifyEmail,isAunthenticated,sendResetOtp,resetPassword} = require("../controllers/authcontroller")
const userAuth = require("../middleware/userAuth")

const authRouter = require("express").Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp)
authRouter.post("/verify-account", userAuth, verifyEmail)
authRouter.get("/is-auth", userAuth, isAunthenticated)
authRouter.post("/send-reset-otp", sendResetOtp)
authRouter.post("/reset-password", resetPassword)

module.exports = authRouter
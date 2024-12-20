const getUserData = require("../controllers/userController")
const userAuth = require("../middleware/userAuth")

const userRouter = require("express").Router()

userRouter.get("/data", userAuth, getUserData)

module.exports = userRouter
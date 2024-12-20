const transRoute = require("express").Router()
const {
    getTrans,
    postTrans,
    delTrans
} = require("../controllers/trans_cont.js")

transRoute.get("/get-trans/:id", getTrans)

transRoute.post("/post-trans", postTrans)

transRoute.delete("/del-trans/:id", delTrans)

module.exports = transRoute
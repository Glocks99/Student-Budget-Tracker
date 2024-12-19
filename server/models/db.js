const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("connected to mongo")
    })
    .catch(err => {
        console.log(err.message)
    })
}

connectDB()


module.exports = connectDB
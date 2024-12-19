const mongoose = require("mongoose")

const transSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

const transModel = mongoose.model("trans_collection", transSchema)

module.exports = transModel
const transModel = require("../models/trans_model")


const getTrans = async(req,res) => {
    const {id} = req.params
    try {
        await transModel.find({})
        .then(data => {
            const filteredData = data.filter(item => item.user_id === id)
            res.json(filteredData)
        })
    } catch (err) {
        console.log(err.message)
    }
}

const postTrans =  async(req,res) => {
    try {
        const {type,amount,description,date,user_id} = req.body
        const newData = await transModel({
            type,
            amount,
            description,
            date,
            user_id
        })
        await newData.save()
        .then(() => {
            res.json({message: "transaction saved !"})
        })
    } catch (err) {
        res.json({error: err.message})
    }
}

const delTrans = async(req,res) => {
    const {id} = req.params
    await transModel.findByIdAndDelete(id)
    .then(() => {
        res.json({message:"deleted transaction!"})
    })
    .catch(err => {
        res.json({error: err.message})
    })
}

module.exports = {
    postTrans,
    getTrans,
    delTrans
}
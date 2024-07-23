const mongoose=require('mongoose')

const ExpertFormSchema = new mongoose.Schema({
    post_id:mongoose.Schema.Types.ObjectId,
    "paragraph": String,
    "score":String,
    "text":String
})

module.exports = mongoose.model('expertforms',ExpertFormSchema)
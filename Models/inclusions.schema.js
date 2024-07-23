const mongoose=require('mongoose')
const InclusionsSchema = new mongoose.Schema({
    "post_id": mongoose.Schema.Types.ObjectId,
    "text":String,
    "img": String
})

module.exports = mongoose.model('Inclusions',InclusionsSchema,'Inclusions')
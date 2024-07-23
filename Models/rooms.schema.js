const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
    post_id: mongoose.Schema.Types.ObjectId,
    title: String,
    price: mongoose.Types.Decimal128,
    desc: String,
    img: String,
    is_deleted:{
        type:Boolean,
        default:false
    }

});

module.exports = mongoose.model("Rooms", roomsSchema, "Rooms");
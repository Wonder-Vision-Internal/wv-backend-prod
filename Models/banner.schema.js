const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    text1: String,
    text2: String,
    img: String,
    page_name: String,
    post_id: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model("Banner", bannerSchema,"Banner");
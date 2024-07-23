const mongoose = require('mongoose');

const storiesSchema = new mongoose.Schema({
    post_id: mongoose.Schema.Types.ObjectId,
    content: String,
    author: String,
    address: String,
    user_img:String,
    post_type:String
});

module.exports = mongoose.model("stories", storiesSchema);
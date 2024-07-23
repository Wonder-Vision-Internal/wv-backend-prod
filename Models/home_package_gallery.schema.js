const mongoose = require('mongoose');

const home_package_gallery = new mongoose.Schema({
    post_id: mongoose.Schema.Types.ObjectId,
    text1: String,
    img: String
    
});

module.exports = mongoose.model("home_package_gallery", home_package_gallery,"home_package_gallery");
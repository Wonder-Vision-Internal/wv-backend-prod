const mongoose = require('mongoose');

const packageYoutubeSchema = new mongoose.Schema({
    slug: String,
    url: String,
    type: {
        type: String,
        set: function(value) {
            return value.trim().toUpperCase();
        }
    }
});

module.exports = mongoose.model("PackageYoutube", packageYoutubeSchema,"PackageYoutube");
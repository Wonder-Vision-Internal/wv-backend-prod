const mongoose = require('mongoose');

const bestPlacesSchema = new mongoose.Schema({
    slug: String,
    title: String,
    description: String,
    img: String,
});

module.exports = mongoose.model("BestPlaces", bestPlacesSchema,"BestPlaces");
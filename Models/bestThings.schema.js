const mongoose = require('mongoose');

const bestThingSchema = new mongoose.Schema({
    slug: String,
    icon: String,
    title: String,
});

module.exports = mongoose.model("BestThing", bestThingSchema,"BestThing");
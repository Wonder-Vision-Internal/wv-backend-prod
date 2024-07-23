const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img: String,
});

module.exports = mongoose.model("Founder", founderSchema, "Founder");
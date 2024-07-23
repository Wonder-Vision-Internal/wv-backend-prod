const mongoose = require('mongoose');

const metaSchema = new mongoose.Schema({
    meta: String
});

module.exports = mongoose.model("meta", metaSchema,"meta");

const mongoose = require('mongoose');

const homeClientSchema = new mongoose.Schema({
    url: String,
    slug: String,
});

module.exports = mongoose.model("HomeClient", homeClientSchema);
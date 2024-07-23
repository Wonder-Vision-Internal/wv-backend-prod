const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    userImg: String,
    userName: String,
    title: String,
    screenImg: String,
});

module.exports = mongoose.model("Testimonial", testimonialSchema,"Testimonial");
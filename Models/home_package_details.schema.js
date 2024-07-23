const mongoose = require('mongoose');

const home_package_details_schema = new mongoose.Schema({
    quick_itinerary: String,
    highlights: String,
    post_id: mongoose.Schema.Types.ObjectId,
    other_details:String,
    days:String,
    nights:String,
    starts_from:String,
    emi_price:String,
    price_details:[Object],
    other_hs:Array,
    other_pac:Array

});

module.exports = mongoose.model("home_package_details", home_package_details_schema);
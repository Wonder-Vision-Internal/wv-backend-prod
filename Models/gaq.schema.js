const mongoose = require('mongoose');

const gaqSchema = new mongoose.Schema({
   gaq_details:String,
    post_id: {
        type:mongoose.Schema.Types.ObjectId
    }
});

module.exports = mongoose.model("gaq", gaqSchema,'gaq');
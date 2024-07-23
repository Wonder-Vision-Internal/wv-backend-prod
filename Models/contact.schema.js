const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: String,
    mail: String,
    phone: String,
    bookingId: String,
    smiley: String,
    message: String,
    type: String,
    person: String,
    date: String,
    location: String,
    // created_at: {
    //     type: Date,
    //     default: () => {
    //       const now = new Date();
    //       now.setHours(now.getHours() + 5);
    //       now.setMinutes(now.getMinutes() + 30);
    //       return now;
    //     }
    //   }
    created_at:Date
     
});

module.exports = mongoose.model("contact", contactSchema,"contact");
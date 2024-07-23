const mongoose = require('mongoose');

const bookingsSchema = new mongoose.Schema({
    travellers: Array(Object),
    name:String,
    mail: String,
    phone: String,
    bookingId: Number,
    smiley: String,
    message: String,
    type: String,
    person: String,
    date: String,
    location: String,
    address: String,
    gst_no:String,
    sharing:String,
    bookingId: Number,
    MUID: String,
    person: Number,
    amount: Number,
    due_amount:Number,
    payment_mode:String,
    post_id: mongoose.Schema.Types.ObjectId,
    transactionId: String,
    booked_by:String,
    isCancelled: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["p","c","e"] // p = pending , c= completed, e = error
    },
    created_at: {
        type: Date,
        default: Date.now
    }


});

module.exports = mongoose.model("Bookings", bookingsSchema,"Bookings");
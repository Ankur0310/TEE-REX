const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SuccesspaySchema = new Schema({
    title : String,
    totalprice : Number,
    name : String,
    email : String,
    razorpay_order_id : String,
    razorpay_payment_id : String,
    razorpay_signature : String,
    buyerid : String,
    img_url : String,
    price : Number,
    quantity : Number,
    size : String



});

module.exports = mongoose.model('Successpay', SuccesspaySchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({

    product : String,
    productid : String,
    colour : String,
    name : String,
    email : String,
    price : Number,
    size : String,
    quantity : Number,
    totalprice : Number,
    question : String,
    buyerid : String,
    img_url : String

});

module.exports = mongoose.model('Order', OrderSchema);
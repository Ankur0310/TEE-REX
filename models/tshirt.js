const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TshirtSchema = new Schema({
    title : String,
    sprice: Number,
    price : Number,
    description: String,
    discount : String,
    colour: String,
    material : String,
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    images : [
        {
            url : String,
            filename : String
        }
    ],
    status :  String
    
});

module.exports = mongoose.model('Tshirt', TshirtSchema);
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    stock: Number,
    comments: {
        type: [{
            user: String,
            text: String,
            rating: Number
        }],
        default: []
    }
});

module.exports = mongoose.model('Product', ProductSchema);
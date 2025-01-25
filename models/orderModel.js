const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipping', 'delivered', 'successful', 'canceled']
    }
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    region: {
        type: String,
        required: true,
        enum: ["namangan", "fargona", "andijon", "toshkent", "toshkent_shahri", "sirdaryo", "navoiy", "samarqand", "buxoro", "jizzax", "qashqadaryo", "surxondaryo", "xorazm", "qoraqalpogiston"]
    },
    payment_summ: {
        type: Number,
        required: true,
        min: 1
    },
    products: {
        type: [{
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            price: Number
        }]
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipping', 'delivered', 'successful', 'canceled'],
        default: 'pending'
    },
    log: {
        type: [LogSchema],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);

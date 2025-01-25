const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    region: {
        type: String,
        enum: ["namangan", "fargona", "andijon", "toshkent", "toshkent_shahri", "sirdaryo", "navoiy", "samarqand", "buxoro", "jizzax", "qashqadaryo", "surxondaryo", "xorazm", "qoraqalpogiston"]
    },
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    orders: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Order',
        default: []
    },
    balance: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('User', UserSchema);
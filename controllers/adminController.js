const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const moment = require('moment-timezone');
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

exports.setStatusToOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Заказ не найден" });
        }
        order.status = status;
        order.log.push({
            status: status
        })
        await order.save();
        res.json({ message: "Статус заказа изменен" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

exports.blockUser = async (req, res) => {
    try {
        const { id } = req.params
        await User.findByIdAndUpdate(id, { status: false });
        res.json({ message: "Пользователь заблокирован" });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

exports.unblockUser = async (req, res) => {
    try {
        const { id } = req.params
        await User.findByIdAndUpdate(id, { status: true });
        res.json({ message: "Пользователь разблокирован" });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}
exports.updateBalance = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }
        user.balance += amount;
        await user.save();
        res.json({ message: "Баланс обновлен" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
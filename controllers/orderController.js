const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const generateUniqueId = require('generate-unique-id');
const moment = require('moment-timezone');

exports.getOrdersByUser = async (req, res) => {
    try {
        const { user_id } = req.user;

        const orders = await Order.find({ user_id });
        res.json(orders);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}
exports.createOrder = async (req, res) => {
    try {
        const { user_id } = req.user;
        const orders = await Order.find();
        const id = generateUniqueId({
            length: 6,
            useLetters: false
        })
        req.body.order_id = orders?.length + 1 || id;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }
        if (user.balance < req.body.payment_summ) {
            return res.status(400).json({ message: "Недостаточно средств" });
        }
        req.body.log = [{
            status: 'pending'
        }]
        const order = new Order(req.body);

        await order.save();
        if (!order) {
            return res.status(400).json({ message: "Ошибка создания заказа" });
        }
        req.body.products.forEach(async (item) => {
            const product = await Product.findById(item.product_id);
            if (!product) {
                return res.status(400).json({ message: "Товар не найден" });
            }
            product.stock -= item.quantity;
            await product.save();
        })
        user.balance -= req.body.payment_summ
        user.orders.push(order._id)
        await user.save();

        res.json({ message: "Заказ успешно создан" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

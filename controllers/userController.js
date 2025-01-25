const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateUniqueId = require('generate-unique-id');
const nodemailer = require('nodemailer');
exports.createUser = async (req, res) => {
    try {
        const { password } = await req.body
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(400).json({ message: "Есть аккаунт с электронной почтой" });
        }
        const hashed = await bcrypt.hash(password, 10)
        const user = new User({ ...req.body, password: hashed });
        await user.save();

        res.json({ message: "Введите код, отправленный на вашу электронную почту" });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "Аккаунт не найден по электронной почте" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Пароль неверен" });
        }
        const token = jwt.sign({ user_id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token: token });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const otp = generateUniqueId({
            length: 6,
            useLetters: false,
        });
        const user = await User.findOneAndUpdate({ email }, { otp }, { new: true });

        if (!user) {
            return res.status(400).json({ message: "Аккаунт не найден по электронной почте" });
        }
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
                user: 'jasurmominjonov2818@gmail.com',
                pass: 'vxhd fcjx yqjl ztzu'
            }
        });
        const mailOptions = {
            from: 'UPGRADE SHOP',
            to: email,
            subject: 'Подтвердите свой аккаунт',
            text: `Одноразовый код для подтверждения электронной почты: ${user.otp}`
        };
        transporter.sendMail(mailOptions)
        res.json({ message: "Код отправлен" });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}
exports.verifyUser = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "Аккаунт не найден по электронной почте" });
        }
        if (user.status) {
            await User.findOneAndUpdate({ email }, { otp: null });
            return res.status(400).json({ message: "Аккаунт уже подтвержден" });
        }
        if (user.otp === otp) {
            user.otp = null;
            user.status = true;
            await user.save();
            const token = jwt.sign({ user_id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' })

            return res.json({ message: "Аккаунт подтвержден", token });
        } else {
            return res.status(400).json({ message: "Код неправильный" });
        }
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}
exports.forgotPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Аккаунт не найден по электронной почте" });
        }
        if (user.otp === otp) {
            user.otp = null;
            user.password = await bcrypt.hash(password, 10);
            await user.save();
            return res.json({ message: "Пароль изменен" });
        } else {
            return res.status(400).json({ message: "Код неправильный" });
        }
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}
exports.getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }
        res.json(user);

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

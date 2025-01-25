const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
async function auth(req, res, next) {
    try {
        const token = req?.headers?.authorization?.split(" ").pop() || null
        if (!token) {
            return res.status(401).json({ error: 'Вы не авторизованы' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: 'Токен недействителен' });
        }
        const user = await User.findById(decoded.user_id);
        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }
        if (user.status == false) {
            return res.status(401).json({ error: 'Пользователь заблокирован' });
        }
        req.user = decoded;
        next();
    } catch (e) {
        console.error(e.message);
        return res.status(401).json({ message: "Ошибка сервера или вы не авторизованы" });
    }
}

module.exports = auth;
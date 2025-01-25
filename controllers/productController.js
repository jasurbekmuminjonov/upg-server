const Product = require('../models/productModel');
const File = require('../models/fileModel');

exports.createProduct = async (req, res) => {
    try {
        const { originalname, mimetype, buffer } = req.file;
        const image = new File({
            name: originalname,
            data: buffer,
            contentType: mimetype,
        });
        await image.save();
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            stock: req.body.stock,
            price: req.body.price,
            image: image._id,
        });
        await product.save();
        res.json(product);

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}
exports.getFile = async (req, res) => {
    try {
        const { id } = req.params
        const file = await File.findById(id);
        if (!file) return res.status(404).json({ message: "файл не найден" });
        res.set("Content-Type", file.contentType);
        res.send(file.data);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

exports.getProductsByUser = async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}
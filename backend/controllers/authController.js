const Parent = require('../models/Parent');
const bcrypt = require('bcrypt');

const authController = {
    async register(req, res) {
        try {
            const { name, lastname, email, password, confirmPassword, phone, birth_date } = req.body;
            
            if (!name || !lastname || !email || !password || !confirmPassword) {
                return res.status(400).json({ success: false, message: "Все поля обязательны" });
            }
            if (password !== confirmPassword) {
                return res.status(400).json({ success: false, message: "Пароли не совпадают" });
            }
            if (password.length < 6) {
                return res.status(400).json({ success: false, message: "Пароль минимум 6 символов" });
            }

            const existing = await Parent.findByEmail(email);
            if (existing) {
                return res.status(400).json({ success: false, message: "Email уже зарегистрирован" });
            }

            await Parent.create({ name, lastname, email, password, phone, birth_date });
            
            res.json({ success: true, message: "Регистрация успешна!" });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Ошибка сервера" });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email и пароль обязательны" });
            }

            const user = await Parent.findByEmail(email);
            
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ success: false, message: "Неверный email или пароль" });
            }
            
            const { password: _, confirm_password: __, ...userWithoutPassword } = user;
            
            res.json({ success: true, user: userWithoutPassword });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Ошибка сервера" });
        }
    }
};

module.exports = authController;
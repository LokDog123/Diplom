const validateRegistration = (req, res, next) => {
    const { name, lastname, email, password, confirmPassword } = req.body;
    
    if (!name || !lastname || !email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: "Все поля обязательны" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Пароли не совпадают" });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Пароль минимум 6 символов" });
    }
    
    next();
};

module.exports = { validateRegistration };
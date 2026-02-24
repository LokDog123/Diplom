const Parent = require('../models/Parent');

const parentController = {
    async getById(req, res) {
        try {
            const parent = await Parent.findById(req.params.parent_id);
            
            if (!parent) {
                return res.status(404).json({ success: false, message: 'Родитель не найден' });
            }
            
            const { password, confirm_password, ...parentWithoutPassword } = parent;
            res.json({ success: true, parent: parentWithoutPassword });
            
        } catch (error) {
            res.status(500).json({ success: false, message: "Ошибка сервера" });
        }
    },

    async update(req, res) {
        try {
            const result = await Parent.update(req.params.parent_id, req.body);
            
            if (result.matchedCount === 0) {
                return res.status(404).json({ success: false, message: 'Родитель не найден' });
            }
            
            res.json({ success: true, message: 'Данные обновлены' });
            
        } catch (error) {
            res.status(500).json({ success: false, message: "Ошибка сервера" });
        }
    }
};

module.exports = parentController;
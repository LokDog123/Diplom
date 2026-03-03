const Health = require('../models/Health');

const healthController = {
    async create(req, res) {
        try {
            console.log('📝 Получены данные о здоровье:', req.body);
            
            const { 
                child_id, date, toilet, spitup,
                temperature, medications, symptoms,
                general_condition, notes
            } = req.body;
            
            if (!child_id || !date) {
                return res.status(400).json({ 
                    success: false, 
                    message: "ID ребенка и дата обязательны" 
                });
            }

            const health = await Health.create({
                child_id, date, toilet, spitup,
                temperature, medications, symptoms,
                general_condition, notes
            });
            
            res.status(201).json({ 
                success: true, 
                message: "Запись о здоровье добавлена", 
                health_id: health.health_id 
            });
            
        } catch (error) {
            console.error('❌ Ошибка создания записи о здоровье:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getByChild(req, res) {
        try {
            const { child_id } = req.params;
            const health = await Health.findByChild(child_id);
            
            res.json({ 
                success: true, 
                health,
                count: health.length 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения записей о здоровье:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера" 
            });
        }
    },

    async getById(req, res) {
        try {
            const health = await Health.findById(req.params.health_id);
            if (!health) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Запись не найдена" 
                });
            }
            res.json({ success: true, health });
        } catch (error) {
            console.error('❌ Ошибка получения записи:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера" 
            });
        }
    }
};

module.exports = healthController;
const Health = require('../models/Health');

const healthController = {
    async create(req, res) {
        try {
            console.log('📝 Получены данные о здоровье:', req.body);
            
            const { 
                child_id, 
                date, 
                type,
                value,
                notes
            } = req.body;
            
            if (!child_id) {
                return res.status(400).json({ 
                    success: false, 
                    message: "ID ребенка обязателен" 
                });
            }
            
            if (!date) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Дата обязательна" 
                });
            }
            
            if (!type) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Тип записи обязателен" 
                });
            }

            const health = await Health.create({
                child_id, 
                date, 
                type,
                value,
                notes
            });
            
            res.status(201).json({ 
                success: true, 
                message: "Запись о здоровье добавлена", 
                health_id: health.health_id 
            });
            
        } catch (error) {
            console.error('❌ Ошибка создания записи о здоровье:', error);
            
            if (error.code === 121) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Ошибка валидации данных. Проверьте формат полей.",
                    details: error.errInfo
                });
            }
            
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getByChild(req, res) {
        try {
            const { child_id } = req.params;
            
            console.log(`📥 Запрос записей о здоровье для ребенка: ${child_id}`);
            
            const health = await Health.findByChild(child_id);
            
            console.log(`✅ Найдено ${health.length} записей`);
            
            res.json({ 
                success: true, 
                health,
                count: health.length 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения записей о здоровье:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getById(req, res) {
        try {
            const { health_id } = req.params;
            
            const health = await Health.findById(health_id);
            
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
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getByDate(req, res) {
        try {
            const { child_id, date } = req.params;
            
            const health = await Health.findByDate(child_id, date);
            
            res.json({ 
                success: true, 
                health,
                count: health.length 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения записей по дате:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async update(req, res) {
        try {
            const { health_id } = req.params;
            const { date, type, value, notes } = req.body;
            
            console.log(`📝 Обновление записи здоровья ${health_id}:`, { date, type, value, notes });

            // Проверяем существование записи
            const existingHealth = await Health.findById(health_id);
            if (!existingHealth) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Запись не найдена" 
                });
            }

            const result = await Health.update(health_id, {
                date, 
                type, 
                value, 
                notes
            });
            
            if (result.matchedCount === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Запись не найдена" 
                });
            }
            
            // Получаем обновленную запись
            const updatedHealth = await Health.findById(health_id);
            
            res.json({ 
                success: true, 
                message: "Запись обновлена",
                health: updatedHealth
            });
            
        } catch (error) {
            console.error('❌ Ошибка обновления записи:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async delete(req, res) {
        try {
            const { health_id } = req.params;
            
            console.log(`🗑️ Удаление записи здоровья ${health_id}`);

            // Проверяем существование записи
            const existingHealth = await Health.findById(health_id);
            if (!existingHealth) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Запись не найдена" 
                });
            }
            
            const result = await Health.delete(health_id);
            
            if (result.deletedCount === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Запись не найдена" 
                });
            }
            
            res.json({ 
                success: true, 
                message: "Запись удалена" 
            });
            
        } catch (error) {
            console.error('❌ Ошибка удаления записи:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    // Специализированные методы
    async getTemperatureHistory(req, res) {
        try {
            const { child_id } = req.params;
            const days = req.query.days ? parseInt(req.query.days) : 30;
            
            const history = await Health.getTemperatureHistory(child_id, days);
            
            res.json({ 
                success: true, 
                history,
                count: history.length 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения истории температуры:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getToiletStats(req, res) {
        try {
            const { child_id } = req.params;
            const days = req.query.days ? parseInt(req.query.days) : 7;
            
            const stats = await Health.getToiletStats(child_id, days);
            
            res.json({ 
                success: true, 
                stats 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения статистики туалета:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getSpitupStats(req, res) {
        try {
            const { child_id } = req.params;
            const days = req.query.days ? parseInt(req.query.days) : 7;
            
            const stats = await Health.getSpitupStats(child_id, days);
            
            res.json({ 
                success: true, 
                stats 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения статистики срыгиваний:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    }
};

module.exports = healthController;
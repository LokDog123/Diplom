const WeightAnalytics = require('../models/WeightAnalytics');
const Measurement = require('../models/Measurement');
const weightAnalyticsService = require('../services/weightAnalyticsService');

const weightAnalyticsController = {
    async create(req, res) {
        try {
            console.log('📝 Получены данные для аналитики:', req.body);
            
            const { 
                child_id, date, current, trends,
                who_comparison, notes
            } = req.body;
            
            if (!child_id || !date || !current) {
                return res.status(400).json({ 
                    success: false, 
                    message: "ID ребенка, дата и текущие показатели обязательны" 
                });
            }

            const analytics = await WeightAnalytics.create({
                child_id, date, current, trends,
                who_comparison, notes
            });
            
            res.status(201).json({ 
                success: true, 
                message: "Аналитика добавлена", 
                analytics_id: analytics.analytics_id 
            });
            
        } catch (error) {
            console.error('❌ Ошибка создания аналитики:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getByChild(req, res) {
        try {
            const { child_id } = req.params;
            const analytics = await WeightAnalytics.findByChild(child_id);
            
            res.json({ 
                success: true, 
                analytics,
                count: analytics.length 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения аналитики:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера" 
            });
        }
    },

    async getLatest(req, res) {
        try {
            const { child_id } = req.params;
            const analytics = await WeightAnalytics.findLatest(child_id);
            
            if (!analytics) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Аналитика не найдена" 
                });
            }
            
            res.json({ success: true, analytics });
            
        } catch (error) {
            console.error('❌ Ошибка получения последней аналитики:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера" 
            });
        }
    },

    async calculateAndSave(req, res) {
        try {
            const { child_id } = req.params;
            
            const analytics = await weightAnalyticsService.calculateAndSaveAnalytics(child_id);
            
            res.json({ 
                success: true, 
                message: "Аналитика рассчитана и сохранена",
                analytics 
            });
            
        } catch (error) {
            console.error('❌ Ошибка расчета аналитики:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    }
};

module.exports = weightAnalyticsController;
const WeightAnalytics = require('../models/WeightAnalytics');
const Measurement = require('../models/Measurement');

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
            
            const measurements = await Measurement.findByChild(child_id);
            if (measurements.length < 2) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Недостаточно данных для расчета (нужно минимум 2 замера)" 
                });
            }

            const latest = measurements[0];
            const previous = measurements[1];
            
            // Расчет BMI
            const heightInMeters = latest.height / 100;
            const bmi = latest.weight / (heightInMeters * heightInMeters);
            
            // Расчет набора веса
            const daysDiff = Math.abs((new Date(latest.date) - new Date(previous.date)) / (1000 * 60 * 60 * 24));
            const weightDiff = latest.weight - previous.weight;
            const dailyGain = weightDiff / daysDiff;
            
            // Определяем возраст в месяцах
            const child = await getDB().collection('children').findOne({ child_id });
            const birthDate = new Date(child.birth_date);
            const ageMonths = (new Date(latest.date).getFullYear() - birthDate.getFullYear()) * 12 + 
                              (new Date(latest.date).getMonth() - birthDate.getMonth());
            
            const analytics = await WeightAnalytics.create({
                child_id,
                date: new Date(),
                current: {
                    weight: latest.weight,
                    height: latest.height,
                    bmi: parseFloat(bmi.toFixed(1)),
                    age_months: ageMonths
                },
                trends: {
                    daily_gain: parseFloat(dailyGain.toFixed(3)),
                    weekly_gain: parseFloat((dailyGain * 7).toFixed(3)),
                    monthly_gain: parseFloat((dailyGain * 30).toFixed(3)),
                    growth_rate: dailyGain > 0.03 ? 'above' : dailyGain < 0.01 ? 'below' : 'normal'
                },
                notes: 'Автоматический расчет'
            });
            
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
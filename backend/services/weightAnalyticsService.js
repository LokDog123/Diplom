const WeightAnalytics = require('../models/WeightAnalytics');
const Measurement = require('../models/Measurement');
const Child = require('../models/Child');

class WeightAnalyticsService {
    async calculateAndSaveAnalytics(child_id) {
        try {
            console.log('🔍 Начинаем расчет аналитики для child_id:', child_id);
            
            // Получаем измерения ребенка
            const measurements = await Measurement.findByChild(child_id);
            console.log('📊 Найдено измерений:', measurements.length);
            
            if (measurements.length < 2) {
                throw new Error("Недостаточно данных для расчета (нужно минимум 2 замера)");
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
            const child = await Child.findByPk(child_id);
            if (!child) {
                throw new Error("Ребенок не найден");
            }
            
            const birthDate = new Date(child.birth_date);
            const ageMonths = (new Date(latest.date).getFullYear() - birthDate.getFullYear()) * 12 + 
                              (new Date(latest.date).getMonth() - birthDate.getMonth());
            
            const analyticsData = {
                child_id: child_id.toString(),
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
            };
            
            const analytics = await WeightAnalytics.create(analyticsData);
            
            return analytics;
            
        } catch (error) {
            console.error('❌ Ошибка в сервисе аналитики:', error);
            throw error;
        }
    }
}

module.exports = new WeightAnalyticsService();
const { getDB } = require('../config/db');

class WeightAnalytics {
    static collection() {
        return getDB().collection('weight_analytics');
    }

    static async create(data) {
        try {
            const { 
                child_id, date, current, trends,
                who_comparison, notes
            } = data;
            
            const analytics_id = 'wa_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            const analytics = {
                analytics_id,
                child_id,
                date: new Date(date),
                current: {
                    weight: parseFloat(current.weight),
                    height: parseFloat(current.height),
                    age_months: parseInt(current.age_months)
                },
                calculated_at: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            };
            
            // Добавляем опциональные поля
            if (current.bmi) analytics.current.bmi = parseFloat(current.bmi);
            if (trends) analytics.trends = trends;
            if (who_comparison) analytics.who_comparison = who_comparison;
            if (notes) analytics.notes = notes;
            
            const result = await this.collection().insertOne(analytics);
            console.log('✅ Аналитика сохранена:', result.insertedId);
            
            return analytics;
        } catch (error) {
            console.error('❌ Ошибка в WeightAnalytics.create:', error);
            throw error;
        }
    }
    static async deleteByChild(child_id) {
        try {
            const result = await this.collection().deleteMany({ child_id: String(child_id) });
            console.log(`✅ Удалено ${result.deletedCount} записей аналитики для ребенка ${child_id}`);
            return result;
        } catch (error) {
            console.error('❌ Ошибка в WeightAnalytics.deleteByChild:', error);
            throw error;
        }
    }
    static async findByChild(child_id) {
        try {
            return await this.collection()
                .find({ child_id })
                .sort({ date: -1 })
                .toArray();
        } catch (error) {
            console.error('❌ Ошибка в WeightAnalytics.findByChild:', error);
            throw error;
        }
    }

    static async findLatest(child_id) {
        try {
            return await this.collection()
                .find({ child_id })
                .sort({ date: -1 })
                .limit(1)
                .next();
        } catch (error) {
            console.error('❌ Ошибка в WeightAnalytics.findLatest:', error);
            throw error;
        }
    }
}

module.exports = WeightAnalytics;
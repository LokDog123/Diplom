const { getDB } = require('../config/db');

class Health {
    static collection() {
        return getDB().collection('health');
    }

    static async create(data) {
        try {
            const { 
                child_id, date, toilet, spitup,
                temperature, medications, symptoms,
                general_condition, notes
            } = data;
            
            const health_id = 'health_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            const health = {
                health_id,
                child_id,
                date: new Date(date),
                created_at: new Date(),
                updated_at: new Date()
            };
            
            // Добавляем опциональные поля только если они есть
            if (toilet) health.toilet = toilet;
            if (spitup) health.spitup = spitup;
            if (temperature) health.temperature = temperature;
            if (medications) health.medications = medications;
            if (symptoms) health.symptoms = symptoms;
            if (general_condition) health.general_condition = general_condition;
            if (notes) health.notes = notes;
            
            const result = await this.collection().insertOne(health);
            console.log('✅ Запись о здоровье сохранена:', result.insertedId);
            
            return health;
        } catch (error) {
            console.error('❌ Ошибка в Health.create:', error);
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
            console.error('❌ Ошибка в Health.findByChild:', error);
            throw error;
        }
    }

    static async findById(health_id) {
        try {
            return await this.collection().findOne({ health_id });
        } catch (error) {
            console.error('❌ Ошибка в Health.findById:', error);
            throw error;
        }
    }
}

module.exports = Health;
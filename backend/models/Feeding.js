const { getDB } = require('../config/db');

class Feeding {
    static collection() {
        return getDB().collection('feeding');
    }

    static async create(data) {
        try {
            console.log('📝 Создание записи о питании с данными:', data);
            
            const { 
                child_id, 
                date, 
                feeding_type,
                food_introduced,
                reaction,
                notes
            } = data;
            
            // Генерируем уникальный ID
            const feeding_id = 'feed_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Базовый объект с обязательными полями
            const feeding = {
                feeding_id,
                child_id,
                date: new Date(date),
                feeding_type,
                created_at: new Date(),
                updated_at: new Date()
            };
            
            // Добавляем опциональные поля только если они есть
            if (food_introduced && food_introduced.trim() !== '') {
                feeding.food_introduced = food_introduced;
            }
            
            if (reaction && reaction !== 'normal' && reaction.trim() !== '') {
                feeding.reaction = reaction;
            }
            
            if (notes && notes.trim() !== '') {
                feeding.notes = notes;
            }
            
            console.log('💾 Сохраняемый объект:', feeding);
            
            const result = await this.collection().insertOne(feeding);
            console.log('✅ Запись о питании сохранена, ID:', result.insertedId);
            
            return feeding;
            
        } catch (error) {
            console.error('❌ Ошибка в Feeding.create:', error);
            
            // Проверяем ошибку валидации
            if (error.code === 121) {
                console.error('Ошибка валидации схемы:', error.errInfo);
                const errorDetails = error.errInfo?.details?.schemaRulesNotSatisfied || [];
                throw new Error(`Ошибка валидации: ${JSON.stringify(errorDetails)}`);
            }
            
            throw error;
        }
    }

    static async findByChild(child_id) {
        try {
            console.log('🔍 Поиск записей питания для ребенка:', child_id);
            
            const feeding = await this.collection()
                .find({ child_id })
                .sort({ date: -1 })
                .toArray();
            
            console.log(`✅ Найдено ${feeding.length} записей`);
            
            return feeding;
            
        } catch (error) {
            console.error('❌ Ошибка в Feeding.findByChild:', error);
            throw error;
        }
    }

    static async findById(feeding_id) {
        try {
            return await this.collection().findOne({ feeding_id });
        } catch (error) {
            console.error('❌ Ошибка в Feeding.findById:', error);
            throw error;
        }
    }
}

module.exports = Feeding;
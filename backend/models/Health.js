const { getDB } = require('../config/db');

// Константы для типов записей о здоровье
const HealthTypes = {
    TEMPERATURE: 'temperature',
    TOILET: 'toilet',
    SPITUP: 'spitup',
    MEDICATION: 'medication',
    SYMPTOMS: 'symptoms'
};

// Константы для типов туалета
const ToiletTypes = {
    PEE: 'pee',
    POOP_NORMAL: 'poop_normal',
    POOP_DIARRHEA: 'poop_diarrhea',
    POOP_CONSTIPATION: 'poop_constipation'
};

class Health {
    static collection() {
        return getDB().collection('health');
    }

    static getTypes() {
        return { ...HealthTypes, ToiletTypes };
    }

    static async create(data) {
        try {
            console.log('📝 Создание записи о здоровье с данными:', data);
            
            const { 
                child_id, 
                date, 
                type,
                value,
                notes
            } = data;
            
            // Валидация типа
            if (!Object.values(HealthTypes).includes(type)) {
                throw new Error(`Некорректный тип записи. Допустимые типы: ${Object.values(HealthTypes).join(', ')}`);
            }
            
            const health_id = 'health_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            const health = {
                health_id,
                child_id,
                date: new Date(date),
                type,
                created_at: new Date(),
                updated_at: new Date()
            };
            
            // Добавляем опциональные поля только если они есть
            if (value !== undefined && value !== null && value !== '') {
                if (type === HealthTypes.TEMPERATURE) {
                    health.value = parseFloat(value);
                } else if (type === HealthTypes.SPITUP) {
                    health.value = parseInt(value);
                } else if (type === HealthTypes.TOILET) {
                    // Валидация значения для туалета
                    if (!Object.values(ToiletTypes).includes(value)) {
                        throw new Error(`Некорректное значение туалета. Допустимые значения: ${Object.values(ToiletTypes).join(', ')}`);
                    }
                    health.value = value;
                } else {
                    health.value = value;
                }
            }
            
            if (notes && notes.trim() !== '') {
                health.notes = notes;
            }
            
            console.log('💾 Сохраняемый объект здоровья:', health);
            
            const result = await this.collection().insertOne(health);
            console.log('✅ Запись о здоровье сохранена, ID:', result.insertedId);
            
            return health;
            
        } catch (error) {
            console.error('❌ Ошибка в Health.create:', error);
            
            if (error.code === 121) {
                console.error('Ошибка валидации схемы:', error.errInfo);
                throw new Error(`Ошибка валидации: ${JSON.stringify(error.errInfo)}`);
            }
            
            throw error;
        }
    }

    static async findByChild(child_id) {
        try {
            console.log('🔍 Поиск записей о здоровье для ребенка:', child_id);
            
            const health = await this.collection()
                .find({ child_id })
                .sort({ date: -1 })
                .toArray();
            
            console.log(`✅ Найдено ${health.length} записей`);
            
            return health;
            
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

    static async findByDate(child_id, date) {
        try {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            
            return await this.collection()
                .find({ 
                    child_id,
                    date: { $gte: start, $lte: end }
                })
                .toArray();
        } catch (error) {
            console.error('❌ Ошибка в Health.findByDate:', error);
            throw error;
        }
    }

    static async update(health_id, updateData) {
        try {
            console.log(`📝 Обновление записи здоровья ${health_id}:`, updateData);
            
            const { date, type, value, notes } = updateData;
            
            // Валидация типа
            if (type && !Object.values(HealthTypes).includes(type)) {
                throw new Error(`Некорректный тип записи. Допустимые типы: ${Object.values(HealthTypes).join(', ')}`);
            }
            
            const updateFields = {
                date: new Date(date),
                type,
                updated_at: new Date()
            };
            
            // Добавляем value только если оно есть
            if (value !== undefined && value !== null && value !== '') {
                if (type === HealthTypes.TEMPERATURE) {
                    updateFields.value = parseFloat(value);
                } else if (type === HealthTypes.SPITUP) {
                    updateFields.value = parseInt(value);
                } else if (type === HealthTypes.TOILET) {
                    // Валидация значения для туалета
                    if (!Object.values(ToiletTypes).includes(value)) {
                        throw new Error(`Некорректное значение туалета. Допустимые значения: ${Object.values(ToiletTypes).join(', ')}`);
                    }
                    updateFields.value = value;
                } else {
                    updateFields.value = value;
                }
            } else {
                updateFields.value = null;
            }
            
            if (notes !== undefined) {
                updateFields.notes = notes;
            }
            
            const result = await this.collection().updateOne(
                { health_id },
                { $set: updateFields }
            );
            
            console.log('✅ Результат обновления:', result);
            
            return result;
            
        } catch (error) {
            console.error('❌ Ошибка в Health.update:', error);
            throw error;
        }
    }

    static async delete(health_id) {
        try {
            console.log(`🗑️ Удаление записи здоровья ${health_id}`);
            
            const result = await this.collection().deleteOne({ health_id });
            
            console.log('✅ Результат удаления:', result);
            
            return result;
            
        } catch (error) {
            console.error('❌ Ошибка в Health.delete:', error);
            throw error;
        }
    }

    static async deleteByChild(child_id) {
        try {
            const result = await this.collection().deleteMany({ child_id: String(child_id) });
            console.log(`✅ Удалено ${result.deletedCount} записей здоровья для ребенка ${child_id}`);
            return result;
        } catch (error) {
            console.error('❌ Ошибка в Health.deleteByChild:', error);
            throw error;
        }
    }

    // Специализированные методы
    static async getTemperatureHistory(child_id, days = 30) {
        try {
            const start = new Date();
            start.setDate(start.getDate() - days);
            
            return await this.collection()
                .find({ 
                    child_id,
                    date: { $gte: start },
                    type: HealthTypes.TEMPERATURE,
                    value: { $ne: null }
                })
                .sort({ date: 1 })
                .project({ 
                    date: 1, 
                    value: 1
                })
                .toArray();
        } catch (error) {
            console.error('❌ Ошибка в Health.getTemperatureHistory:', error);
            throw error;
        }
    }

    static async getToiletStats(child_id, days = 7) {
        try {
            const start = new Date();
            start.setDate(start.getDate() - days);
            
            const stats = await this.collection()
                .aggregate([
                    { 
                        $match: { 
                            child_id,
                            date: { $gte: start },
                            type: HealthTypes.TOILET
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total_pee: {
                                $sum: { $cond: [{ $eq: ['$value', ToiletTypes.PEE] }, 1, 0] }
                            },
                            total_poop_normal: {
                                $sum: { $cond: [{ $eq: ['$value', ToiletTypes.POOP_NORMAL] }, 1, 0] }
                            },
                            total_poop_diarrhea: {
                                $sum: { $cond: [{ $eq: ['$value', ToiletTypes.POOP_DIARRHEA] }, 1, 0] }
                            },
                            total_poop_constipation: {
                                $sum: { $cond: [{ $eq: ['$value', ToiletTypes.POOP_CONSTIPATION] }, 1, 0] }
                            }
                        }
                    }
                ]).toArray();
            
            return stats[0] || { 
                total_pee: 0, 
                total_poop_normal: 0,
                total_poop_diarrhea: 0,
                total_poop_constipation: 0
            };
            
        } catch (error) {
            console.error('❌ Ошибка в Health.getToiletStats:', error);
            throw error;
        }
    }

    static async getSpitupStats(child_id, days = 7) {
        try {
            const start = new Date();
            start.setDate(start.getDate() - days);
            
            const stats = await this.collection()
                .aggregate([
                    { 
                        $match: { 
                            child_id,
                            date: { $gte: start },
                            type: HealthTypes.SPITUP,
                            value: { $ne: null }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total_count: { $sum: '$value' },
                            avg_per_day: { $avg: '$value' },
                            max_count: { $max: '$value' }
                        }
                    }
                ]).toArray();
            
            return stats[0] || { total_count: 0, avg_per_day: 0, max_count: 0 };
            
        } catch (error) {
            console.error('❌ Ошибка в Health.getSpitupStats:', error);
            throw error;
        }
    }
}

module.exports = Health;
const { getDB } = require('../config/db');

class FoodProduct {
    static collection() {
        return getDB().collection('food_products');
    }

    static async create(data) {
        try {
            console.log('📝 Создание продукта с данными:', data);
            
            const { 
                name,
                category,
                description,
                recommended_age_months,
                is_allergen,
                notes
            } = data;
            
            // Генерируем уникальный product_id
            const product_id = 'food_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            const product = {
                product_id,
                name,
                category: category || 'other',
                description: description || '',
                recommended_age_months: recommended_age_months ? parseInt(recommended_age_months) : null,
                is_allergen: is_allergen || false,
                notes: notes || '',
                created_at: new Date(),
                updated_at: new Date()
            };
            
            console.log('💾 Сохраняемый продукт:', product);
            
            const result = await this.collection().insertOne(product);
            console.log('✅ Продукт сохранен, ID:', result.insertedId);
            
            return product;
            
        } catch (error) {
            console.error('❌ Ошибка в FoodProduct.create:', error);
            
            // Проверяем ошибку дубликата по имени
            if (error.code === 11000) {
                throw new Error('Продукт с таким названием уже существует');
            }
            
            // Проверяем ошибку валидации
            if (error.code === 121) {
                console.error('Ошибка валидации схемы:', error.errInfo);
                throw new Error('Ошибка валидации данных');
            }
            
            throw error;
        }
    }

    static async findAll() {
        try {
            return await this.collection()
                .find({})
                .sort({ category: 1, name: 1 })
                .toArray();
        } catch (error) {
            console.error('❌ Ошибка в FoodProduct.findAll:', error);
            throw error;
        }
    }

    static async findByName(name) {
        try {
            console.log('🔍 Поиск продукта по имени:', name);
            const product = await this.collection().findOne({ name: name });
            return product;
        } catch (error) {
            console.error('❌ Ошибка в FoodProduct.findByName:', error);
            throw error;
        }
    }

    static async findByCategory(category) {
        try {
            return await this.collection()
                .find({ category })
                .sort({ name: 1 })
                .toArray();
        } catch (error) {
            console.error('❌ Ошибка в FoodProduct.findByCategory:', error);
            throw error;
        }
    }

    static async findById(product_id) {
        try {
            return await this.collection().findOne({ product_id });
        } catch (error) {
            console.error('❌ Ошибка в FoodProduct.findById:', error);
            throw error;
        }
    }

    static async update(product_id, updateData) {
        try {
            const updateFields = {
                ...updateData,
                updated_at: new Date()
            };
            
            const result = await this.collection().updateOne(
                { product_id },
                { $set: updateFields }
            );
            
            console.log('✅ Продукт обновлен:', result);
            
            return result;
            
        } catch (error) {
            console.error('❌ Ошибка в FoodProduct.update:', error);
            throw error;
        }
    }

    static async delete(product_id) {
        try {
            const result = await this.collection().deleteOne({ product_id });
            console.log('✅ Продукт удален:', result);
            return result;
        } catch (error) {
            console.error('❌ Ошибка в FoodProduct.delete:', error);
            throw error;
        }
    }

    static async deleteByChild(child_id) {
        try {
            // ВАЖНО: продукты НЕ привязаны к конкретному ребенку!
            // Этот метод должен быть пустым или не существовать
            // Продукты - это справочные данные, они общие для всех детей
            console.log('Продукты питания - справочные данные, не привязаны к ребенку');
            return { deletedCount: 0 };
        } catch (error) {
            console.error('❌ Ошибка:', error);
            throw error;
        }
    }

    static async getCategories() {
        try {
            const categories = await this.collection()
                .aggregate([
                    { $group: { _id: '$category', count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
                ])
                .toArray();
            
            return categories;
        } catch (error) {
            console.error('❌ Ошибка в FoodProduct.getCategories:', error);
            throw error;
        }
    }

    static async getAllergens() {
        try {
            return await this.collection()
                .find({ is_allergen: true })
                .sort({ name: 1 })
                .toArray();
        } catch (error) {
            console.error('❌ Ошибка в FoodProduct.getAllergens:', error);
            throw error;
        }
    }

    static async getByAge(months) {
        try {
            return await this.collection()
                .find({
                    $or: [
                        { recommended_age_months: { $lte: months } },
                        { recommended_age_months: null }
                    ]
                })
                .sort({ recommended_age_months: 1, name: 1 })
                .toArray();
        } catch (error) {
            console.error('❌ Ошибка в FoodProduct.getByAge:', error);
            throw error;
        }
    }
}

module.exports = FoodProduct;
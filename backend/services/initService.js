const FoodProduct = require('../models/FoodProduct');
const defaultFoodProducts = require('../data/defaultFoodProducts');

class InitService {
    async initDefaultFoodProducts() {
        console.log('📝 Инициализация тестовых продуктов...');
        
        const results = [];
        for (const product of defaultFoodProducts) {
            try {
                // Проверяем, существует ли уже такой продукт
                const existing = await FoodProduct.findByName(product.name);
                if (!existing) {
                    const created = await FoodProduct.create(product);
                    results.push(created);
                    console.log(`✅ Продукт создан: ${product.name}`);
                } else {
                    console.log(`⏭️ Продукт уже существует: ${product.name}`);
                }
            } catch (err) {
                console.error(`❌ Ошибка создания продукта ${product.name}:`, err.message);
            }
        }
        
        const products = await FoodProduct.findAll();
        
        return {
            success: true,
            message: `Добавлено ${results.length} новых продуктов`,
            total_count: products.length,
            new_count: results.length,
            products
        };
    }
}

module.exports = new InitService();
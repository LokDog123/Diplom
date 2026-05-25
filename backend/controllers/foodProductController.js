const FoodProduct = require('../models/FoodProduct');
const initService = require('../services/initService');

const foodProductController = {
    async create(req, res) {
        try {
            console.log('📝 Получены данные для создания продукта:', req.body);
            
            const { 
                name,
                category,
                description,
                recommended_age_months,
                is_allergen,
                notes
            } = req.body;
            
            if (!name) {
                return res.status(400).json({ 
                    success: false 
                });
            }

            const product = await FoodProduct.create({
                name,
                category,
                description,
                recommended_age_months,
                is_allergen,
                notes
            });
            
            res.status(201).json({ 
                success: true, 
                message: "Продукт добавлен", 
                product 
            });
            
        } catch (error) {
            console.error('❌ Ошибка создания продукта:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getAll(req, res) {
        try {
            const products = await FoodProduct.findAll();
            
            res.json({ 
                success: true, 
                products,
                count: products.length 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения продуктов:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getById(req, res) {
        try {
            const { product_id } = req.params;
            
            const product = await FoodProduct.findById(product_id);
            
            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Продукт не найден" 
                });
            }
            
            res.json({ success: true, product });
            
        } catch (error) {
            console.error('❌ Ошибка получения продукта:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getByCategory(req, res) {
        try {
            const { category } = req.params;
            
            const products = await FoodProduct.findByCategory(category);
            
            res.json({ 
                success: true, 
                products,
                count: products.length 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения продуктов по категории:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async update(req, res) {
        try {
            const { product_id } = req.params;
            const updateData = req.body;
            
            const existingProduct = await FoodProduct.findById(product_id);
            
            if (!existingProduct) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Продукт не найден" 
                });
            }
            
            const result = await FoodProduct.update(product_id, updateData);
            
            const updatedProduct = await FoodProduct.findById(product_id);
            
            res.json({ 
                success: true, 
                message: "Продукт обновлен",
                product: updatedProduct
            });
            
        } catch (error) {
            console.error('❌ Ошибка обновления продукта:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async delete(req, res) {
        try {
            const { product_id } = req.params;
            
            const existingProduct = await FoodProduct.findById(product_id);
            
            if (!existingProduct) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Продукт не найден" 
                });
            }
            
            const result = await FoodProduct.delete(product_id);
            
            res.json({ 
                success: true, 
                message: "Продукт удален" 
            });
            
        } catch (error) {
            console.error('❌ Ошибка удаления продукта:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getCategories(req, res) {
        try {
            const categories = await FoodProduct.getCategories();
            
            res.json({ 
                success: true, 
                categories 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения категорий:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getAllergens(req, res) {
        try {
            const allergens = await FoodProduct.getAllergens();
            
            res.json({ 
                success: true, 
                allergens,
                count: allergens.length 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения аллергенов:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getByAge(req, res) {
        try {
            const { months } = req.params;
            
            const products = await FoodProduct.getByAge(parseInt(months));
            
            res.json({ 
                success: true, 
                products,
                count: products.length 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения продуктов по возрасту:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async initDefaultProducts(req, res) {
        try {
            const result = await initService.initDefaultFoodProducts();
            res.json(result);
        } catch (error) {
            console.error('❌ Ошибка инициализации продуктов:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    }
};

module.exports = foodProductController;
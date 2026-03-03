const FoodProduct = require('../models/FoodProduct');

const foodProductController = {
    // Создать продукт
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
                    success: false, 
                    message: "Название продукта обязательно" 
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

    // Получить все продукты
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

    // Получить продукт по ID
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

    // Получить продукты по категории
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

    // Обновить продукт
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

    // Удалить продукт
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

    // Получить категории
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

    // Получить аллергены
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

    // Получить продукты по возрасту
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

    // Инициализация тестовых продуктов
    async initDefaultProducts(req, res) {
        try {
            console.log('📝 Инициализация тестовых продуктов...');
            
            const defaultProducts = [
                { 
                    name: 'Грудное молоко', 
                    category: 'milk', 
                    recommended_age_months: 0,
                    is_allergen: false,
                    description: 'Естественное вскармливание',
                    notes: 'Основное питание для новорожденных'
                },
                { 
                    name: 'Смесь', 
                    category: 'milk', 
                    recommended_age_months: 0,
                    is_allergen: false,
                    description: 'Искусственное вскармливание',
                    notes: 'Адаптированные молочные смеси'
                },
                { 
                    name: 'Овощное пюре', 
                    category: 'vegetable', 
                    recommended_age_months: 4,
                    is_allergen: false,
                    description: 'Пюре из овощей',
                    notes: 'Кабачок, цветная капуста, брокколи'
                },
                { 
                    name: 'Фруктовое пюре', 
                    category: 'fruit', 
                    recommended_age_months: 4,
                    is_allergen: false,
                    description: 'Пюре из фруктов',
                    notes: 'Яблоко, груша, банан'
                },
                { 
                    name: 'Каша', 
                    category: 'cereal', 
                    recommended_age_months: 4,
                    is_allergen: false,
                    description: 'Злаковые каши',
                    notes: 'Рисовая, гречневая, кукурузная'
                },
                { 
                    name: 'Мясное пюре', 
                    category: 'meat', 
                    recommended_age_months: 6,
                    is_allergen: false,
                    description: 'Пюре из мяса',
                    notes: 'Кролик, индейка, говядина'
                },
                { 
                    name: 'Рыбное пюре', 
                    category: 'fish', 
                    recommended_age_months: 8,
                    is_allergen: true,
                    description: 'Пюре из рыбы',
                    notes: 'Треска, хек, минтай'
                },
                { 
                    name: 'Творог', 
                    category: 'dairy', 
                    recommended_age_months: 8, 
                    is_allergen: true,
                    description: 'Кисломолочный продукт',
                    notes: 'Детский творожок'
                },
                { 
                    name: 'Кефир/йогурт', 
                    category: 'dairy', 
                    recommended_age_months: 8,
                    is_allergen: false,
                    description: 'Кисломолочные напитки',
                    notes: 'Детский кефир, йогурт'
                },
                { 
                    name: 'Яичный желток', 
                    category: 'egg', 
                    recommended_age_months: 7, 
                    is_allergen: true,
                    description: 'Желток куриного яйца',
                    notes: 'Начинать с 1/4 желтка'
                },
                { 
                    name: 'Сок', 
                    category: 'drink', 
                    recommended_age_months: 6,
                    is_allergen: false,
                    description: 'Фруктовые соки',
                    notes: 'Яблочный, грушевый сок'
                },
                { 
                    name: 'Мед', 
                    category: 'other', 
                    recommended_age_months: 12, 
                    is_allergen: true,
                    description: 'Натуральный мед',
                    notes: 'Сильный аллерген'
                },
                { 
                    name: 'Орехи', 
                    category: 'nuts', 
                    recommended_age_months: 18, 
                    is_allergen: true,
                    description: 'Различные орехи',
                    notes: 'Грецкие, миндаль, фундук'
                },
                { 
                    name: 'Клубника', 
                    category: 'fruit', 
                    recommended_age_months: 12, 
                    is_allergen: true,
                    description: 'Свежая клубника',
                    notes: 'Ягода-аллерген'
                },
                { 
                    name: 'Цитрусовые', 
                    category: 'fruit', 
                    recommended_age_months: 12, 
                    is_allergen: true,
                    description: 'Апельсины, мандарины, лимоны',
                    notes: 'Сильные аллергены'
                },
                { 
                    name: 'Шоколад', 
                    category: 'other', 
                    recommended_age_months: 24, 
                    is_allergen: true,
                    description: 'Шоколад и шоколадные изделия',
                    notes: 'Сильный аллерген'
                }
            ];
            
            const results = [];
            for (const product of defaultProducts) {
                try {
                    const created = await FoodProduct.create(product);
                    results.push(created);
                    console.log(`✅ Продукт создан: ${product.name}`);
                } catch (err) {
                    console.error(`❌ Ошибка создания продукта ${product.name}:`, err.message);
                }
            }
            
            const products = await FoodProduct.findAll();
            
            res.json({ 
                success: true, 
                message: `Добавлено ${results.length} продуктов`,
                count: products.length,
                products 
            });
            
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
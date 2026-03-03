const express = require('express');
const router = express.Router();
const foodProductController = require('../controllers/foodProductController');

// POST /api/food-products - создать продукт
router.post('/', foodProductController.create);

// GET /api/food-products - получить все продукты
router.get('/', foodProductController.getAll);

// GET /api/food-products/categories - получить категории
router.get('/categories', foodProductController.getCategories);

// GET /api/food-products/allergens - получить аллергены
router.get('/allergens', foodProductController.getAllergens);

// GET /api/food-products/age/:months - получить продукты по возрасту
router.get('/age/:months', foodProductController.getByAge);

// GET /api/food-products/category/:category - получить продукты по категории
router.get('/category/:category', foodProductController.getByCategory);

// GET /api/food-products/:product_id - получить продукт по ID
router.get('/:product_id', foodProductController.getById);

// PUT /api/food-products/:product_id - обновить продукт
router.put('/:product_id', foodProductController.update);

// DELETE /api/food-products/:product_id - удалить продукт
router.delete('/:product_id', foodProductController.delete);

// POST /api/food-products/init - инициализация тестовых продуктов (только для разработки)
router.post('/init', foodProductController.initDefaultProducts);

module.exports = router;
const express = require('express');
const router = express.Router();
const foodProductController = require('../controllers/foodProductController');

router.post('/', foodProductController.create);

router.get('/', foodProductController.getAll);

router.get('/categories', foodProductController.getCategories);

router.get('/allergens', foodProductController.getAllergens);

router.get('/age/:months', foodProductController.getByAge);

router.get('/category/:category', foodProductController.getByCategory);

router.get('/:product_id', foodProductController.getById);

router.put('/:product_id', foodProductController.update);

router.delete('/:product_id', foodProductController.delete);

router.post('/init', foodProductController.initDefaultProducts);

module.exports = router;
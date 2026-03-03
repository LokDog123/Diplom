const express = require('express');
const router = express.Router();
const feedingController = require('../controllers/feedingController');

// POST /api/feeding - создать запись
router.post('/', feedingController.create);

// GET /api/feeding/child/:child_id - получить все записи ребенка
router.get('/child/:child_id', feedingController.getByChild);

// GET /api/feeding/:feeding_id - получить конкретную запись
router.get('/:feeding_id', feedingController.getById);

module.exports = router;
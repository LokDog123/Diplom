const express = require('express');
const router = express.Router();
const feedingController = require('../controllers/feedingController');

// POST /api/feeding - создать запись
router.post('/', feedingController.create);

// GET /api/feeding/child/:child_id - получить все записи ребенка
router.get('/child/:child_id', feedingController.getByChild);

// GET /api/feeding/:feeding_id - получить конкретную запись
router.get('/:feeding_id', feedingController.getById);

// PUT /api/feeding/:feeding_id - обновить запись
router.put('/:feeding_id', feedingController.update);

// DELETE /api/feeding/:feeding_id - удалить запись
router.delete('/:feeding_id', feedingController.delete);

module.exports = router;
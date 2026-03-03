const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// POST /api/health - создать запись
router.post('/', healthController.create);

// GET /api/health/child/:child_id - получить все записи ребенка
router.get('/child/:child_id', healthController.getByChild);

// GET /api/health/:health_id - получить конкретную запись
router.get('/:health_id', healthController.getById);

// PUT /api/health/:health_id - обновить запись
router.put('/:health_id', healthController.update);

// DELETE /api/health/:health_id - удалить запись
router.delete('/:health_id', healthController.delete);

// GET /api/health/child/:child_id/date/:date - получить записи по дате
router.get('/child/:child_id/date/:date', healthController.getByDate);

// GET /api/health/child/:child_id/temperature - история температуры
router.get('/child/:child_id/temperature', healthController.getTemperatureHistory);

// GET /api/health/child/:child_id/toilet/stats - статистика туалета
router.get('/child/:child_id/toilet/stats', healthController.getToiletStats);

// GET /api/health/child/:child_id/spitup/stats - статистика срыгиваний
router.get('/child/:child_id/spitup/stats', healthController.getSpitupStats);

module.exports = router;
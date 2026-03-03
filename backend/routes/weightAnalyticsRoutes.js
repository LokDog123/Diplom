const express = require('express');
const router = express.Router();
const weightAnalyticsController = require('../controllers/weightAnalyticsController');

// POST /api/weight-analytics - создать запись
router.post('/', weightAnalyticsController.create);

// GET /api/weight-analytics/child/:child_id - получить все записи ребенка
router.get('/child/:child_id', weightAnalyticsController.getByChild);

// GET /api/weight-analytics/child/:child_id/latest - получить последнюю запись
router.get('/child/:child_id/latest', weightAnalyticsController.getLatest);

// POST /api/weight-analytics/child/:child_id/calculate - рассчитать и сохранить
router.post('/child/:child_id/calculate', weightAnalyticsController.calculateAndSave);

module.exports = router;
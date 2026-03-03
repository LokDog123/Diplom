const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');

// Основные CRUD операции
router.post('/', measurementController.create);
router.get('/child/:child_id', measurementController.getByChild);
router.get('/:measurement_id', measurementController.getById);
router.put('/:measurement_id', measurementController.update);
router.delete('/:measurement_id', measurementController.delete);

// Специализированные маршруты
router.get('/feeding/child/:child_id', measurementController.getFeedingData);
router.get('/health/child/:child_id', measurementController.getHealthData);
router.get('/weight/analytics/:child_id', measurementController.getWeightAnalytics);

// Массовые операции
router.post('/batch', measurementController.createMany);

module.exports = router;
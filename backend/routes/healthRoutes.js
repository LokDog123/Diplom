const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// POST /api/health - создать запись
router.post('/', healthController.create);

// GET /api/health/child/:child_id - получить все записи ребенка
router.get('/child/:child_id', healthController.getByChild);

// GET /api/health/:health_id - получить конкретную запись
router.get('/:health_id', healthController.getById);

module.exports = router;
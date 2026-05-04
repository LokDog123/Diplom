const express = require('express');
const router = express.Router();
const vaccinationController = require('../controllers/vaccinationController');

// Основные маршруты
router.get('/schedule/:child_id', vaccinationController.getSchedule);
router.get('/child/:child_id', vaccinationController.getByChild);
router.get('/child/:child_id/stats', vaccinationController.getStats);
router.get('/child/:child_id/upcoming', vaccinationController.getUpcoming);
router.get('/child/:child_id/overdue', vaccinationController.getOverdue);
router.post('/', vaccinationController.create);
router.put('/:vaccination_id', vaccinationController.update);
router.patch('/:vaccination_id/complete', vaccinationController.markAsCompleted);
router.delete('/:vaccination_id', vaccinationController.delete);

module.exports = router;
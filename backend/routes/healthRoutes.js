const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

router.post('/', healthController.create);

router.get('/child/:child_id', healthController.getByChild);

router.get('/:health_id', healthController.getById);

router.put('/:health_id', healthController.update);

router.delete('/:health_id', healthController.delete);

router.get('/child/:child_id/date/:date', healthController.getByDate);

router.get('/child/:child_id/temperature', healthController.getTemperatureHistory);

router.get('/child/:child_id/toilet/stats', healthController.getToiletStats);

router.get('/child/:child_id/spitup/stats', healthController.getSpitupStats);

module.exports = router;
const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');

router.post('/', measurementController.create);
router.get('/child/:child_id', measurementController.getByChild);  // Важно!

module.exports = router;
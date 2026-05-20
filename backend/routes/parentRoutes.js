const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');

router.get('/:parent_id', parentController.getById);
router.put('/:parent_id', parentController.update);

module.exports = router;
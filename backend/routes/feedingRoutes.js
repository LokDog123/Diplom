const express = require('express');
const router = express.Router();
const feedingController = require('../controllers/feedingController');

router.post('/', feedingController.create);

router.get('/child/:child_id', feedingController.getByChild);

router.get('/:feeding_id', feedingController.getById);

router.put('/:feeding_id', feedingController.update);

router.delete('/:feeding_id', feedingController.delete);

module.exports = router;
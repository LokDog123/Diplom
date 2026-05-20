const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController');

router.post('/', childController.create);
router.get('/parent/:parent_id', childController.getByParent);  // Важно!
router.get('/:child_id', childController.getById);
router.put('/:child_id', childController.update);
router.delete('/:child_id', childController.delete);

module.exports = router;
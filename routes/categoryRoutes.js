const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.get('/', CategoryController.getAll);
router.post('/', authMiddleware, roleMiddleware(['manager']), CategoryController.create);
router.put('/:id', authMiddleware, roleMiddleware(['manager']), CategoryController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['manager']), CategoryController.delete);

module.exports = router;
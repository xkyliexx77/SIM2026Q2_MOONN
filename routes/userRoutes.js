const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, roleMiddleware(['admin']), UserController.getAll);
router.post('/', authMiddleware, roleMiddleware(['admin']), UserController.create);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), UserController.update);
router.patch('/:id/suspend', authMiddleware, roleMiddleware(['admin']), UserController.suspend);
router.patch('/:id/activate', authMiddleware, roleMiddleware(['admin']), UserController.activate);

module.exports = router;
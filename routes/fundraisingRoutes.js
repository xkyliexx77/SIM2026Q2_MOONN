const express = require('express');
const router = express.Router();
const FundraisingController = require('../controllers/FundraisingController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.get('/', FundraisingController.getAll);
router.post('/', authMiddleware, roleMiddleware(['fundraiser']), FundraisingController.create);
router.patch('/:id/view', FundraisingController.addView);
router.get('/mine/list', authMiddleware, roleMiddleware(['fundraiser']), FundraisingController.mine);
router.get('/mine/completed', authMiddleware, roleMiddleware(['fundraiser']), FundraisingController.completed);
router.put('/:id', authMiddleware, roleMiddleware(['fundraiser']), FundraisingController.update);
router.patch('/:id/complete', authMiddleware, roleMiddleware(['fundraiser']), FundraisingController.complete);
router.delete('/:id', authMiddleware, roleMiddleware(['fundraiser']), FundraisingController.delete);

module.exports = router;
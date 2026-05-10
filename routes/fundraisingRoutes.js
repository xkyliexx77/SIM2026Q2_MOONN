const express = require('express');
const router = express.Router();
const FundraisingController = require('../controllers/FundraisingController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.get('/', FundraisingController.getAll);

router.get('/recommendations', authMiddleware, roleMiddleware(['donee']), FundraisingController.recommendations);

router.get('/mine/list', authMiddleware, roleMiddleware(['fundraiser']), FundraisingController.mine);

router.get('/mine/completed', authMiddleware, roleMiddleware(['fundraiser']), FundraisingController.completed);

router.get('/:id', FundraisingController.getById);

router.post('/', authMiddleware, roleMiddleware(['fundraiser']), FundraisingController.create);

router.patch('/:id/view', FundraisingController.addView);

router.put('/:id', authMiddleware, roleMiddleware(['fundraiser']), FundraisingController.update);

router.patch('/:id/complete', authMiddleware, roleMiddleware(['fundraiser']), FundraisingController.complete);

router.delete('/:id', authMiddleware, roleMiddleware(['fundraiser']), FundraisingController.delete);

module.exports = router;
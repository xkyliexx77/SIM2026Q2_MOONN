const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.get('/summary', authMiddleware, roleMiddleware(['manager']), ReportController.summary);
router.get('/daily', authMiddleware, roleMiddleware(['manager']), ReportController.daily);
router.get('/weekly', authMiddleware, roleMiddleware(['manager']), ReportController.weekly);
router.get('/monthly', authMiddleware, roleMiddleware(['manager']), ReportController.monthly);

module.exports = router;
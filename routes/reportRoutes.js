const express = require('express');
const router = express.Router();

const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const GenerateDailyReportController = require('../controller/GenerateDailyReportController');
const GenerateWeeklyReportController = require('../controller/GenerateWeeklyReportController');
const GenerateMonthlyReportController = require('../controller/GenerateMonthlyReportController');
const CompareDonationReportController = require('../controller/CompareDonationReportController');

router.get('/daily', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await GenerateDailyReportController.generate();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to generate daily report' });
  }
});

router.get('/weekly', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await GenerateWeeklyReportController.generate();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to generate weekly report' });
  }
});

router.get('/monthly', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await GenerateMonthlyReportController.generate();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to generate monthly report' });
  }
});

router.get('/comparison', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await CompareDonationReportController.compare();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to compare donation report' });
  }
});

module.exports = router;
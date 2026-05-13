const express = require('express');
const router = express.Router();

const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const ReportEntity = require('../entity/ReportEntity');

router.get('/summary', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await ReportEntity.summary();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load summary report' });
  }
});

router.get('/daily', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await ReportEntity.daily();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load daily report' });
  }
});

router.get('/weekly', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await ReportEntity.weekly();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load weekly report' });
  }
});

router.get('/monthly', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await ReportEntity.monthly();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load monthly report' });
  }
});

router.get('/compare', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await ReportEntity.compare();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to compare donation reports' });
  }
});

module.exports = router;
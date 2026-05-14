const express = require('express');

const router = express.Router();

const {
  authMiddleware,
  roleMiddleware
} = require('../middleware/authMiddleware');

const GenerateDailyReportController =
  require('../controller/GenerateDailyReportController');

const GenerateWeeklyReportController =
  require('../controller/GenerateWeeklyReportController');

const GenerateMonthlyReportController =
  require('../controller/GenerateMonthlyReportController');

const CompareDonationReportController =
  require('../controller/CompareDonationReportController');

const ReportEntity =
  require('../entity/ReportEntity');

router.get(
  '/summary',
  authMiddleware,
  roleMiddleware(['manager']),
  async (req, res) => {

    try {

      const result =
        await ReportEntity.summary();

      res.json(result);

    } catch (error) {

      res.status(500).json({
        error:
          'Unable to load summary report'
      });

    }

  }
);

router.get(
  '/daily',
  authMiddleware,
  roleMiddleware(['manager']),
  async (req, res) => {

    try {

      const result =
        await GenerateDailyReportController.generateDailyReport();

      res.json(result);

    } catch (error) {

      res.status(500).json({
        error:
          'Unable to load daily report'
      });

    }

  }
);

router.get(
  '/weekly',
  authMiddleware,
  roleMiddleware(['manager']),
  async (req, res) => {

    try {

      const result =
        await GenerateWeeklyReportController.generateWeeklyReport();

      res.json(result);

    } catch (error) {

      res.status(500).json({
        error:
          'Unable to load weekly report'
      });

    }

  }
);

router.get(
  '/monthly',
  authMiddleware,
  roleMiddleware(['manager']),
  async (req, res) => {

    try {

      const result =
        await GenerateMonthlyReportController.generateMonthlyReport();

      res.json(result);

    } catch (error) {

      res.status(500).json({
        error:
          'Unable to load monthly report'
      });

    }

  }
);

router.get(
  '/compare',
  authMiddleware,
  roleMiddleware(['manager']),
  async (req, res) => {

    try {

      const result =
        await CompareDonationReportController.generateDonationComparisonReport();

      res.json(result);

    } catch (error) {

      res.status(500).json({
        error:
          'Unable to compare donation reports'
      });

    }

  }
);

module.exports = router;
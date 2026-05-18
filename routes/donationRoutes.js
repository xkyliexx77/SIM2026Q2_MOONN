const express = require('express');
const router = express.Router();

const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const MakeDonationController = require('../controller/MakeDonationController');
const ViewDonationHistoryController = require('../controller/ViewDonationHistoryController');
const ViewCompletedDonationHistoryController = require('../controller/ViewCompletedDonationHistoryController');

router.post('/', authMiddleware, roleMiddleware(['donee']), async (req, res) => {
  try {
    const { fundraiser_id, amount } = req.body;

    if (!fundraiser_id) {
      return res.status(400).json({ error: 'Fundraising activity is required' });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Donation amount must be greater than 0' });
    }

    const result = await MakeDonationController.donate(req.user.id, fundraiser_id, amount);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/mine', authMiddleware, roleMiddleware(['donee']), async (req, res) => {
  try {
    const filters = {
      category: req.query.category || '',
      dateFrom: req.query.dateFrom || '',
      dateTo: req.query.dateTo || ''
    };

    const result = await ViewDonationHistoryController.view(req.user.id, filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load donation history' });
  }
});

router.get('/completed-history', authMiddleware, roleMiddleware(['donee']), async (req, res) => {
  try {
    const filters = {
      category: req.query.category || '',
      dateFrom: req.query.dateFrom || '',
      dateTo: req.query.dateTo || ''
    };

    const result = await ViewCompletedDonationHistoryController.view(req.user.id, filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load completed donation history' });
  }
});

module.exports = router;
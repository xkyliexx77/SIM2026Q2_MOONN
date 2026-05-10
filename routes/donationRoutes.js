const express = require('express');
const router = express.Router();
const DonationController = require('../controllers/DonationController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['donee']), DonationController.donate);
router.get('/completed-history', authMiddleware, roleMiddleware(['donee']), DonationController.completedHistory);
router.get('/mine', authMiddleware, roleMiddleware(['donee']), DonationController.mine);


module.exports = router;
const express = require('express');
const router = express.Router();

const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const AddFavouriteController = require('../controller/AddFavouriteController');
const ViewFavouriteController = require('../controller/ViewFavouriteController');
const RemoveFavouriteController = require('../controller/RemoveFavouriteController');

router.post('/', authMiddleware, roleMiddleware(['donee']), async (req, res) => {
  try {
    const { fundraiser_id } = req.body;

    if (!fundraiser_id) {
      return res.status(400).json({ error: 'Fundraising activity is required' });
    }

    const result = await AddFavouriteController.add(req.user.id, fundraiser_id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/mine', authMiddleware, roleMiddleware(['donee']), async (req, res) => {
  try {
    const result = await ViewFavouriteController.view(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load favourites' });
  }
});

router.delete('/:fundraiserId', authMiddleware, roleMiddleware(['donee']), async (req, res) => {
  try {
    const result = await RemoveFavouriteController.remove(req.user.id, req.params.fundraiserId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
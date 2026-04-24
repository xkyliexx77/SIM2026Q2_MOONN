const express = require('express');
const router = express.Router();
const FavouriteController = require('../controllers/FavouriteController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['donee']), FavouriteController.add);
router.delete('/:fundraiserId', authMiddleware, roleMiddleware(['donee']), FavouriteController.remove);
router.get('/mine', authMiddleware, roleMiddleware(['donee']), FavouriteController.mine);

module.exports = router;
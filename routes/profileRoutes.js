const express = require('express');
const router = express.Router();

const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const CreateUserProfileController = require('../controller/CreateUserProfileController');
const ViewUserProfileController = require('../controller/ViewUserProfileController');
const UpdateUserProfileController = require('../controller/UpdateUserProfileController');
const SuspendUserProfileController = require('../controller/SuspendUserProfileController');
const SearchUserProfileController = require('../controller/SearchUserProfileController');

router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const result = await ViewUserProfileController.viewAll();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load user profiles' });
  }
});

router.get('/search', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const result = await SearchUserProfileController.search(req.query.search);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to search user profiles' });
  }
});

router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { profile_name } = req.body;

    if (!profile_name || !profile_name.trim()) {
      return res.status(400).json({ error: 'Profile name is required' });
    }

    const result = await CreateUserProfileController.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { profile_name } = req.body;

    if (!profile_name || !profile_name.trim()) {
      return res.status(400).json({ error: 'Profile name is required' });
    }

    const result = await UpdateUserProfileController.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/suspend', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const result = await SuspendUserProfileController.suspend(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
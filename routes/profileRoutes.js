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
    const result = await SearchUserProfileController.search(req.query.search || '');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to search user profiles' });
  }
});

router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { profile_name, profile_description } = req.body;

    if (!profile_name || !profile_name.trim()) {
      return res.status(400).json({ error: 'Profile name is required' });
    }

    const result = await CreateUserProfileController.create({
      profile_name,
      profile_description: profile_description || ''
    });

    res.status(201).json({
      message: 'User profile created successfully',
      result
    });
  } catch (error) {
    res.status(400).json({ error: 'Unable to create user profile' });
  }
});

router.put('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { profile_name, profile_description } = req.body;

    if (!profile_name || !profile_name.trim()) {
      return res.status(400).json({ error: 'Profile name is required' });
    }

    const result = await UpdateUserProfileController.update(req.params.id, {
      profile_name,
      profile_description: profile_description || ''
    });

    res.json({
      message: 'User profile updated successfully',
      result
    });
  } catch (error) {
    res.status(400).json({ error: 'Unable to update user profile' });
  }
});

router.patch('/:id/suspend', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const result = await SuspendUserProfileController.suspend(req.params.id);

    res.json({
      message: 'User profile suspended successfully',
      result
    });
  } catch (error) {
    res.status(400).json({ error: 'Unable to suspend user profile' });
  }
});

module.exports = router;
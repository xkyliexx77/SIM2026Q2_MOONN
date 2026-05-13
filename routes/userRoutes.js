const express = require('express');
const router = express.Router();

const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const CreateUserAccountController = require('../controller/CreateUserAccountController');
const ViewUserAccountController = require('../controller/ViewUserAccountController');
const UpdateUserAccountController = require('../controller/UpdateUserAccountController');
const SuspendUserAccountController = require('../controller/SuspendUserAccountController');
const SearchUserAccountController = require('../controller/SearchUserAccountController');

router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const result = await ViewUserAccountController.viewAll();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load user accounts' });
  }
});

router.get('/search', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const result = await SearchUserAccountController.search(req.query.search);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to search user accounts' });
  }
});

router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email || !email.trim()) return res.status(400).json({ error: 'Email is required' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (!role) return res.status(400).json({ error: 'Role is required' });

    const result = await CreateUserAccountController.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email || !email.trim()) return res.status(400).json({ error: 'Email is required' });
    if (!role) return res.status(400).json({ error: 'Role is required' });

    const result = await UpdateUserAccountController.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/suspend', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const result = await SuspendUserAccountController.suspend(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
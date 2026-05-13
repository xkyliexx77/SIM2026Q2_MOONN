const express = require('express');
const router = express.Router();

const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const CreateFundraisingActivityController = require('../controller/CreateFundraisingActivityController');
const ViewFundraisingActivityController = require('../controller/ViewFundraisingActivityController');
const UpdateFundraisingActivityController = require('../controller/UpdateFundraisingActivityController');
const DeleteFundraisingActivityController = require('../controller/DeleteFundraisingActivityController');
const SearchFundraisingActivityController = require('../controller/SearchFundraisingActivityController');
const CompleteFundraisingActivityController = require('../controller/CompleteFundraisingActivityController');

router.get('/', async (req, res) => {
  try {
    const result = await SearchFundraisingActivityController.search(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load fundraising activities' });
  }
});

router.get('/mine/list', authMiddleware, roleMiddleware(['fundraiser']), async (req, res) => {
  try {
    const result = await ViewFundraisingActivityController.viewMine(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load your fundraising activities' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await ViewFundraisingActivityController.viewOne(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Fundraising activity not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load fundraising activity' });
  }
});

router.post('/', authMiddleware, roleMiddleware(['fundraiser']), async (req, res) => {
  try {
    const { title, description, target_amount, category_id } = req.body;

    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
    if (!description || !description.trim()) return res.status(400).json({ error: 'Description is required' });
    if (!target_amount || Number(target_amount) <= 0) return res.status(400).json({ error: 'Target amount must be greater than 0' });
    if (!category_id) return res.status(400).json({ error: 'Category is required' });

    const result = await CreateFundraisingActivityController.create(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, roleMiddleware(['fundraiser']), async (req, res) => {
  try {
    const { title, description, target_amount, category_id } = req.body;

    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
    if (!description || !description.trim()) return res.status(400).json({ error: 'Description is required' });
    if (!target_amount || Number(target_amount) <= 0) return res.status(400).json({ error: 'Target amount must be greater than 0' });
    if (!category_id) return res.status(400).json({ error: 'Category is required' });

    const result = await UpdateFundraisingActivityController.update(req.params.id, req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/complete', authMiddleware, roleMiddleware(['fundraiser']), async (req, res) => {
  try {
    const result = await CompleteFundraisingActivityController.complete(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, roleMiddleware(['fundraiser']), async (req, res) => {
  try {
    const result = await DeleteFundraisingActivityController.delete(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
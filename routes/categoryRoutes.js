const express = require('express');
const router = express.Router();

const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const CreateCategoryController = require('../controller/CreateCategoryController');
const ViewCategoryController = require('../controller/ViewCategoryController');
const UpdateCategoryController = require('../controller/UpdateCategoryController');
const DeleteCategoryController = require('../controller/DeleteCategoryController');
const SearchCategoryController = require('../controller/SearchCategoryController');

router.get('/', async (req, res) => {
  try {
    const result = await ViewCategoryController.viewAll();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load categories' });
  }
});

router.get('/search', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await SearchCategoryController.search(req.query.search);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to search categories' });
  }
});

router.post('/', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const result = await CreateCategoryController.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const result = await UpdateCategoryController.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await DeleteCategoryController.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
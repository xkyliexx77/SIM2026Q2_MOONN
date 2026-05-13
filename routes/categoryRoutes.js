const express = require('express');
const router = express.Router();

const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const CategoryEntity = require('../entity/CategoryEntity');

router.post('/', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const result = await CategoryEntity.create({
      name: name.trim(),
      description: description || ''
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create category' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await CategoryEntity.viewAll();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load categories' });
  }
});

router.get('/search', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await CategoryEntity.search(req.query.search || '');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to search categories' });
  }
});

router.get('/:id', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await CategoryEntity.viewOne(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load category' });
  }
});

router.put('/:id', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const result = await CategoryEntity.update(req.params.id, {
      name: name.trim(),
      description: description || ''
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update category' });
  }
});

router.delete('/:id', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
  try {
    const result = await CategoryEntity.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete category' });
  }
});

module.exports = router;
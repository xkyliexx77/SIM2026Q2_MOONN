const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.get('/active', ProfileController.getActive);

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  ProfileController.getAll
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  ProfileController.create
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  ProfileController.update
);

router.patch(
  '/:id/suspend',
  authMiddleware,
  roleMiddleware(['admin']),
  ProfileController.suspend
);

router.patch(
  '/:id/activate',
  authMiddleware,
  roleMiddleware(['admin']),
  ProfileController.activate
);

module.exports = router;
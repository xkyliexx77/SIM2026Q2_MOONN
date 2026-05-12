const ProfileService = require('../services/ProfileService');

class ProfileController {
  static async create(req, res) {
    try {
      const { profile_name, role } = req.body;
      const profile = await ProfileService.create(profile_name, role);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { search } = req.query;
      const profiles = await ProfileService.getAll(search);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getActive(req, res) {
    try {
      const profiles = await ProfileService.getActive();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { profile_name, role } = req.body;
      const result = await ProfileService.update(req.params.id, profile_name, role);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async suspend(req, res) {
    try {
      const result = await ProfileService.suspend(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async activate(req, res) {
    try {
      const result = await ProfileService.activate(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ProfileController;
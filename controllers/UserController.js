const UserService = require('../services/UserService');

class UserController {
  static async getAll(req, res) {
    try {
      const { search } = req.query;
      const users = await UserService.getAll(search);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const user = await UserService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const result = await UserService.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async suspend(req, res) {
    try {
      const result = await UserService.suspend(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async activate(req, res) {
    try {
      const result = await UserService.activate(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = UserController;
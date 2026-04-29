const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'supersecretkey';

class AuthService {
  static register(name, email, password, role) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!name || !name.trim()) {
          return reject(new Error('Name is required'));
        }

        if (!email || !email.trim()) {
          return reject(new Error('Email is required'));
        }

        if (!password) {
          return reject(new Error('Password is required'));
        }

        if (password.length < 6) {
          return reject(new Error('Password must be at least 6 characters'));
        }

        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).+$/;
        if (!passwordPattern.test(password)) {
          return reject(new Error('Password must contain at least 1 letter and 1 number'));
        }

        if (!['admin', 'fundraiser', 'donee', 'manager'].includes(role)) {
          return reject(new Error('Invalid role selected'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
          `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
          [name.trim(), email.trim(), hashedPassword, role],
          function (err) {
            if (err) {
              if (err.message.includes('UNIQUE')) {
                return reject(new Error('Email already exists'));
              }
              return reject(err);
            }

            resolve({
              id: this.lastID,
              name: name.trim(),
              email: email.trim(),
              role
            });
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  static login(email, password) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return reject(err);
        if (!user) return reject(new Error('User not found'));
        if (user.status === 'suspended') {
          return reject(new Error('This account has been suspended'));
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return reject(new Error('Invalid password'));

        const token = jwt.sign(
          { id: user.id, role: user.role, name: user.name },
          SECRET,
          { expiresIn: '1d' }
        );

        resolve({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      });
    });
  }
}

module.exports = { AuthService, SECRET };
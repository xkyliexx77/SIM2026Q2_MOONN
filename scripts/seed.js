const db = require('../database/db');
const bcrypt = require('bcryptjs');

async function seed() {
  const hashed = await bcrypt.hash('123456', 10);

  for (let i = 1; i <= 5; i++) {
    db.run(`INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)`, [i, `Category ${i}`]);
  }

  db.run(
    `INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
    [1, 'Manager One', 'manager@test.com', hashed, 'manager']
  );

  for (let i = 2; i <= 21; i++) {
    db.run(
      `INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [i, `Fundraiser ${i}`, `fundraiser${i}@test.com`, hashed, 'fundraiser']
    );
  }

  for (let i = 22; i <= 61; i++) {
    db.run(
      `INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [i, `Donee ${i}`, `donee${i}@test.com`, hashed, 'donee']
    );
  }

  for (let i = 1; i <= 100; i++) {
    const categoryId = ((i - 1) % 5) + 1;
    const fundraiserOwner = ((i - 1) % 20) + 2;

    db.run(
      `INSERT OR IGNORE INTO fundraisers
       (id, title, description, target_amount, current_amount, category_id, fundraiser_id, status, views, favourite_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        i,
        `Fundraiser ${i}`,
        `Description for fundraiser ${i}`,
        1000 + i * 10,
        Math.floor(Math.random() * 500),
        categoryId,
        fundraiserOwner,
        'active',
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 30)
      ]
    );
  }

  for (let i = 1; i <= 100; i++) {
    const userId = ((i - 1) % 40) + 22;
    const fundraiserId = ((i - 1) % 100) + 1;

    db.run(
      `INSERT OR IGNORE INTO favourites (user_id, fundraiser_id) VALUES (?, ?)`,
      [userId, fundraiserId]
    );
  }

  for (let i = 1; i <= 100; i++) {
    const userId = ((i - 1) % 40) + 22;
    const fundraiserId = ((i - 1) % 100) + 1;
    const amount = ((i - 1) % 10 + 1) * 5;

    db.run(
      `INSERT OR IGNORE INTO donations (id, user_id, fundraiser_id, amount) VALUES (?, ?, ?, ?)`,
      [i, userId, fundraiserId, amount]
    );
  }

  console.log('Seed data inserted.');
}

seed();
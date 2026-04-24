const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const db = new sqlite3.Database('./database/fundraising.db');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error('Error creating database schema:', err.message);
  } else {
    console.log('Database initialized.');
  }
});

module.exports = db;
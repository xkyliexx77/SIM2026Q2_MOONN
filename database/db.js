const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'fundraising.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

db.serialize(() => {

  const sqlPath = path.join(__dirname, 'schema.sql');

  const sql = fs.readFileSync(sqlPath, 'utf8');

  db.exec(sql, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('Database initialized successfully');
    }
  });

});

module.exports = db;
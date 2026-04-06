const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./meds.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS medications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      interval INTEGER,
      last_taken INTEGER
    )
  `);
});

module.exports = db;

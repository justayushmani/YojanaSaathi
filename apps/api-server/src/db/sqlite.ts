import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use DATA_DIR from env for Render disk, otherwise default to current directory
const dataDir = process.env.DATA_DIR || process.cwd();
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'yojana.db');
const db = new Database(dbPath, { verbose: console.log });

// Initialize the users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;

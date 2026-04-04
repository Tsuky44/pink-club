import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'data', 'gallery.db');

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    db = new Database(dbPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        photographer_name TEXT NOT NULL,
        car_model TEXT NOT NULL,
        image_url TEXT NOT NULL,
        kudos INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_kudos ON photos(kudos DESC);
      CREATE INDEX IF NOT EXISTS idx_created_at ON photos(created_at DESC);
    `);
  }
  return db;
}

CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_name TEXT NOT NULL UNIQUE,
    profile_description TEXT,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended'))
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended'))
);

INSERT OR IGNORE INTO users (name, email, password, role, status)
VALUES (
  'Admin',
  'admin@gmail.com',
  '$2b$10$hjqYzlLOk2bfRBZuhKm6Zu49cYl.9dJ67G27AbJIVSHIzjJxEQIx2',
  'admin',
  'active'
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS fundraisers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL DEFAULT 0,
    category_id INTEGER,
    fundraiser_id INTEGER NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    views INTEGER DEFAULT 0,
    favourite_count INTEGER DEFAULT 0,
    FOREIGN KEY(category_id) REFERENCES categories(id),
    FOREIGN KEY(fundraiser_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    fundraiser_id INTEGER NOT NULL,
    UNIQUE(user_id, fundraiser_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(fundraiser_id) REFERENCES fundraisers(id)
);

CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    fundraiser_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    donated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(fundraiser_id) REFERENCES fundraisers(id)
);


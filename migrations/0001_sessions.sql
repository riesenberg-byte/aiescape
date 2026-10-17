PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS sessions (
  code TEXT PRIMARY KEY,
  team TEXT NOT NULL,
  location TEXT NOT NULL,
  room TEXT NOT NULL DEFAULT 'prompt-lab',
  stage INTEGER NOT NULL DEFAULT 0,
  revision INTEGER NOT NULL DEFAULT 0,
  hints INTEGER NOT NULL DEFAULT 0,
  hint_level INTEGER NOT NULL DEFAULT 0,
  mistakes INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  finished_at INTEGER,
  last_message TEXT NOT NULL DEFAULT 'Ich habe die Tür geschlossen. Zugluft senkt die Effizienz.',
  listed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS players (
  token_hash TEXT PRIMARY KEY,
  session_code TEXT NOT NULL REFERENCES sessions(code) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('terminal', 'manual')),
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS players_session ON players(session_code);
CREATE INDEX IF NOT EXISTS sessions_finished ON sessions(finished_at) WHERE listed = 1;

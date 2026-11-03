"""Database schema and connection management for Visit Tracker."""

import sqlite3
import os
import uuid
from contextlib import contextmanager
from typing import Generator, Optional

DEFAULT_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "visittracker.db")

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_code TEXT UNIQUE NOT NULL,
    user_role TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_code TEXT NOT NULL,
    state TEXT NOT NULL,
    cluster TEXT NOT NULL,
    branch TEXT NOT NULL,
    visit_date DATE NOT NULL,
    visit_type TEXT NOT NULL,
    sub_type TEXT,
    customer_status TEXT,
    id_type TEXT,
    entity_name TEXT NOT NULL,
    entity_code TEXT,
    mobile TEXT,
    reason TEXT,
    address TEXT,
    latitude REAL,
    longitude REAL,
    location_timestamp TEXT,
    photo_data TEXT,
    status TEXT DEFAULT 'Logged',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_visits_code ON visits(visit_code);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_visits_role ON visits(user_role);
CREATE INDEX IF NOT EXISTS idx_visits_type ON visits(visit_type);
CREATE INDEX IF NOT EXISTS idx_visits_user_name ON visits(user_name);
CREATE INDEX IF NOT EXISTS idx_visits_branch ON visits(branch);
CREATE INDEX IF NOT EXISTS idx_visits_state ON visits(state);
"""


class Database:
    """SQLite Database manager with thread-safe connection handling."""

    def __init__(self, db_path: str = DEFAULT_DB_PATH):
        if db_path == ":memory:":
            self.is_memory = True
            self.db_path = f"file:mem_{uuid.uuid4().hex}?mode=memory&cache=shared"
            self._keepalive_conn: Optional[sqlite3.Connection] = sqlite3.connect(
                self.db_path, uri=True, check_same_thread=False
            )
        else:
            self.is_memory = False
            self.db_path = os.path.abspath(db_path)
            self._keepalive_conn = None
        self.init_db()

    def get_connection(self) -> sqlite3.Connection:
        """Create a new SQLite connection with row factory set."""
        if self.is_memory:
            conn = sqlite3.connect(self.db_path, uri=True, check_same_thread=False, timeout=20.0)
        else:
            conn = sqlite3.connect(self.db_path, check_same_thread=False, timeout=20.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    @contextmanager
    def connect(self) -> Generator[sqlite3.Connection, None, None]:
        """Context manager for acquiring and closing a database connection."""
        conn = self.get_connection()
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def init_db(self) -> None:
        """Initialize database tables and indexes."""
        if not self.is_memory:
            os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        with self.connect() as conn:
            conn.executescript(SCHEMA_SQL)

    def close(self) -> None:
        """Close keepalive connection if memory db."""
        if self._keepalive_conn:
            try:
                self._keepalive_conn.close()
            except Exception:
                pass

    def __del__(self):
        self.close()

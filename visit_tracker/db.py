"""Database schema and connection management for Visit Tracker."""

import sqlite3
import os
import uuid
from contextlib import contextmanager
from typing import Generator, Optional

DEFAULT_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "visittracker.db")

SCHEMA_SQL = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    id_type TEXT DEFAULT 'National ID',
    id_number TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hosts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    department TEXT,
    phone TEXT,
    active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    building TEXT,
    floor TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_code TEXT UNIQUE NOT NULL,
    visitor_id INTEGER NOT NULL,
    host_id INTEGER,
    location_id INTEGER,
    purpose TEXT NOT NULL,
    category TEXT DEFAULT 'Corporate Visitor',
    badge_number TEXT,
    status TEXT NOT NULL CHECK(status IN ('SCHEDULED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED')),
    expected_checkin TIMESTAMP,
    checkin_time TIMESTAMP,
    checkout_time TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE,
    FOREIGN KEY (host_id) REFERENCES hosts(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_visitors_name ON visitors(name);
CREATE INDEX IF NOT EXISTS idx_visitors_email ON visitors(email);
CREATE INDEX IF NOT EXISTS idx_visitors_phone ON visitors(phone);
CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status);
CREATE INDEX IF NOT EXISTS idx_visits_checkin ON visits(checkin_time);
CREATE INDEX IF NOT EXISTS idx_visits_expected ON visits(expected_checkin);
CREATE INDEX IF NOT EXISTS idx_visits_code ON visits(visit_code);
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
        """Create a new SQLite connection with foreign keys enabled and row factory set."""
        if self.is_memory:
            conn = sqlite3.connect(self.db_path, uri=True, check_same_thread=False, timeout=20.0)
        else:
            conn = sqlite3.connect(self.db_path, check_same_thread=False, timeout=20.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def close(self) -> None:
        """Close keepalive connection if memory db."""
        if self._keepalive_conn:
            try:
                self._keepalive_conn.close()
            except Exception:
                pass

    def __del__(self):
        self.close()

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

    def seed_initial_data(self) -> None:
        """Seeds sample hosts, locations, and visitors if database is empty."""
        with self.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM hosts")
            if cursor.fetchone()[0] > 0:
                return  # already seeded

            # Seed default Hosts
            hosts = [
                ("Alex Johnson", "alex.johnson@example.com", "Engineering", "+1-555-0101"),
                ("Sarah Davis", "sarah.davis@example.com", "Operations", "+1-555-0102"),
                ("Michael Chen", "michael.chen@example.com", "Human Resources", "+1-555-0103"),
                ("Emily Rodriguez", "emily.rodriguez@example.com", "Sales & Marketing", "+1-555-0104"),
                ("David Kim", "david.kim@example.com", "Executive", "+1-555-0105"),
            ]
            cursor.executemany(
                "INSERT INTO hosts (name, email, department, phone, active) VALUES (?, ?, ?, ?, 1)",
                hosts
            )

            # Seed default Locations
            locations = [
                ("Main Reception", "Building A", "Ground Floor"),
                ("Conference Hall 1", "Building A", "2nd Floor"),
                ("Tech Hub Lab", "Building B", "3rd Floor"),
                ("Executive Boardroom", "Building C", "Penthouse"),
            ]
            cursor.executemany(
                "INSERT INTO locations (name, building, floor) VALUES (?, ?, ?)",
                locations
            )

            # Seed sample visitors
            visitors = [
                ("VIS-1001", "Emma Watson", "emma.w@acmecorp.com", "+1-555-1234", "Acme Corporation", "Passport", "P98765432"),
                ("VIS-1002", "Robert Miller", "robert.m@technova.io", "+1-555-2345", "TechNova Solutions", "Driver's License", "DL-45678"),
                ("VIS-1003", "Aisha Khan", "aisha.k@globalaudit.org", "+1-555-3456", "Global Audit Partners", "National ID", "NAT-88990"),
            ]
            cursor.executemany(
                "INSERT INTO visitors (visitor_id, name, email, phone, company, id_type, id_number) VALUES (?, ?, ?, ?, ?, ?, ?)",
                visitors
            )

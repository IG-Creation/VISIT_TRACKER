"""Unit tests for SQLite Database manager and schema."""

import unittest
import sqlite3
from visit_tracker.db import Database


class TestDatabase(unittest.TestCase):
    def setUp(self):
        # Use an in-memory database for isolation and speed
        self.db = Database(":memory:")

    def test_schema_tables_exist(self):
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = {row["name"] for row in cursor.fetchall()}
            expected = {"visitors", "hosts", "locations", "visits", "audit_logs"}
            self.assertTrue(expected.issubset(tables))

    def test_schema_indexes_exist(self):
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='index'")
            indexes = {row["name"] for row in cursor.fetchall()}
            expected = {
                "idx_visitors_name",
                "idx_visitors_email",
                "idx_visitors_phone",
                "idx_visits_status",
                "idx_visits_checkin",
                "idx_visits_expected",
                "idx_visits_code",
            }
            self.assertTrue(expected.issubset(indexes))

    def test_foreign_key_enforcement(self):
        # Inserting a visit with non-existent visitor_id must fail foreign key constraint
        with self.assertRaises(sqlite3.IntegrityError):
            with self.db.connect() as conn:
                conn.execute(
                    """
                    INSERT INTO visits (visit_code, visitor_id, purpose, status)
                    VALUES ('VT-TEST-99', 9999, 'Test Purpose', 'SCHEDULED')
                    """
                )

    def test_seed_initial_data(self):
        self.db.seed_initial_data()
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM hosts")
            hosts_count = cursor.fetchone()[0]
            self.assertGreater(hosts_count, 0)

            cursor.execute("SELECT COUNT(*) FROM locations")
            locations_count = cursor.fetchone()[0]
            self.assertGreater(locations_count, 0)

            cursor.execute("SELECT COUNT(*) FROM visitors")
            visitors_count = cursor.fetchone()[0]
            self.assertGreater(visitors_count, 0)

        # Idempotence: calling seed again should not duplicate data
        self.db.seed_initial_data()
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM hosts")
            self.assertEqual(cursor.fetchone()[0], hosts_count)

    def test_transaction_rollback_on_error(self):
        try:
            with self.db.connect() as conn:
                conn.execute("INSERT INTO hosts (name) VALUES ('Temporary Host')")
                # Intentional error to trigger rollback
                conn.execute("INSERT INTO hosts (id, name) VALUES ('INVALID_PRIMARY_KEY', 'Fail')")
        except Exception:
            pass

        # Verify 'Temporary Host' was rolled back
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM hosts WHERE name = 'Temporary Host'")
            self.assertEqual(cursor.fetchone()[0], 0)


if __name__ == "__main__":
    unittest.main()

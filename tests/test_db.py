"""Unit tests for SQLite Database manager and schema."""

import unittest
from visit_tracker.db import Database


class TestDatabase(unittest.TestCase):
    def setUp(self):
        self.db = Database(":memory:")

    def test_schema_tables_exist(self):
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = {row["name"] for row in cursor.fetchall()}
            expected = {"visits", "audit_logs"}
            self.assertTrue(expected.issubset(tables))

    def test_schema_indexes_exist(self):
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='index'")
            indexes = {row["name"] for row in cursor.fetchall()}
            expected = {
                "idx_visits_code",
                "idx_visits_date",
                "idx_visits_role",
                "idx_visits_type",
                "idx_visits_user_name",
                "idx_visits_branch",
                "idx_visits_state",
            }
            self.assertTrue(expected.issubset(indexes))

    def test_transaction_rollback_on_error(self):
        try:
            with self.db.connect() as conn:
                conn.execute(
                    """
                    INSERT INTO visits (visit_code, user_role, user_name, user_code, state, cluster, branch, visit_date, visit_type, entity_name)
                    VALUES ('VT-ROLLBACK-1', 'BDO', 'Officer', 'FMF111', 'Delhi', 'Delhi 1 Cluster', 'Burari', '2026-11-03', 'Customer Visit', 'Test')
                    """
                )
                # Intentional syntax/constraint error to trigger rollback
                conn.execute("INSERT INTO visits (id, visit_code) VALUES ('INVALID_PRIMARY_KEY', 'FAIL')")
        except Exception:
            pass

        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM visits WHERE visit_code = 'VT-ROLLBACK-1'")
            self.assertEqual(cursor.fetchone()[0], 0)


if __name__ == "__main__":
    unittest.main()

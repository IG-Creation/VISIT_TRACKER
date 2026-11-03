"""Unit tests for Visit Tracker Command Line Interface."""

import io
import os
import tempfile
import unittest
from unittest.mock import patch
from visit_tracker.cli import main
from visit_tracker.db import Database


class TestCLI(unittest.TestCase):
    def setUp(self):
        # Create a temporary database file for CLI commands
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = os.path.join(self.temp_dir.name, "test_cli.db")
        db = Database(self.db_path)
        db.seed_initial_data()

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_cli_seed(self):
        exit_code = main(["--db", self.db_path, "seed"])
        self.assertEqual(exit_code, 0)

    def test_cli_stats(self):
        with patch("sys.stdout", new=io.StringIO()) as fake_out:
            exit_code = main(["--db", self.db_path, "stats"])
            self.assertEqual(exit_code, 0)
            output = fake_out.getvalue()
            self.assertIn("VISIT TRACKER STATS", output)

    def test_cli_walkin_and_checkout_flow(self):
        # 1. Walkin
        with patch("sys.stdout", new=io.StringIO()) as fake_out:
            exit_code = main([
                "--db", self.db_path, "walkin",
                "--name", "CLI Visitor",
                "--purpose", "Terminal Testing",
                "--company", "Shell Corp"
            ])
            self.assertEqual(exit_code, 0)
            output = fake_out.getvalue()
            self.assertIn("Walk-in checked in successfully", output)
            self.assertIn("CLI Visitor", output)

        # 2. Active roll call
        with patch("sys.stdout", new=io.StringIO()) as fake_out:
            exit_code = main(["--db", self.db_path, "active"])
            self.assertEqual(exit_code, 0)
            output = fake_out.getvalue()
            self.assertIn("EMERGENCY ROLL CALL", output)
            self.assertIn("CLI Visitor", output)

        # 3. List
        with patch("sys.stdout", new=io.StringIO()) as fake_out:
            exit_code = main(["--db", self.db_path, "list", "--query", "CLI Visitor"])
            self.assertEqual(exit_code, 0)
            output = fake_out.getvalue()
            self.assertIn("CLI Visitor", output)

    def test_cli_export(self):
        out_csv = os.path.join(self.temp_dir.name, "cli_export.csv")
        exit_code = main(["--db", self.db_path, "export", "-o", out_csv])
        self.assertEqual(exit_code, 0)
        self.assertTrue(os.path.exists(out_csv))
        with open(out_csv, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("visit_code", content)

    def test_cli_no_args_shows_help(self):
        with patch("sys.stdout", new=io.StringIO()) as fake_out:
            exit_code = main([])
            self.assertEqual(exit_code, 0)


if __name__ == "__main__":
    unittest.main()

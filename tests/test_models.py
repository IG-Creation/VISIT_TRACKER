"""Unit tests for Visit Tracker data models and validation."""

import unittest
from visit_tracker.models import (
    Visitor, Host, Location, Visit, AuditLog,
    VisitStatus, ValidationError, validate_email, validate_phone, validate_required_string
)


class TestValidationHelpers(unittest.TestCase):
    def test_validate_email_valid(self):
        self.assertEqual(validate_email("user@example.com"), "user@example.com")
        self.assertEqual(validate_email("John.Doe+tag@sub.domain.co"), "john.doe+tag@sub.domain.co")
        self.assertIsNone(validate_email(None))
        self.assertIsNone(validate_email(""))
        self.assertIsNone(validate_email("   "))

    def test_validate_email_invalid(self):
        invalid_emails = ["plainaddress", "@missingusername.com", "user@", "user@.com", "user@domain..com"]
        for email in invalid_emails:
            with self.subTest(email=email):
                with self.assertRaises(ValidationError):
                    validate_email(email)

    def test_validate_phone_valid(self):
        self.assertEqual(validate_phone("+1-555-1234"), "+1-555-1234")
        self.assertEqual(validate_phone("9876543210"), "9876543210")
        self.assertIsNone(validate_phone(None))
        self.assertIsNone(validate_phone(""))

    def test_validate_phone_invalid(self):
        # Too short (<7 digits) or too long (>15 digits)
        invalid_phones = ["123", "abc", "+12-34", "12345678901234567890"]
        for p in invalid_phones:
            with self.subTest(phone=p):
                with self.assertRaises(ValidationError):
                    validate_phone(p)

    def test_validate_required_string(self):
        self.assertEqual(validate_required_string("  Hello World  ", "field"), "Hello World")
        with self.assertRaises(ValidationError):
            validate_required_string(None, "name")
        with self.assertRaises(ValidationError):
            validate_required_string("", "name")
        with self.assertRaises(ValidationError):
            validate_required_string("   ", "name")


class TestDataModels(unittest.TestCase):
    def test_visitor_creation_valid(self):
        visitor = Visitor(
            name="Alice Smith",
            email="alice@corp.com",
            phone="+1-555-4433",
            company="Tech Corp"
        )
        self.assertEqual(visitor.name, "Alice Smith")
        self.assertEqual(visitor.email, "alice@corp.com")
        d = visitor.to_dict()
        self.assertEqual(d["name"], "Alice Smith")
        self.assertEqual(d["company"], "Tech Corp")

    def test_visitor_creation_invalid(self):
        with self.assertRaises(ValidationError):
            Visitor(name="")
        with self.assertRaises(ValidationError):
            Visitor(name="Bob", email="not-an-email")

    def test_host_creation(self):
        host = Host(name="Dr. Jane Watson", department="Research", email="jane@lab.org")
        self.assertEqual(host.name, "Dr. Jane Watson")
        self.assertEqual(host.department, "Research")
        self.assertTrue(host.active)

    def test_location_creation(self):
        loc = Location(name="Main Conference Room", building="Bldg 4", floor="3")
        self.assertEqual(loc.name, "Main Conference Room")
        self.assertEqual(loc.building, "Bldg 4")

    def test_visit_creation_and_status(self):
        visit = Visit(
            visitor_id=1,
            purpose="Quarterly Review",
            status=VisitStatus.SCHEDULED
        )
        self.assertEqual(visit.status, VisitStatus.SCHEDULED)
        d = visit.to_dict()
        self.assertEqual(d["status"], "SCHEDULED")

    def test_visit_invalid_status(self):
        with self.assertRaises(ValidationError):
            Visit(visitor_id=1, purpose="Audit", status="NOT_A_REAL_STATUS")  # type: ignore

    def test_audit_log(self):
        log = AuditLog(action="TEST_ACTION", visit_id=5, details="Testing log entry")
        d = log.to_dict()
        self.assertEqual(d["action"], "TEST_ACTION")
        self.assertEqual(d["visit_id"], 5)


if __name__ == "__main__":
    unittest.main()

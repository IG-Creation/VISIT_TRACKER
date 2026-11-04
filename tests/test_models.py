"""Unit tests for Visit Tracker data models and validation."""

import unittest
from datetime import date, timedelta
from visit_tracker.models import (
    VisitEntry, UserRole, VisitType, ValidationError,
    clean_name, validate_user_code, validate_mobile,
    validate_dsa_code, validate_connector_code, validate_vendor_code,
    validate_lead_or_loan_id, validate_visit_date
)


class TestValidationHelpers(unittest.TestCase):
    def test_clean_name_valid(self):
        self.assertEqual(clean_name("Rahul Sharma"), "Rahul Sharma")
        # Collapses extra spaces and trims
        self.assertEqual(clean_name("   Amit    Kumar   Singh   "), "Amit Kumar Singh")
        self.assertEqual(clean_name("Dr. A. P. J. Kalam"), "Dr. A. P. J. Kalam")

    def test_clean_name_rejects_numbers(self):
        with self.assertRaises(ValidationError):
            clean_name("John123")
        with self.assertRaises(ValidationError):
            clean_name("Rahul 2")
        with self.assertRaises(ValidationError):
            clean_name("9999")

    def test_clean_name_rejects_empty(self):
        with self.assertRaises(ValidationError):
            clean_name("")
        with self.assertRaises(ValidationError):
            clean_name("   ")
        with self.assertRaises(ValidationError):
            clean_name(None)

    def test_validate_user_code_valid(self):
        self.assertEqual(validate_user_code("FMF123456"), "FMF123456")
        self.assertEqual(validate_user_code("fmf99"), "FMF99")
        self.assertEqual(validate_user_code("FMF1"), "FMF1")

    def test_validate_user_code_invalid(self):
        # Must start with FMF
        with self.assertRaises(ValidationError):
            validate_user_code("ABC123456")
        # Digits only after FMF
        with self.assertRaises(ValidationError):
            validate_user_code("FMFABC")
        # Max 6 digits (7 digits should fail)
        with self.assertRaises(ValidationError):
            validate_user_code("FMF1234567")
        # Empty after FMF
        with self.assertRaises(ValidationError):
            validate_user_code("FMF")

    def test_validate_mobile(self):
        self.assertEqual(validate_mobile("9876543210"), "9876543210")
        self.assertEqual(validate_mobile("+91 98765 43210"), "9876543210")
        # Invalid lengths
        with self.assertRaises(ValidationError):
            validate_mobile("12345")
        with self.assertRaises(ValidationError):
            validate_mobile("1234567890123")
        with self.assertRaises(ValidationError):
            validate_mobile("abcdefghij")

    def test_validate_dsa_code(self):
        self.assertEqual(validate_dsa_code("FBGP123456"), "FBGP123456")
        self.assertEqual(validate_dsa_code("fbgp45"), "FBGP45")
        # Optional check for onboarding/regular visit
        self.assertIsNone(validate_dsa_code(None, required=False))
        self.assertIsNone(validate_dsa_code("", required=False))
        self.assertIsNone(validate_dsa_code("FBGP", required=False))
        with self.assertRaises(ValidationError):
            validate_dsa_code("DSA123")
        with self.assertRaises(ValidationError):
            validate_dsa_code("FBGP1234567")
        with self.assertRaises(ValidationError):
            validate_dsa_code("FBGP", required=True)

    def test_validate_connector_code(self):
        self.assertEqual(validate_connector_code("FGP123456"), "FGP123456")
        self.assertEqual(validate_connector_code("fgp987"), "FGP987")
        # Optional check for onboarding/regular visit
        self.assertIsNone(validate_connector_code(None, required=False))
        self.assertIsNone(validate_connector_code("", required=False))
        self.assertIsNone(validate_connector_code("FGP", required=False))
        with self.assertRaises(ValidationError):
            validate_connector_code("CON123")
        with self.assertRaises(ValidationError):
            validate_connector_code("FGP1234567")
        with self.assertRaises(ValidationError):
            validate_connector_code("FGP", required=True)

    def test_validate_vendor_code(self):
        self.assertIsNone(validate_vendor_code(None))
        self.assertIsNone(validate_vendor_code(""))
        self.assertIsNone(validate_vendor_code("V", required=False))
        self.assertEqual(validate_vendor_code("V123456"), "V123456")
        self.assertEqual(validate_vendor_code("v99"), "V99")
        with self.assertRaises(ValidationError):
            validate_vendor_code("VEN123")
        with self.assertRaises(ValidationError):
            validate_vendor_code("V1234567")
        with self.assertRaises(ValidationError):
            validate_vendor_code("V", required=True)

    def test_validate_lead_or_loan_id(self):
        self.assertEqual(validate_lead_or_loan_id("482910"), "482910")
        self.assertEqual(validate_lead_or_loan_id("123"), "123")
        with self.assertRaises(ValidationError):
            validate_lead_or_loan_id("ABC")
        with self.assertRaises(ValidationError):
            validate_lead_or_loan_id("1234567")

    def test_validate_visit_date(self):
        today = date.today()
        today_str = today.isoformat()
        self.assertEqual(validate_visit_date(today_str), today_str)

        # 30 days ago is valid
        past_30 = (today - timedelta(days=30)).isoformat()
        self.assertEqual(validate_visit_date(past_30), past_30)

        # Future date rejected
        future = (today + timedelta(days=1)).isoformat()
        with self.assertRaises(ValidationError):
            validate_visit_date(future)

        # More than 2 months (63 days) rejected
        too_old = (today - timedelta(days=65)).isoformat()
        with self.assertRaises(ValidationError):
            validate_visit_date(too_old)


class TestVisitEntryModel(unittest.TestCase):
    def test_visit_entry_creation_valid(self):
        today = date.today().isoformat()
        entry = VisitEntry(
            user_role="BDO",
            user_name="   Rohan    Sharma  ",
            user_code="fmf123456",
            state="Bihar",
            cluster="Muzaffarpur Cluster",
            branch="Begusarai",
            visit_date=today,
            visit_type="Customer Visit",
            entity_name="Ramesh Singh",
            mobile="9876543210"
        )
        self.assertEqual(entry.user_name, "Rohan Sharma")
        self.assertEqual(entry.user_code, "FMF123456")
        self.assertEqual(entry.mobile, "9876543210")
        d = entry.to_dict()
        self.assertEqual(d["user_role"], "BDO")

    def test_visit_entry_invalid_role(self):
        today = date.today().isoformat()
        with self.assertRaises(ValidationError):
            VisitEntry(
                user_role="INVALID_ROLE",
                user_name="Rohan",
                user_code="FMF123456",
                state="Bihar",
                cluster="Patna Cluster",
                branch="Patna",
                visit_date=today,
                visit_type="Customer Visit",
                entity_name="Client"
            )


if __name__ == "__main__":
    unittest.main()

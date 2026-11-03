"""Comprehensive tests for TrackerService business logic."""

import unittest
from datetime import date, timedelta
from visit_tracker.db import Database
from visit_tracker.service import TrackerService
from visit_tracker.models import ValidationError, VisitType


class TestTrackerService(unittest.TestCase):
    def setUp(self):
        self.db = Database(":memory:")
        self.service = TrackerService(self.db)
        self.today = date.today().isoformat()

    def test_multi_visit_submission_customer_and_partner(self):
        payload = {
            "user_role": "BDO",
            "user_name": "Rohan Sharma",
            "user_code": "FMF123456",
            "state": "Bihar",
            "cluster": "Muzaffarpur Cluster",
            "branch": "Begusarai",
            "visit_date": self.today,
            "visit_types": ["Customer Visit", "Partner Visit"],
            "customer_visit": {
                "customer_status": "Existing Customer",
                "id_type": "Loan Application ID",
                "id_number": "543210",
                "customer_name": "Ramesh Kumar",
                "customer_mobile": "9876543210",
                "reason": "Document related visit",
                "address": "Main Market, Begusarai",
                "latitude": 25.4182,
                "longitude": 86.1272,
                "location_timestamp": f"{self.today} 10:15:00"
            },
            "partner_visit": {
                "subtypes": ["DSA visit", "Connector Visit"],
                "dsa": {
                    "name": "Apex Finance",
                    "code": "FBGP109283",
                    "mobile": "9123456789",
                    "reason": "Onboarding visit",
                    "latitude": 25.4200,
                    "longitude": 86.1300,
                    "location_timestamp": f"{self.today} 11:30:00"
                },
                "connector": {
                    "name": "Sunil Verma",
                    "code": "FGP304918",
                    "mobile": "9876501234",
                    "reason": "Customer related visit",
                    "latitude": 25.4220,
                    "longitude": 86.1320,
                    "location_timestamp": f"{self.today} 12:45:00"
                }
            }
        }

        created = self.service.submit_multi_visits(payload)
        # Should generate 3 distinct rows: 1 Customer + 1 DSA + 1 Connector!
        self.assertEqual(len(created), 3)

        # Check Row 1: Customer
        c_row = created[0]
        self.assertEqual(c_row.visit_type, "Customer Visit")
        self.assertEqual(c_row.entity_name, "Ramesh Kumar")
        self.assertEqual(c_row.entity_code, "543210")
        self.assertEqual(c_row.id_type, "Loan Application ID")
        self.assertEqual(c_row.user_code, "FMF123456")

        # Check Row 2: DSA
        dsa_row = created[1]
        self.assertEqual(dsa_row.visit_type, "Partner Visit")
        self.assertEqual(dsa_row.sub_type, "DSA visit")
        self.assertEqual(dsa_row.entity_name, "Apex Finance")
        self.assertEqual(dsa_row.entity_code, "FBGP109283")

        # Check Row 3: Connector
        con_row = created[2]
        self.assertEqual(con_row.visit_type, "Partner Visit")
        self.assertEqual(con_row.sub_type, "Connector Visit")
        self.assertEqual(con_row.entity_name, "Sunil Verma")
        self.assertEqual(con_row.entity_code, "FGP304918")

    def test_vendor_and_business_visit_submission(self):
        payload = {
            "user_role": "BDM",
            "user_name": "Pooja Verma",
            "user_code": "FMF654321",
            "state": "Gujarat",
            "cluster": "Ahmedabad Cluster",
            "branch": "Surat",
            "visit_date": self.today,
            "visit_types": ["Vendor Visit", "Business Visit"],
            "vendor_visit": {
                "subtypes": ["Technical Vendor"],
                "technical": {
                    "name": "Prime Tech Engineers",
                    "code": "V987654",
                    "mobile": "9988776655",
                    "reason": "Regular visit",
                    "latitude": 21.1702,
                    "longitude": 72.8311,
                    "location_timestamp": f"{self.today} 14:00:00"
                }
            },
            "business_visit": {
                "name": "Surat Textiles Trading",
                "mobile": "9876512345",
                "reason": "Regular visit",
                "address": "Ring Road, Surat",
                "latitude": 21.1750,
                "longitude": 72.8350,
                "location_timestamp": f"{self.today} 15:30:00"
            }
        }

        created = self.service.submit_multi_visits(payload)
        self.assertEqual(len(created), 2)
        self.assertEqual(created[0].sub_type, "Technical Vendor")
        self.assertEqual(created[0].entity_code, "V987654")
        self.assertEqual(created[1].visit_type, "Business Visit")
        self.assertEqual(created[1].entity_name, "Surat Textiles Trading")

    def test_validation_errors_prevent_invalid_submission(self):
        # Missing visit types
        with self.assertRaises(ValidationError):
            self.service.submit_multi_visits({
                "user_role": "BDO",
                "user_name": "Rohan",
                "user_code": "FMF123456",
                "state": "Bihar",
                "cluster": "Patna Cluster",
                "branch": "Patna",
                "visit_date": self.today,
                "visit_types": []
            })

        # Name with numbers
        with self.assertRaises(ValidationError):
            self.service.submit_multi_visits({
                "user_role": "BDO",
                "user_name": "Rohan123",
                "user_code": "FMF123456",
                "state": "Bihar",
                "cluster": "Patna Cluster",
                "branch": "Patna",
                "visit_date": self.today,
                "visit_types": ["Other Visit"],
                "other_visit": {"name": "Test Entity", "reason": "Audit"}
            })

    def test_master_update_and_delete(self):
        payload = {
            "user_role": "CBM",
            "user_name": "Anil Mehta",
            "user_code": "FMF998877",
            "state": "Rajasthan",
            "cluster": "Jodhpur Cluster",
            "branch": "Jodhpur",
            "visit_date": self.today,
            "visit_types": ["Business Visit"],
            "business_visit": {
                "name": "Marwar Logistics",
                "mobile": "9829012345",
                "reason": "Regular visit",
                "address": "Industrial Area"
            }
        }
        created = self.service.submit_multi_visits(payload)
        visit_id = created[0].id

        # Update visit
        updated = self.service.update_visit(visit_id, {
            "entity_name": "Marwar Super Logistics",
            "status": "Verified",
            "notes": "Verified by CBM"
        })
        self.assertEqual(updated.entity_name, "Marwar Super Logistics")
        self.assertEqual(updated.status, "Verified")
        self.assertEqual(updated.notes, "Verified by CBM")

        # Delete visit
        success = self.service.delete_visit(visit_id)
        self.assertTrue(success)
        self.assertIsNone(self.service.get_visit(visit_id))

    def test_advanced_filtering_and_counting(self):
        self.service.seed_demo_visits()
        all_visits = self.service.list_visits()
        self.assertGreaterEqual(len(all_visits), 2)

        # Filter by Role
        bdo_visits = self.service.list_visits(user_role="BDO")
        self.assertTrue(all(v.user_role == "BDO" for v in bdo_visits))

        # Filter by State
        bihar_visits = self.service.list_visits(state="Bihar")
        self.assertTrue(all(v.state == "Bihar" for v in bihar_visits))

        # Count with filters
        count_bdo = self.service.count_visits(user_role="BDO")
        self.assertEqual(count_bdo, len(bdo_visits))

    def test_csv_export(self):
        self.service.seed_demo_visits()
        csv_data = self.service.export_visits_csv()
        self.assertIn("visit_code", csv_data)
        self.assertIn("user_role", csv_data)
        self.assertIn("user_code", csv_data)
        self.assertIn("map_url", csv_data)


if __name__ == "__main__":
    unittest.main()

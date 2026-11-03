"""Comprehensive tests for TrackerService business logic."""

import unittest
from datetime import datetime, timedelta
from visit_tracker.db import Database
from visit_tracker.service import TrackerService
from visit_tracker.models import VisitStatus, ValidationError


class TestTrackerService(unittest.TestCase):
    def setUp(self):
        self.db = Database(":memory:")
        self.service = TrackerService(self.db)

    def test_visitor_lifecycle(self):
        visitor = self.service.create_visitor(
            name="Johnathan Swift",
            email="johnathan@books.org",
            phone="+1-555-9090",
            company="Publishing Co"
        )
        self.assertIsNotNone(visitor.id)
        self.assertTrue(visitor.visitor_id.startswith("VIS-"))

        fetched = self.service.get_visitor(visitor.id)
        self.assertIsNotNone(fetched)
        self.assertEqual(fetched.name, "Johnathan Swift")

        # Search visitor
        results = self.service.search_visitors("Swift")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].id, visitor.id)

        # Search by company
        results = self.service.search_visitors("Publishing")
        self.assertEqual(len(results), 1)

    def test_host_and_location_lifecycle(self):
        host = self.service.create_host(
            name="Dr. Gregory House",
            department="Diagnostics",
            email="house@princeton.org",
            phone="+1-555-8888"
        )
        self.assertIsNotNone(host.id)
        self.assertEqual(host.department, "Diagnostics")

        hosts = self.service.list_hosts()
        self.assertEqual(len(hosts), 1)
        self.assertEqual(hosts[0].name, "Dr. Gregory House")

        loc = self.service.create_location(name="Conference Room 101", building="Building 1", floor="1")
        self.assertIsNotNone(loc.id)
        locs = self.service.list_locations()
        self.assertEqual(len(locs), 1)

    def test_visit_schedule_checkin_checkout_flow(self):
        visitor = self.service.create_visitor(name="Bruce Wayne", company="Wayne Enterprises")
        host = self.service.create_host(name="Lucius Fox", department="Applied Sciences")

        # 1. Schedule Visit
        visit = self.service.create_visit(
            visitor_id=visitor.id,
            host_id=host.id,
            purpose="Tech Demonstration",
            notes="NDA Signed"
        )
        self.assertEqual(visit.status, VisitStatus.SCHEDULED)
        self.assertTrue(visit.visit_code.startswith("VT-"))
        self.assertIsNone(visit.checkin_time)
        self.assertIsNone(visit.checkout_time)

        # Cannot check out before checking in
        with self.assertRaises(ValidationError):
            self.service.checkout_visit(visit.id)

        # 2. Check In
        checked_in_visit = self.service.checkin_visit(visit.id, badge_number="BADGE-007")
        self.assertEqual(checked_in_visit.status, VisitStatus.CHECKED_IN)
        self.assertIsNotNone(checked_in_visit.checkin_time)
        self.assertEqual(checked_in_visit.badge_number, "BADGE-007")

        # Prevent double check-in
        with self.assertRaises(ValidationError):
            self.service.checkin_visit(visit.id)

        # Verify appears in Active Roll Call
        active = self.service.get_active_visitors()
        self.assertEqual(len(active), 1)
        self.assertEqual(active[0].visit_code, visit.visit_code)

        # 3. Check Out
        checked_out_visit = self.service.checkout_visit(visit.id)
        self.assertEqual(checked_out_visit.status, VisitStatus.CHECKED_OUT)
        self.assertIsNotNone(checked_out_visit.checkout_time)

        # Prevent double check-out
        with self.assertRaises(ValidationError):
            self.service.checkout_visit(visit.id)

        # Verify no longer in Active Roll Call
        active = self.service.get_active_visitors()
        self.assertEqual(len(active), 0)

        # Verify cannot cancel completed visit
        with self.assertRaises(ValidationError):
            self.service.cancel_visit(visit.id)

    def test_walkin_checkin(self):
        host = self.service.create_host(name="Sarah Connor", department="Security")
        walkin = self.service.walkin_checkin(
            visitor_name="Kyle Reese",
            visitor_company="Resistance",
            purpose="Urgent Briefing",
            host_id=host.id
        )
        self.assertEqual(walkin.status, VisitStatus.CHECKED_IN)
        self.assertIsNotNone(walkin.checkin_time)
        self.assertEqual(walkin.visitor_name, "Kyle Reese")
        self.assertEqual(walkin.host_name, "Sarah Connor")

        # Active roll call should include Kyle Reese
        active = self.service.get_active_visitors()
        self.assertEqual(len(active), 1)
        self.assertEqual(active[0].visitor_name, "Kyle Reese")

    def test_visit_cancellation(self):
        visitor = self.service.create_visitor(name="Arthur Dent")
        visit = self.service.create_visit(visitor_id=visitor.id, purpose="Earth Planning Meeting")

        cancelled = self.service.cancel_visit(visit.id, reason="Rescheduled by client")
        self.assertEqual(cancelled.status, VisitStatus.CANCELLED)

        # Cannot check in a cancelled visit
        with self.assertRaises(ValidationError):
            self.service.checkin_visit(visit.id)

    def test_list_visits_with_filters_and_search(self):
        v1 = self.service.create_visitor(name="Peter Parker", company="Daily Bugle")
        v2 = self.service.create_visitor(name="Clark Kent", company="Daily Planet")

        visit1 = self.service.create_visit(visitor_id=v1.id, purpose="Photo journalism")
        visit2 = self.service.create_visit(visitor_id=v2.id, purpose="Editorial interview")

        self.service.checkin_visit(visit1.id)

        # Filter by status CHECKED_IN
        checked_in = self.service.list_visits(status="CHECKED_IN")
        self.assertEqual(len(checked_in), 1)
        self.assertEqual(checked_in[0].visitor_name, "Peter Parker")

        # Filter by status SCHEDULED
        scheduled = self.service.list_visits(status="SCHEDULED")
        self.assertEqual(len(scheduled), 1)
        self.assertEqual(scheduled[0].visitor_name, "Clark Kent")

        # Search query by visitor name
        results = self.service.list_visits(query="Planet")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].visitor_name, "Clark Kent")

    def test_stats_and_csv_export(self):
        visitor = self.service.create_visitor(name="Ada Lovelace", company="Analytical Engine")
        host = self.service.create_host(name="Charles Babbage", department="Mathematics")
        v = self.service.create_visit(visitor_id=visitor.id, host_id=host.id, purpose="Algorithm Review")
        self.service.checkin_visit(v.id)

        stats = self.service.get_stats()
        self.assertEqual(stats["total_visits"], 1)
        self.assertEqual(stats["active_now"], 1)

        # CSV Export
        csv_data = self.service.export_visits_csv()
        self.assertIn("visit_code", csv_data)
        self.assertIn("Ada Lovelace", csv_data)
        self.assertIn("Analytical Engine", csv_data)
        self.assertIn("Algorithm Review", csv_data)

    def test_audit_logs(self):
        visitor = self.service.create_visitor(name="Grace Hopper")
        visit = self.service.create_visit(visitor_id=visitor.id, purpose="Compiler Consultation")
        self.service.checkin_visit(visit.id)
        self.service.checkout_visit(visit.id)

        logs = self.service.get_audit_logs(visit_id=visit.id)
        actions = [log.action for log in logs]
        self.assertIn("VISIT_CREATED", actions)
        self.assertIn("VISIT_CHECKED_IN", actions)
        self.assertIn("VISIT_CHECKED_OUT", actions)


if __name__ == "__main__":
    unittest.main()

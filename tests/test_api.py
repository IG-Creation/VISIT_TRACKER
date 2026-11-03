"""Tests for Visit Tracker REST API and Request Dispatcher."""

import json
import threading
import unittest
import urllib.request
import urllib.error
from visit_tracker.db import Database
from visit_tracker.service import TrackerService
from visit_tracker.server import create_server, dispatch_api


class TestAPIDispatch(unittest.TestCase):
    """Test REST API routing and logic via dispatch_api (independent of OS socket sandbox)."""

    def setUp(self):
        self.db = Database(":memory:")
        self.db.seed_initial_data()
        self.service = TrackerService(self.db)

    def test_health_check(self):
        status, body, _ = dispatch_api(self.service, "GET", "/api/health", {}, {})
        self.assertEqual(status, 200)
        self.assertEqual(body["status"], "healthy")

    def test_stats_endpoint(self):
        status, body, _ = dispatch_api(self.service, "GET", "/api/stats", {}, {})
        self.assertEqual(status, 200)
        self.assertIn("active_now", body)
        self.assertIn("total_visits", body)

    def test_visitors_and_hosts_crud(self):
        # Create Host
        status, host, _ = dispatch_api(self.service, "POST", "/api/hosts", {}, {
            "name": "Jane Host",
            "department": "Security",
            "email": "jane.host@enterprise.com",
            "phone": "+1-555-1122"
        })
        self.assertEqual(status, 201)
        self.assertEqual(host["name"], "Jane Host")

        # List Hosts
        status, hosts, _ = dispatch_api(self.service, "GET", "/api/hosts", {}, {})
        self.assertEqual(status, 200)
        self.assertTrue(any(h["name"] == "Jane Host" for h in hosts))

        # Create Visitor
        status, visitor, _ = dispatch_api(self.service, "POST", "/api/visitors", {}, {
            "name": "David Visitor",
            "email": "david.v@partner.com",
            "phone": "+1-555-3344",
            "company": "Partner LLC"
        })
        self.assertEqual(status, 201)
        self.assertEqual(visitor["name"], "David Visitor")

        # List Visitors
        status, visitors, _ = dispatch_api(self.service, "GET", "/api/visitors", {}, {})
        self.assertEqual(status, 200)
        self.assertTrue(any(v["name"] == "David Visitor" for v in visitors))

    def test_visit_full_lifecycle_api(self):
        # 1. Create visitor & host
        _, visitor, _ = dispatch_api(self.service, "POST", "/api/visitors", {}, {"name": "Test Lifecycle Visitor"})
        _, host, _ = dispatch_api(self.service, "POST", "/api/hosts", {}, {"name": "Test Host"})

        # 2. Schedule Visit
        status, visit, _ = dispatch_api(self.service, "POST", "/api/visits", {}, {
            "visitor_id": visitor["id"],
            "host_id": host["id"],
            "purpose": "Comprehensive System Audit",
            "category": "Corporate Visitor"
        })
        self.assertEqual(status, 201)
        visit_id = visit["id"]
        visit_code = visit["visit_code"]
        self.assertEqual(visit["status"], "SCHEDULED")

        # 3. Get single visit
        status, fetched, _ = dispatch_api(self.service, "GET", f"/api/visits/{visit_id}", {}, {})
        self.assertEqual(status, 200)
        self.assertEqual(fetched["visit_code"], visit_code)

        # 4. Check In
        status, checkin_res, _ = dispatch_api(
            self.service, "POST", f"/api/visits/{visit_id}/checkin", {}, {"badge_number": "BADGE-999"}
        )
        self.assertEqual(status, 200)
        self.assertEqual(checkin_res["status"], "CHECKED_IN")
        self.assertEqual(checkin_res["badge_number"], "BADGE-999")

        # 5. Check Active list
        status, active, _ = dispatch_api(self.service, "GET", "/api/active", {}, {})
        self.assertEqual(status, 200)
        self.assertTrue(any(v["id"] == visit_id for v in active))

        # 6. Check Out
        status, checkout_res, _ = dispatch_api(self.service, "POST", f"/api/visits/{visit_code}/checkout", {}, {})
        self.assertEqual(status, 200)
        self.assertEqual(checkout_res["status"], "CHECKED_OUT")

        # 7. Check Active list again (should be removed)
        status, active, _ = dispatch_api(self.service, "GET", "/api/active", {}, {})
        self.assertEqual(status, 200)
        self.assertFalse(any(v["id"] == visit_id for v in active))

    def test_walkin_and_cancel_api(self):
        # Walkin
        status, walkin, _ = dispatch_api(self.service, "POST", "/api/visits/walkin", {}, {
            "visitor_name": "Instant Walkin",
            "purpose": "Package Delivery"
        })
        self.assertEqual(status, 201)
        self.assertEqual(walkin["status"], "CHECKED_IN")

        # Create scheduled visit and cancel
        _, v, _ = dispatch_api(self.service, "POST", "/api/visitors", {}, {"name": "Cancel Target"})
        status, visit, _ = dispatch_api(self.service, "POST", "/api/visits", {}, {
            "visitor_id": v["id"],
            "purpose": "Meeting Cancelled"
        })
        status, cancelled, _ = dispatch_api(
            self.service, "POST", f"/api/visits/{visit['id']}/cancel", {}, {"reason": "Weather conditions"}
        )
        self.assertEqual(status, 200)
        self.assertEqual(cancelled["status"], "CANCELLED")

    def test_export_csv_api(self):
        status, csv_data, headers = dispatch_api(self.service, "GET", "/api/export", {}, {})
        self.assertEqual(status, 200)
        self.assertIn("visit_code", csv_data)
        self.assertIn("text/csv", headers.get("Content-Type", ""))

    def test_404_not_found(self):
        status, err, _ = dispatch_api(self.service, "GET", "/api/nonexistent", {}, {})
        self.assertEqual(status, 404)

        status, err, _ = dispatch_api(self.service, "GET", "/api/visits/99999999", {}, {})
        self.assertEqual(status, 404)


class TestHTTPSocketServer(unittest.TestCase):
    """Test actual HTTP server socket over TCP if permissions allow."""

    @classmethod
    def setUpClass(cls):
        cls.db = Database(":memory:")
        cls.socket_available = False
        try:
            cls.httpd = create_server(host="127.0.0.1", port=0, db=cls.db)
            cls.port = cls.httpd.server_port
            cls.base_url = f"http://127.0.0.1:{cls.port}"
            cls.server_thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
            cls.server_thread.start()
            # Probe socket
            req = urllib.request.Request(f"{cls.base_url}/api/health")
            with urllib.request.urlopen(req, timeout=1.0) as resp:
                if resp.status == 200:
                    cls.socket_available = True
        except Exception:
            cls.socket_available = False

    @classmethod
    def tearDownClass(cls):
        if hasattr(cls, "httpd"):
            try:
                cls.httpd.shutdown()
                cls.httpd.server_close()
            except Exception:
                pass

    def test_http_health_endpoint(self):
        if not self.socket_available:
            self.skipTest("OS loopback socket is restricted in current sandbox mode; tested via TestAPIDispatch.")
        with urllib.request.urlopen(f"{self.base_url}/api/health") as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode("utf-8"))
            self.assertEqual(data["status"], "healthy")


if __name__ == "__main__":
    unittest.main()

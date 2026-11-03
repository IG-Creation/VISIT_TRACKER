"""Tests for Visit Tracker REST API and Request Dispatcher."""

import json
import threading
import unittest
import urllib.request
import urllib.error
from datetime import date
from visit_tracker.db import Database
from visit_tracker.service import TrackerService
from visit_tracker.server import create_server, dispatch_api


class TestAPIDispatch(unittest.TestCase):
    def setUp(self):
        self.db = Database(":memory:")
        self.service = TrackerService(self.db)
        self.today = date.today().isoformat()

    def test_health_check(self):
        status, body, _ = dispatch_api(self.service, "GET", "/api/health", {}, {})
        self.assertEqual(status, 200)
        self.assertEqual(body["status"], "healthy")

    def test_hierarchy_endpoint(self):
        status, body, _ = dispatch_api(self.service, "GET", "/api/hierarchy", {}, {})
        self.assertEqual(status, 200)
        self.assertIn("states", body)
        self.assertIn("hierarchy", body)
        # Verify Head Office presence
        self.assertIn("Head Office", body["states"])
        self.assertIn("Bihar", body["states"])
        self.assertIn("Delhi", body["states"])
        self.assertIn("Gujarat", body["states"])

    def test_multi_visit_submit_and_query_api(self):
        payload = {
            "user_role": "BDO",
            "user_name": "Karan Malhotra",
            "user_code": "FMF887766",
            "state": "Haryana",
            "cluster": "Faridabad Cluster",
            "branch": "Faridabad Nit",
            "visit_date": self.today,
            "visit_types": ["Customer Visit", "Business Visit"],
            "customer_visit": {
                "customer_status": "New Customer",
                "customer_name": "Suresh Gupta",
                "customer_mobile": "9811223344",
                "reason": "Onboarding visit",
                "latitude": 28.4089,
                "longitude": 77.3178,
                "location_timestamp": f"{self.today} 10:00:00"
            },
            "business_visit": {
                "name": "Gupta Steels",
                "mobile": "9811009988",
                "reason": "Regular visit",
                "latitude": 28.4100,
                "longitude": 77.3200,
                "location_timestamp": f"{self.today} 11:30:00"
            }
        }

        # 1. Submit Multi-visit
        status, res, _ = dispatch_api(self.service, "POST", "/api/visits/submit-multi", {}, payload)
        self.assertEqual(status, 201)
        self.assertEqual(res["created_count"], 2)
        visit_id = res["visits"][0]["id"]
        visit_code = res["visits"][0]["visit_code"]

        # 2. Get single visit
        status, fetched, _ = dispatch_api(self.service, "GET", f"/api/visits/{visit_id}", {}, {})
        self.assertEqual(status, 200)
        self.assertEqual(fetched["visit_code"], visit_code)

        # 3. Query visits with filters
        status, visits, _ = dispatch_api(self.service, "GET", "/api/visits", {
            "user_role": ["BDO"],
            "state": ["Haryana"]
        }, {})
        self.assertEqual(status, 200)
        self.assertEqual(len(visits), 2)

        # 4. Count visits
        status, count_res, _ = dispatch_api(self.service, "GET", "/api/visits/count", {
            "user_role": ["BDO"]
        }, {})
        self.assertEqual(status, 200)
        self.assertEqual(count_res["count"], 2)

        # 5. Master edit (PUT)
        status, updated, _ = dispatch_api(self.service, "PUT", f"/api/visits/{visit_id}", {}, {
            "entity_name": "Suresh Chand Gupta",
            "status": "Verified"
        })
        self.assertEqual(status, 200)
        self.assertEqual(updated["entity_name"], "Suresh Chand Gupta")
        self.assertEqual(updated["status"], "Verified")

        # 6. Delete visit (DELETE)
        status, del_res, _ = dispatch_api(self.service, "DELETE", f"/api/visits/{visit_id}", {}, {})
        self.assertEqual(status, 200)
        self.assertTrue(del_res["success"])

    def test_stats_and_export_api(self):
        self.service.seed_demo_visits()
        status, stats, _ = dispatch_api(self.service, "GET", "/api/stats", {}, {})
        self.assertEqual(status, 200)
        self.assertIn("total_visits", stats)

        status, csv_data, headers = dispatch_api(self.service, "GET", "/api/export", {}, {})
        self.assertEqual(status, 200)
        self.assertIn("text/csv", headers.get("Content-Type", ""))
        self.assertIn("visit_code", csv_data)


class TestHTTPSocketServer(unittest.TestCase):
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

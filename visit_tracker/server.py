"""Multi-threaded HTTP server providing REST API and Web UI for Visit Tracker."""

from __future__ import annotations
import json
import mimetypes
import os
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler, ThreadingHTTPServer
from typing import Optional, Dict, Any, Tuple

from .db import Database
from .models import ValidationError
from .service import TrackerService

WEB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")


def dispatch_api(service: TrackerService, method: str, path: str, params: Dict[str, List[str]], body: Dict[str, Any]) -> Tuple[int, Any, Dict[str, str]]:
    """Dispatch API requests to TrackerService and return (status_code, data_or_csv, extra_headers)."""
    headers = {"Content-Type": "application/json; charset=utf-8"}

    if method == "GET":
        if path == "/api/health":
            return 200, {"status": "healthy", "service": "Visit Tracker", "version": "1.0.0"}, headers
        elif path == "/api/stats":
            return 200, service.get_stats(), headers
        elif path == "/api/visits":
            status = params.get("status", [None])[0]
            query = params.get("query", [None])[0]
            date_val = params.get("date", [None])[0]
            host_id = int(params.get("host_id", [0])[0]) if params.get("host_id") else None
            limit = int(params.get("limit", [100])[0])
            offset = int(params.get("offset", [0])[0])
            visits = service.list_visits(
                status=status, query=query, date_str=date_val,
                host_id=host_id, limit=limit, offset=offset
            )
            return 200, [v.to_dict() for v in visits], headers
        elif path.startswith("/api/visits/") and not path.endswith(("/checkin", "/checkout", "/cancel")):
            ident = path.split("/")[3]
            visit = service.get_visit(ident)
            if not visit:
                return 404, {"error": f"Visit '{ident}' not found"}, headers
            return 200, visit.to_dict(), headers
        elif path == "/api/active":
            active = service.get_active_visitors()
            return 200, [v.to_dict() for v in active], headers
        elif path == "/api/visitors":
            query = params.get("query", [None])[0]
            visitors = service.search_visitors(query) if query else service.list_visitors()
            return 200, [v.to_dict() for v in visitors], headers
        elif path == "/api/hosts":
            hosts = service.list_hosts()
            return 200, [h.to_dict() for h in hosts], headers
        elif path == "/api/locations":
            locs = service.list_locations()
            return 200, [l.to_dict() for l in locs], headers
        elif path == "/api/audit":
            visit_id = int(params.get("visit_id", [0])[0]) if params.get("visit_id") else None
            logs = service.get_audit_logs(visit_id=visit_id)
            return 200, [l.to_dict() for l in logs], headers
        elif path == "/api/export":
            status = params.get("status", [None])[0]
            csv_data = service.export_visits_csv(status=status)
            return 200, csv_data, {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": 'attachment; filename="visits_export.csv"'
            }
        else:
            return 404, {"error": f"Endpoint not found: {path}"}, headers

    elif method == "POST":
        if path == "/api/visits":
            v = service.create_visit(
                visitor_id=body["visitor_id"],
                purpose=body["purpose"],
                host_id=body.get("host_id"),
                location_id=body.get("location_id"),
                category=body.get("category", "Corporate Visitor"),
                badge_number=body.get("badge_number"),
                expected_checkin=body.get("expected_checkin"),
                notes=body.get("notes"),
            )
            return 201, v.to_dict(), headers
        elif path == "/api/visits/walkin":
            v = service.walkin_checkin(
                visitor_name=body["visitor_name"],
                purpose=body["purpose"],
                visitor_email=body.get("visitor_email"),
                visitor_phone=body.get("visitor_phone"),
                visitor_company=body.get("visitor_company"),
                id_type=body.get("id_type", "National ID"),
                id_number=body.get("id_number"),
                host_id=body.get("host_id"),
                location_id=body.get("location_id"),
                category=body.get("category", "Corporate Visitor"),
                notes=body.get("notes"),
            )
            return 201, v.to_dict(), headers
        elif path.startswith("/api/visits/") and path.endswith("/checkin"):
            ident = path.split("/")[3]
            v = service.checkin_visit(ident, badge_number=body.get("badge_number"))
            return 200, v.to_dict(), headers
        elif path.startswith("/api/visits/") and path.endswith("/checkout"):
            ident = path.split("/")[3]
            v = service.checkout_visit(ident)
            return 200, v.to_dict(), headers
        elif path.startswith("/api/visits/") and path.endswith("/cancel"):
            ident = path.split("/")[3]
            v = service.cancel_visit(ident, reason=body.get("reason", ""))
            return 200, v.to_dict(), headers
        elif path == "/api/visitors":
            visitor = service.create_visitor(
                name=body["name"],
                email=body.get("email"),
                phone=body.get("phone"),
                company=body.get("company"),
                id_type=body.get("id_type", "National ID"),
                id_number=body.get("id_number"),
            )
            return 201, visitor.to_dict(), headers
        elif path == "/api/hosts":
            host = service.create_host(
                name=body["name"],
                email=body.get("email"),
                department=body.get("department"),
                phone=body.get("phone"),
            )
            return 201, host.to_dict(), headers
        elif path == "/api/locations":
            loc = service.create_location(
                name=body["name"],
                building=body.get("building"),
                floor=body.get("floor"),
            )
            return 201, loc.to_dict(), headers
        else:
            return 404, {"error": f"Endpoint not found: {path}"}, headers

    return 405, {"error": f"Method {method} not allowed"}, headers


class TrackerRequestHandler(SimpleHTTPRequestHandler):
    """Handles static files and REST API routes for Visit Tracker."""

    service: TrackerService

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def _send_payload(self, status: int, data: Any, extra_headers: Optional[Dict[str, str]] = None) -> None:
        if isinstance(data, str) and extra_headers and "text/csv" in extra_headers.get("Content-Type", ""):
            payload = data.encode("utf-8")
        else:
            payload = json.dumps(data, indent=2, default=str).encode("utf-8")

        self.send_response(status)
        if extra_headers:
            for k, val in extra_headers.items():
                self.send_header(k, val)
        else:
            self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.end_headers()
        self.wfile.write(payload)

    def _parse_body(self) -> Dict[str, Any]:
        content_len = int(self.headers.get("Content-Length", 0))
        if content_len == 0:
            return {}
        raw = self.rfile.read(content_len).decode("utf-8")
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            raise ValidationError("Invalid JSON body")

    def do_OPTIONS(self):
        """Respond to CORS preflight requests."""
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        if not path.startswith("/api"):
            if path in ("", "/"):
                self.path = "/index.html"
            return super().do_GET()

        try:
            status, data, extra_headers = dispatch_api(self.service, "GET", path, params, {})
            self._send_payload(status, data, extra_headers)
        except ValidationError as e:
            self._send_payload(400, {"error": str(e)})
        except Exception as e:
            self._send_payload(500, {"error": f"Internal server error: {str(e)}"})

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        if not path.startswith("/api"):
            self._send_payload(405, {"error": "POST only supported on API endpoints"})
            return

        try:
            body = self._parse_body()
            status, data, extra_headers = dispatch_api(self.service, "POST", path, params, body)
            self._send_payload(status, data, extra_headers)
        except ValidationError as e:
            self._send_payload(400, {"error": str(e)})
        except KeyError as e:
            self._send_payload(400, {"error": f"Missing required parameter: {str(e)}"})
        except Exception as e:
            self._send_payload(500, {"error": f"Internal server error: {str(e)}"})


def create_server(host: str = "127.0.0.1", port: int = 8080, db: Optional[Database] = None) -> ThreadingHTTPServer:
    """Create and configure the ThreadingHTTPServer instance."""
    database = db or Database()
    database.seed_initial_data()
    service = TrackerService(database)

    # Attach service to request handler
    TrackerRequestHandler.service = service

    server = ThreadingHTTPServer((host, port), TrackerRequestHandler)
    return server


def run_server(host: str = "127.0.0.1", port: int = 8080, db: Optional[Database] = None) -> None:
    """Run the Visit Tracker server until interrupted."""
    server = create_server(host=host, port=port, db=db)
    print(f"==================================================")
    print(f"  VISIT TRACKER SERVER RUNNING")
    print(f"  Web Dashboard: http://{host}:{port}")
    print(f"  REST API:      http://{host}:{port}/api/health")
    print(f"==================================================")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Visit Tracker server...")
    finally:
        server.server_close()

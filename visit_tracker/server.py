"""Multi-threaded HTTP server providing REST API and Web UI for Visit Tracker."""

from __future__ import annotations
import json
import os
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from typing import Optional, Dict, Any, Tuple, List

from .db import Database
from .models import ValidationError
from .service import TrackerService
from .branches_data import get_hierarchy

WEB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")


def dispatch_api(
    service: TrackerService,
    method: str,
    path: str,
    params: Dict[str, List[str]],
    body: Dict[str, Any]
) -> Tuple[int, Any, Dict[str, str]]:
    """Dispatch API requests to TrackerService and return (status_code, data_or_csv, extra_headers)."""
    headers = {"Content-Type": "application/json; charset=utf-8"}

    if method == "GET":
        if path == "/api/health":
            return 200, {"status": "healthy", "service": "Visit Tracker", "version": "2.0.0"}, headers

        elif path == "/api/hierarchy":
            hierarchy_data = get_hierarchy()
            return 200, hierarchy_data, headers

        elif path == "/api/stats":
            return 200, service.get_stats(), headers

        elif path == "/api/visits/count":
            from_date = params.get("from_date", [None])[0]
            to_date = params.get("to_date", [None])[0]
            role = params.get("user_role", [None])[0]
            state = params.get("state", [None])[0]
            cluster = params.get("cluster", [None])[0]
            branch = params.get("branch", [None])[0]
            vtype = params.get("visit_type", [None])[0]
            query = params.get("query", [None])[0]

            count = service.count_visits(
                from_date=from_date, to_date=to_date, user_role=role,
                state=state, cluster=cluster, branch=branch,
                visit_type=vtype, search_query=query
            )
            return 200, {"count": count}, headers

        elif path == "/api/visits":
            from_date = params.get("from_date", [None])[0]
            to_date = params.get("to_date", [None])[0]
            role = params.get("user_role", [None])[0]
            state = params.get("state", [None])[0]
            cluster = params.get("cluster", [None])[0]
            branch = params.get("branch", [None])[0]
            vtype = params.get("visit_type", [None])[0]
            query = params.get("query", [None])[0]
            limit = int(params.get("limit", [1000])[0])
            offset = int(params.get("offset", [0])[0])

            visits = service.list_visits(
                from_date=from_date, to_date=to_date, user_role=role,
                state=state, cluster=cluster, branch=branch,
                visit_type=vtype, search_query=query, limit=limit, offset=offset
            )
            return 200, [v.to_dict() for v in visits], headers

        elif path.startswith("/api/visits/") and len(path.split("/")) == 4:
            ident = path.split("/")[3]
            visit = service.get_visit(ident)
            if not visit:
                return 404, {"error": f"Visit '{ident}' not found"}, headers
            return 200, visit.to_dict(), headers

        elif path == "/api/export":
            from_date = params.get("from_date", [None])[0]
            to_date = params.get("to_date", [None])[0]
            role = params.get("user_role", [None])[0]
            state = params.get("state", [None])[0]
            cluster = params.get("cluster", [None])[0]
            branch = params.get("branch", [None])[0]
            vtype = params.get("visit_type", [None])[0]
            query = params.get("query", [None])[0]
            fmt = params.get("format", ["csv"])[0].lower()

            if fmt in ("excel", "xlsx", "xls"):
                excel_data = service.export_visits_excel(
                    from_date=from_date, to_date=to_date, user_role=role,
                    state=state, cluster=cluster, branch=branch,
                    visit_type=vtype, search_query=query
                )
                return 200, excel_data, {
                    "Content-Type": "application/vnd.ms-excel; charset=utf-8",
                    "Content-Disposition": 'attachment; filename="visit_tracker_export.xls"'
                }
            else:
                csv_data = service.export_visits_csv(
                    from_date=from_date, to_date=to_date, user_role=role,
                    state=state, cluster=cluster, branch=branch,
                    visit_type=vtype, search_query=query
                )
                return 200, csv_data, {
                    "Content-Type": "text/csv; charset=utf-8",
                    "Content-Disposition": 'attachment; filename="visit_tracker_export.csv"'
                }

        else:
            return 404, {"error": f"Endpoint not found: {path}"}, headers

    elif method == "POST":
        if path == "/api/visits/submit-multi":
            created = service.submit_multi_visits(body)
            return 201, {"success": True, "created_count": len(created), "visits": [v.to_dict() for v in created]}, headers

        elif path == "/api/send-email":
            recipients = body.get("recipients", [])
            subject = body.get("subject")
            custom_note = body.get("custom_note")
            from_date = body.get("from_date")
            to_date = body.get("to_date")
            role = body.get("user_role")
            state = body.get("state")
            cluster = body.get("cluster")
            branch = body.get("branch")
            vtype = body.get("visit_type")
            query = body.get("query")

            result = service.send_email_report(
                recipients=recipients,
                from_date=from_date,
                to_date=to_date,
                user_role=role,
                state=state,
                cluster=cluster,
                branch=branch,
                visit_type=vtype,
                search_query=query,
                subject=subject,
                custom_note=custom_note
            )
            return 200, result, headers

        elif path == "/api/seed":
            service.seed_demo_visits()
            return 200, {"success": True, "message": "Demo data populated"}, headers

        else:
            return 404, {"error": f"Endpoint not found: {path}"}, headers

    elif method == "PUT":
        if path.startswith("/api/visits/") and len(path.split("/")) == 4:
            ident = path.split("/")[3]
            updated = service.update_visit(ident, body)
            return 200, updated.to_dict(), headers
        return 404, {"error": f"Endpoint not found: {path}"}, headers

    elif method == "DELETE":
        if path.startswith("/api/visits/") and len(path.split("/")) == 4:
            ident = path.split("/")[3]
            success = service.delete_visit(ident)
            if success:
                return 200, {"success": True, "deleted": ident}, headers
            return 404, {"error": f"Visit '{ident}' not found"}, headers
        return 404, {"error": f"Endpoint not found: {path}"}, headers

    return 405, {"error": f"Method {method} not allowed"}, headers


class TrackerRequestHandler(SimpleHTTPRequestHandler):
    """Handles static files and REST API routes for Visit Tracker."""

    service: TrackerService

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def _send_payload(self, status: int, data: Any, extra_headers: Optional[Dict[str, str]] = None) -> None:
        if isinstance(data, str) and extra_headers and ("text/csv" in extra_headers.get("Content-Type", "") or "application/vnd.ms-excel" in extra_headers.get("Content-Type", "")):
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

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        try:
            body = self._parse_body()
            status, data, extra_headers = dispatch_api(self.service, "PUT", path, params, body)
            self._send_payload(status, data, extra_headers)
        except ValidationError as e:
            self._send_payload(400, {"error": str(e)})
        except Exception as e:
            self._send_payload(500, {"error": f"Internal server error: {str(e)}"})

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        try:
            status, data, extra_headers = dispatch_api(self.service, "DELETE", path, params, {})
            self._send_payload(status, data, extra_headers)
        except ValidationError as e:
            self._send_payload(400, {"error": str(e)})
        except Exception as e:
            self._send_payload(500, {"error": f"Internal server error: {str(e)}"})


def create_server(host: str = "127.0.0.1", port: int = 8080, db: Optional[Database] = None) -> ThreadingHTTPServer:
    """Create and configure ThreadingHTTPServer instance."""
    database = db or Database()
    service = TrackerService(database)
    service.seed_demo_visits()

    TrackerRequestHandler.service = service
    server = ThreadingHTTPServer((host, port), TrackerRequestHandler)
    return server


def run_server(host: str = "127.0.0.1", port: int = 8080, db: Optional[Database] = None) -> None:
    """Run server until interrupted."""
    server = create_server(host=host, port=port, db=db)
    print("==================================================")
    print("  VISIT TRACKER SERVER RUNNING")
    print(f"  Field Form & Dashboard: http://{host}:{port}")
    print(f"  REST API:               http://{host}:{port}/api/health")
    print("==================================================")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Visit Tracker server...")
    finally:
        server.server_close()

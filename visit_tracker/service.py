"""Business logic service layer for Visit Tracker."""

from __future__ import annotations
import csv
import io
import uuid
from datetime import datetime, date
from typing import Optional, List, Dict, Any

from .db import Database
from .models import (
    Visitor, Host, Location, Visit, AuditLog,
    VisitStatus, ValidationError, validate_required_string
)


class TrackerService:
    """Service providing core operations for visitors, hosts, locations, and visits."""

    def __init__(self, db: Database):
        self.db = db

    # ==================== HELPERS ====================

    @staticmethod
    def _now_iso() -> str:
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    @staticmethod
    def _today_str() -> str:
        return date.today().isoformat()

    @staticmethod
    def _generate_visit_code() -> str:
        timestamp_part = datetime.now().strftime("%y%m%d")
        unique_suffix = uuid.uuid4().hex[:5].upper()
        return f"VT-{timestamp_part}-{unique_suffix}"

    @staticmethod
    def _generate_visitor_id() -> str:
        return f"VIS-{uuid.uuid4().hex[:6].upper()}"

    def _log_audit(self, conn, action: str, visit_id: Optional[int] = None, details: Optional[str] = None):
        conn.execute(
            "INSERT INTO audit_logs (visit_id, action, details, timestamp) VALUES (?, ?, ?, ?)",
            (visit_id, action, details, self._now_iso())
        )

    # ==================== VISITORS ====================

    def create_visitor(
        self,
        name: str,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        company: Optional[str] = None,
        id_type: Optional[str] = "National ID",
        id_number: Optional[str] = None,
    ) -> Visitor:
        visitor = Visitor(
            name=name,
            email=email,
            phone=phone,
            company=company,
            id_type=id_type,
            id_number=id_number,
            visitor_id=self._generate_visitor_id(),
            created_at=self._now_iso()
        )
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO visitors (visitor_id, name, email, phone, company, id_type, id_number, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    visitor.visitor_id, visitor.name, visitor.email,
                    visitor.phone, visitor.company, visitor.id_type,
                    visitor.id_number, visitor.created_at
                )
            )
            visitor.id = cursor.lastrowid
        return visitor

    def get_visitor(self, visitor_id: int) -> Optional[Visitor]:
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM visitors WHERE id = ? OR visitor_id = ?", (visitor_id, str(visitor_id)))
            row = cursor.fetchone()
            if not row:
                return None
            return Visitor(
                id=row["id"],
                visitor_id=row["visitor_id"],
                name=row["name"],
                email=row["email"],
                phone=row["phone"],
                company=row["company"],
                id_type=row["id_type"],
                id_number=row["id_number"],
                created_at=row["created_at"],
            )

    def search_visitors(self, query: str) -> List[Visitor]:
        q = f"%{query.strip()}%"
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT * FROM visitors
                WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ? OR visitor_id LIKE ?
                ORDER BY id DESC LIMIT 50
                """,
                (q, q, q, q, q)
            )
            rows = cursor.fetchall()
            return [
                Visitor(
                    id=r["id"],
                    visitor_id=r["visitor_id"],
                    name=r["name"],
                    email=r["email"],
                    phone=r["phone"],
                    company=r["company"],
                    id_type=r["id_type"],
                    id_number=r["id_number"],
                    created_at=r["created_at"],
                )
                for r in rows
            ]

    def list_visitors(self, limit: int = 100) -> List[Visitor]:
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM visitors ORDER BY id DESC LIMIT ?", (limit,))
            rows = cursor.fetchall()
            return [
                Visitor(
                    id=r["id"],
                    visitor_id=r["visitor_id"],
                    name=r["name"],
                    email=r["email"],
                    phone=r["phone"],
                    company=r["company"],
                    id_type=r["id_type"],
                    id_number=r["id_number"],
                    created_at=r["created_at"],
                )
                for r in rows
            ]

    # ==================== HOSTS ====================

    def create_host(
        self,
        name: str,
        email: Optional[str] = None,
        department: Optional[str] = None,
        phone: Optional[str] = None,
        active: bool = True
    ) -> Host:
        host = Host(
            name=name,
            email=email,
            department=department,
            phone=phone,
            active=active,
            created_at=self._now_iso()
        )
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO hosts (name, email, department, phone, active, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (host.name, host.email, host.department, host.phone, 1 if host.active else 0, host.created_at)
            )
            host.id = cursor.lastrowid
        return host

    def get_host(self, host_id: int) -> Optional[Host]:
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM hosts WHERE id = ?", (host_id,))
            row = cursor.fetchone()
            if not row:
                return None
            return Host(
                id=row["id"],
                name=row["name"],
                email=row["email"],
                department=row["department"],
                phone=row["phone"],
                active=bool(row["active"]),
                created_at=row["created_at"]
            )

    def list_hosts(self, active_only: bool = True) -> List[Host]:
        with self.db.connect() as conn:
            cursor = conn.cursor()
            if active_only:
                cursor.execute("SELECT * FROM hosts WHERE active = 1 ORDER BY name ASC")
            else:
                cursor.execute("SELECT * FROM hosts ORDER BY name ASC")
            rows = cursor.fetchall()
            return [
                Host(
                    id=r["id"],
                    name=r["name"],
                    email=r["email"],
                    department=r["department"],
                    phone=r["phone"],
                    active=bool(r["active"]),
                    created_at=r["created_at"]
                )
                for r in rows
            ]

    # ==================== LOCATIONS ====================

    def create_location(self, name: str, building: Optional[str] = None, floor: Optional[str] = None) -> Location:
        location = Location(
            name=name,
            building=building,
            floor=floor,
            created_at=self._now_iso()
        )
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO locations (name, building, floor, created_at) VALUES (?, ?, ?, ?)",
                (location.name, location.building, location.floor, location.created_at)
            )
            location.id = cursor.lastrowid
        return location

    def list_locations(self) -> List[Location]:
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM locations ORDER BY name ASC")
            rows = cursor.fetchall()
            return [
                Location(
                    id=r["id"],
                    name=r["name"],
                    building=r["building"],
                    floor=r["floor"],
                    created_at=r["created_at"]
                )
                for r in rows
            ]

    # ==================== VISITS ====================

    def _row_to_visit(self, r: sqlite3.Row) -> Visit:
        keys = r.keys()
        return Visit(
            id=r["id"],
            visit_code=r["visit_code"],
            visitor_id=r["visitor_id"],
            host_id=r["host_id"],
            location_id=r["location_id"],
            purpose=r["purpose"],
            category=r["category"],
            badge_number=r["badge_number"],
            status=VisitStatus(r["status"]),
            expected_checkin=r["expected_checkin"],
            checkin_time=r["checkin_time"],
            checkout_time=r["checkout_time"],
            notes=r["notes"],
            created_at=r["created_at"],
            updated_at=r["updated_at"],
            visitor_name=r["visitor_name"] if "visitor_name" in keys else None,
            visitor_company=r["visitor_company"] if "visitor_company" in keys else None,
            visitor_email=r["visitor_email"] if "visitor_email" in keys else None,
            visitor_phone=r["visitor_phone"] if "visitor_phone" in keys else None,
            host_name=r["host_name"] if "host_name" in keys else None,
            host_department=r["host_department"] if "host_department" in keys else None,
            location_name=r["location_name"] if "location_name" in keys else None,
        )

    def create_visit(
        self,
        visitor_id: int,
        purpose: str,
        host_id: Optional[int] = None,
        location_id: Optional[int] = None,
        category: str = "Corporate Visitor",
        badge_number: Optional[str] = None,
        expected_checkin: Optional[str] = None,
        notes: Optional[str] = None,
    ) -> Visit:
        purpose = validate_required_string(purpose, "visit.purpose")
        now = self._now_iso()
        visit_code = self._generate_visit_code()
        badge = badge_number or f"B-{uuid.uuid4().hex[:4].upper()}"

        with self.db.connect() as conn:
            # Verify visitor exists
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM visitors WHERE id = ?", (visitor_id,))
            if not cursor.fetchone():
                raise ValidationError(f"Visitor with id {visitor_id} does not exist.")

            # If host_id is provided, verify host exists
            if host_id:
                cursor.execute("SELECT id FROM hosts WHERE id = ?", (host_id,))
                if not cursor.fetchone():
                    raise ValidationError(f"Host with id {host_id} does not exist.")

            cursor.execute(
                """
                INSERT INTO visits (
                    visit_code, visitor_id, host_id, location_id,
                    purpose, category, badge_number, status,
                    expected_checkin, notes, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    visit_code, visitor_id, host_id, location_id,
                    purpose, category, badge, VisitStatus.SCHEDULED.value,
                    expected_checkin or now, notes, now, now
                )
            )
            visit_id = cursor.lastrowid
            self._log_audit(conn, "VISIT_CREATED", visit_id, f"Visit created with code {visit_code}")

        return self.get_visit(visit_id)  # type: ignore

    def walkin_checkin(
        self,
        visitor_name: str,
        purpose: str,
        visitor_email: Optional[str] = None,
        visitor_phone: Optional[str] = None,
        visitor_company: Optional[str] = None,
        id_type: Optional[str] = "National ID",
        id_number: Optional[str] = None,
        host_id: Optional[int] = None,
        location_id: Optional[int] = None,
        category: str = "Corporate Visitor",
        notes: Optional[str] = None
    ) -> Visit:
        """Create visitor (or reuse by email/phone) and perform immediate check-in."""
        with self.db.connect() as conn:
            cursor = conn.cursor()
            existing_id = None
            if visitor_email:
                cursor.execute("SELECT id FROM visitors WHERE email = ?", (visitor_email.lower().strip(),))
                row = cursor.fetchone()
                if row:
                    existing_id = row["id"]
            if not existing_id and visitor_phone:
                cursor.execute("SELECT id FROM visitors WHERE phone = ?", (visitor_phone.strip(),))
                row = cursor.fetchone()
                if row:
                    existing_id = row["id"]

        if existing_id:
            visitor_id = existing_id
        else:
            visitor = self.create_visitor(
                name=visitor_name,
                email=visitor_email,
                phone=visitor_phone,
                company=visitor_company,
                id_type=id_type,
                id_number=id_number
            )
            visitor_id = visitor.id

        visit = self.create_visit(
            visitor_id=visitor_id,
            purpose=purpose,
            host_id=host_id,
            location_id=location_id,
            category=category,
            notes=notes
        )
        return self.checkin_visit(visit.id)

    def checkin_visit(self, identifier: int | str, badge_number: Optional[str] = None) -> Visit:
        """Check in a visitor. Identifier can be visit id (int) or visit_code (str)."""
        now = self._now_iso()
        with self.db.connect() as conn:
            cursor = conn.cursor()
            if isinstance(identifier, int) or (isinstance(identifier, str) and identifier.isdigit()):
                cursor.execute("SELECT * FROM visits WHERE id = ?", (int(identifier),))
            else:
                cursor.execute("SELECT * FROM visits WHERE visit_code = ?", (str(identifier),))
            row = cursor.fetchone()
            if not row:
                raise ValidationError(f"Visit not found for identifier: {identifier}")

            current_status = row["status"]
            visit_id = row["id"]

            if current_status == VisitStatus.CHECKED_IN.value:
                raise ValidationError(f"Visit {row['visit_code']} is already checked in.")
            if current_status == VisitStatus.CHECKED_OUT.value:
                raise ValidationError(f"Visit {row['visit_code']} is already completed and checked out.")
            if current_status == VisitStatus.CANCELLED.value:
                raise ValidationError(f"Visit {row['visit_code']} has been cancelled and cannot be checked in.")

            badge = badge_number or row["badge_number"] or f"B-{uuid.uuid4().hex[:4].upper()}"

            cursor.execute(
                """
                UPDATE visits
                SET status = ?, checkin_time = ?, badge_number = ?, updated_at = ?
                WHERE id = ?
                """,
                (VisitStatus.CHECKED_IN.value, now, badge, now, visit_id)
            )
            self._log_audit(conn, "VISIT_CHECKED_IN", visit_id, f"Checked in with badge {badge}")

        return self.get_visit(visit_id)  # type: ignore

    def checkout_visit(self, identifier: int | str) -> Visit:
        """Check out a visitor."""
        now = self._now_iso()
        with self.db.connect() as conn:
            cursor = conn.cursor()
            if isinstance(identifier, int) or (isinstance(identifier, str) and identifier.isdigit()):
                cursor.execute("SELECT * FROM visits WHERE id = ?", (int(identifier),))
            else:
                cursor.execute("SELECT * FROM visits WHERE visit_code = ?", (str(identifier),))
            row = cursor.fetchone()
            if not row:
                raise ValidationError(f"Visit not found for identifier: {identifier}")

            current_status = row["status"]
            visit_id = row["id"]

            if current_status == VisitStatus.CHECKED_OUT.value:
                raise ValidationError(f"Visit {row['visit_code']} is already checked out.")
            if current_status == VisitStatus.SCHEDULED.value:
                raise ValidationError(f"Visit {row['visit_code']} has not been checked in yet.")
            if current_status == VisitStatus.CANCELLED.value:
                raise ValidationError(f"Visit {row['visit_code']} is cancelled.")

            cursor.execute(
                """
                UPDATE visits
                SET status = ?, checkout_time = ?, updated_at = ?
                WHERE id = ?
                """,
                (VisitStatus.CHECKED_OUT.value, now, now, visit_id)
            )
            self._log_audit(conn, "VISIT_CHECKED_OUT", visit_id, "Visitor checked out")

        return self.get_visit(visit_id)  # type: ignore

    def cancel_visit(self, identifier: int | str, reason: str = "") -> Visit:
        """Cancel a scheduled visit."""
        now = self._now_iso()
        with self.db.connect() as conn:
            cursor = conn.cursor()
            if isinstance(identifier, int) or (isinstance(identifier, str) and identifier.isdigit()):
                cursor.execute("SELECT * FROM visits WHERE id = ?", (int(identifier),))
            else:
                cursor.execute("SELECT * FROM visits WHERE visit_code = ?", (str(identifier),))
            row = cursor.fetchone()
            if not row:
                raise ValidationError(f"Visit not found for identifier: {identifier}")

            current_status = row["status"]
            visit_id = row["id"]

            if current_status == VisitStatus.CHECKED_OUT.value:
                raise ValidationError(f"Completed visit {row['visit_code']} cannot be cancelled.")
            if current_status == VisitStatus.CANCELLED.value:
                return self.get_visit(visit_id)  # type: ignore

            cursor.execute(
                """
                UPDATE visits
                SET status = ?, notes = coalesce(notes || ' | Cancellation reason: ' || ?, ?), updated_at = ?
                WHERE id = ?
                """,
                (VisitStatus.CANCELLED.value, reason, f"Cancelled: {reason}", now, visit_id)
            )
            self._log_audit(conn, "VISIT_CANCELLED", visit_id, f"Visit cancelled. Reason: {reason}")

        return self.get_visit(visit_id)  # type: ignore

    def get_visit(self, identifier: int | str) -> Optional[Visit]:
        query = """
            SELECT
                v.*,
                vis.name AS visitor_name,
                vis.company AS visitor_company,
                vis.email AS visitor_email,
                vis.phone AS visitor_phone,
                h.name AS host_name,
                h.department AS host_department,
                l.name AS location_name
            FROM visits v
            JOIN visitors vis ON v.visitor_id = vis.id
            LEFT JOIN hosts h ON v.host_id = h.id
            LEFT JOIN locations l ON v.location_id = l.id
            WHERE
        """
        with self.db.connect() as conn:
            cursor = conn.cursor()
            if isinstance(identifier, int) or (isinstance(identifier, str) and identifier.isdigit()):
                cursor.execute(query + " v.id = ?", (int(identifier),))
            else:
                cursor.execute(query + " v.visit_code = ?", (str(identifier),))
            row = cursor.fetchone()
            if not row:
                return None
            return self._row_to_visit(row)

    def list_visits(
        self,
        status: Optional[str] = None,
        date_str: Optional[str] = None,
        host_id: Optional[int] = None,
        query: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Visit]:
        sql = """
            SELECT
                v.*,
                vis.name AS visitor_name,
                vis.company AS visitor_company,
                vis.email AS visitor_email,
                vis.phone AS visitor_phone,
                h.name AS host_name,
                h.department AS host_department,
                l.name AS location_name
            FROM visits v
            JOIN visitors vis ON v.visitor_id = vis.id
            LEFT JOIN hosts h ON v.host_id = h.id
            LEFT JOIN locations l ON v.location_id = l.id
            WHERE 1=1
        """
        params: List[Any] = []

        if status:
            sql += " AND v.status = ?"
            params.append(status.upper())

        if date_str:
            sql += " AND (date(v.checkin_time) = date(?) OR date(v.expected_checkin) = date(?) OR date(v.created_at) = date(?))"
            params.extend([date_str, date_str, date_str])

        if host_id:
            sql += " AND v.host_id = ?"
            params.append(host_id)

        if query:
            q = f"%{query.strip()}%"
            sql += """ AND (
                v.visit_code LIKE ? OR
                vis.name LIKE ? OR
                vis.company LIKE ? OR
                vis.email LIKE ? OR
                vis.phone LIKE ? OR
                h.name LIKE ? OR
                v.purpose LIKE ? OR
                v.badge_number LIKE ?
            )"""
            params.extend([q, q, q, q, q, q, q, q])

        sql += " ORDER BY v.id DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            rows = cursor.fetchall()
            return [self._row_to_visit(r) for r in rows]

    def get_active_visitors(self) -> List[Visit]:
        """Emergency roll call: all visitors currently checked in and on site."""
        sql = """
            SELECT
                v.*,
                vis.name AS visitor_name,
                vis.company AS visitor_company,
                vis.email AS visitor_email,
                vis.phone AS visitor_phone,
                h.name AS host_name,
                h.department AS host_department,
                l.name AS location_name
            FROM visits v
            JOIN visitors vis ON v.visitor_id = vis.id
            LEFT JOIN hosts h ON v.host_id = h.id
            LEFT JOIN locations l ON v.location_id = l.id
            WHERE v.status = 'CHECKED_IN'
            ORDER BY v.checkin_time ASC
        """
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute(sql)
            return [self._row_to_visit(r) for r in cursor.fetchall()]

    def get_stats(self) -> Dict[str, Any]:
        today = self._today_str()
        with self.db.connect() as conn:
            cursor = conn.cursor()

            # Total visits
            cursor.execute("SELECT COUNT(*) FROM visits")
            total_visits = cursor.fetchone()[0]

            # Active now
            cursor.execute("SELECT COUNT(*) FROM visits WHERE status = 'CHECKED_IN'")
            active_now = cursor.fetchone()[0]

            # Today total
            cursor.execute(
                """
                SELECT COUNT(*) FROM visits
                WHERE date(checkin_time) = date(?) OR date(expected_checkin) = date(?) OR date(created_at) = date(?)
                """,
                (today, today, today)
            )
            today_total = cursor.fetchone()[0]

            # Today checkins
            cursor.execute("SELECT COUNT(*) FROM visits WHERE date(checkin_time) = date(?)", (today,))
            today_checkins = cursor.fetchone()[0]

            # Today checkouts
            cursor.execute("SELECT COUNT(*) FROM visits WHERE date(checkout_time) = date(?)", (today,))
            today_checkouts = cursor.fetchone()[0]

            # Today scheduled
            cursor.execute("SELECT COUNT(*) FROM visits WHERE status = 'SCHEDULED' AND date(expected_checkin) = date(?)", (today,))
            today_scheduled = cursor.fetchone()[0]

            # By category
            cursor.execute("SELECT category, COUNT(*) as count FROM visits GROUP BY category")
            by_category = {r["category"]: r["count"] for r in cursor.fetchall()}

            # By department
            cursor.execute(
                """
                SELECT coalesce(h.department, 'Unassigned') as dept, COUNT(*) as count
                FROM visits v
                LEFT JOIN hosts h ON v.host_id = h.id
                GROUP BY dept
                """
            )
            by_department = {r["dept"]: r["count"] for r in cursor.fetchall()}

            # Average visit duration in minutes (completed visits)
            cursor.execute(
                """
                SELECT checkin_time, checkout_time FROM visits
                WHERE status = 'CHECKED_OUT' AND checkin_time IS NOT NULL AND checkout_time IS NOT NULL
                """
            )
            completed = cursor.fetchall()
            durations = []
            for r in completed:
                try:
                    t_in = datetime.fromisoformat(r["checkin_time"])
                    t_out = datetime.fromisoformat(r["checkout_time"])
                    diff = (t_out - t_in).total_seconds() / 60.0
                    if diff >= 0:
                        durations.append(diff)
                except Exception:
                    pass
            avg_duration_min = round(sum(durations) / len(durations), 1) if durations else 0

        return {
            "total_visits": total_visits,
            "active_now": active_now,
            "today_total": today_total,
            "today_checkins": today_checkins,
            "today_checkouts": today_checkouts,
            "today_scheduled": today_scheduled,
            "by_category": by_category,
            "by_department": by_department,
            "avg_duration_minutes": avg_duration_min,
            "date": today,
        }

    def export_visits_csv(self, status: Optional[str] = None) -> str:
        """Export visits to standard CSV string."""
        visits = self.list_visits(status=status, limit=10000)
        output = io.StringIO()
        fieldnames = [
            "visit_code", "status", "visitor_name", "visitor_company",
            "visitor_email", "visitor_phone", "host_name", "host_department",
            "location_name", "purpose", "category", "badge_number",
            "expected_checkin", "checkin_time", "checkout_time", "notes"
        ]
        writer = csv.DictWriter(output, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        for v in visits:
            d = v.to_dict()
            row = {k: d.get(k, "") or "" for k in fieldnames}
            writer.writerow(row)
        return output.getvalue()

    def get_audit_logs(self, visit_id: Optional[int] = None, limit: int = 50) -> List[AuditLog]:
        with self.db.connect() as conn:
            cursor = conn.cursor()
            if visit_id:
                cursor.execute(
                    "SELECT * FROM audit_logs WHERE visit_id = ? ORDER BY id DESC LIMIT ?",
                    (visit_id, limit)
                )
            else:
                cursor.execute(
                    "SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?",
                    (limit,)
                )
            rows = cursor.fetchall()
            return [
                AuditLog(
                    id=r["id"],
                    visit_id=r["visit_id"],
                    action=r["action"],
                    details=r["details"],
                    timestamp=r["timestamp"]
                )
                for r in rows
            ]

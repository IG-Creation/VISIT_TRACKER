"""Business logic service layer for Visit Tracker with multi-visit generation and advanced filtering."""

from __future__ import annotations
import csv
import io
import os
import re
import smtplib
import uuid
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime, date, timedelta
from typing import Optional, List, Dict, Any

from .db import Database
from .models import (
    VisitEntry, ValidationError, UserRole, VisitType,
    clean_name, validate_user_code, validate_mobile,
    validate_dsa_code, validate_connector_code, validate_vendor_code,
    validate_lead_or_loan_id, validate_visit_date
)


class TrackerService:
    """Service providing core operations for multi-type visit submissions, filtering, and management."""

    def __init__(self, db: Database):
        self.db = db

    @staticmethod
    def _now_iso() -> str:
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    @staticmethod
    def _generate_visit_code() -> str:
        timestamp_part = datetime.now().strftime("%y%m%d")
        unique_suffix = uuid.uuid4().hex[:5].upper()
        return f"VT-{timestamp_part}-{unique_suffix}"

    def _row_to_entry(self, r) -> VisitEntry:
        return VisitEntry(
            id=r["id"],
            visit_code=r["visit_code"],
            user_role=r["user_role"],
            user_name=r["user_name"],
            user_code=r["user_code"],
            state=r["state"],
            cluster=r["cluster"],
            branch=r["branch"],
            visit_date=r["visit_date"],
            visit_type=r["visit_type"],
            sub_type=r["sub_type"],
            customer_status=r["customer_status"],
            id_type=r["id_type"],
            entity_name=r["entity_name"],
            entity_code=r["entity_code"],
            mobile=r["mobile"],
            reason=r["reason"],
            address=r["address"],
            latitude=r["latitude"],
            longitude=r["longitude"],
            location_timestamp=r["location_timestamp"],
            photo_data=r["photo_data"],
            status=r["status"] or "Logged",
            notes=r["notes"],
            created_at=r["created_at"],
            updated_at=r["updated_at"]
        )

    def insert_entry(self, entry: VisitEntry) -> VisitEntry:
        """Insert a validated VisitEntry into the database."""
        now = self._now_iso()
        visit_code = self._generate_visit_code()
        entry.visit_code = visit_code
        entry.created_at = now
        entry.updated_at = now

        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO visits (
                    visit_code, user_role, user_name, user_code,
                    state, cluster, branch, visit_date,
                    visit_type, sub_type, customer_status, id_type,
                    entity_name, entity_code, mobile, reason,
                    address, latitude, longitude, location_timestamp,
                    photo_data, status, notes, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    entry.visit_code, entry.user_role, entry.user_name, entry.user_code,
                    entry.state, entry.cluster, entry.branch, entry.visit_date,
                    entry.visit_type, entry.sub_type, entry.customer_status, entry.id_type,
                    entry.entity_name, entry.entity_code, entry.mobile, entry.reason,
                    entry.address, entry.latitude, entry.longitude, entry.location_timestamp,
                    entry.photo_data, entry.status, entry.notes, entry.created_at, entry.updated_at
                )
            )
            entry.id = cursor.lastrowid

            # Audit log
            conn.execute(
                "INSERT INTO audit_logs (visit_id, action, details, timestamp) VALUES (?, ?, ?, ?)",
                (entry.id, "VISIT_CREATED", f"Visit {entry.visit_code} logged for {entry.entity_name}", now)
            )

        return entry

    def submit_multi_visits(self, payload: Dict[str, Any]) -> List[VisitEntry]:
        """
        Processes interactive multi-visit submission payload.
        Generates individual rows for each selected visit type / partner / vendor subtype.
        """
        # 1. User Details
        user_role = payload.get("user_role")
        user_name = clean_name(payload.get("user_name"), "User Name")
        user_code = validate_user_code(payload.get("user_code"))
        state = (payload.get("state") or "").strip()
        cluster = (payload.get("cluster") or "").strip()
        branch = (payload.get("branch") or "").strip()
        visit_date = validate_visit_date(payload.get("visit_date"))
        visit_remarks = (payload.get("visit_remarks") or payload.get("notes") or "").strip()
        notes_val = visit_remarks if visit_remarks else None

        if not state:
            raise ValidationError("State selection is required.")
        if not cluster:
            raise ValidationError("Cluster selection is required.")
        if not branch:
            raise ValidationError("Branch selection is required.")

        visit_types = payload.get("visit_types", [])
        if not visit_types or not isinstance(visit_types, list):
            raise ValidationError("At least one Visit Type must be selected.")

        created_entries: List[VisitEntry] = []
        now_ts = self._now_iso()

        # 2. Iterate Selected Types and Generate Entries
        for v_type in visit_types:
            if v_type == VisitType.CUSTOMER.value:
                c_data = payload.get("customer_visit") or {}
                cust_status = c_data.get("customer_status", "New Customer")
                id_type = None
                entity_code = None
                if cust_status == "Existing Customer":
                    id_type = c_data.get("id_type", "Lead ID")
                    raw_id = c_data.get("id_number")
                    entity_code = validate_lead_or_loan_id(raw_id, id_type)

                cust_name = clean_name(c_data.get("customer_name"), "Customer Name")
                cust_mobile = validate_mobile(c_data.get("customer_mobile"), "Customer Mobile Number")
                reason = c_data.get("reason", "Regular visit")
                address = c_data.get("address")
                photo = c_data.get("photo_data")
                lat = float(c_data["latitude"]) if c_data.get("latitude") is not None and str(c_data.get("latitude")).strip() != "" else None
                lon = float(c_data["longitude"]) if c_data.get("longitude") is not None and str(c_data.get("longitude")).strip() != "" else None
                loc_ts = c_data.get("location_timestamp") or (now_ts if lat is not None else None)

                entry = VisitEntry(
                    user_role=user_role,
                    user_name=user_name,
                    user_code=user_code,
                    state=state,
                    cluster=cluster,
                    branch=branch,
                    visit_date=visit_date,
                    visit_type=VisitType.CUSTOMER.value,
                    sub_type=cust_status,
                    customer_status=cust_status,
                    id_type=id_type,
                    entity_name=cust_name,
                    entity_code=entity_code,
                    mobile=cust_mobile,
                    reason=reason,
                    address=address,
                    latitude=lat,
                    longitude=lon,
                    location_timestamp=loc_ts,
                    photo_data=photo,
                    notes=notes_val
                )
                created_entries.append(self.insert_entry(entry))

            elif v_type == VisitType.PARTNER.value:
                p_data = payload.get("partner_visit") or {}
                subtypes = p_data.get("subtypes") or []
                if not subtypes:
                    raise ValidationError("Please select at least one Partner Visit Type (DSA visit or Connector Visit).")

                # DSA
                if "DSA visit" in subtypes:
                    dsa = p_data.get("dsa") or {}
                    dsa_name = clean_name(dsa.get("name"), "DSA Name")
                    reason = dsa.get("reason", "Regular visit")
                    dsa_code_required = reason not in ["Onboarding visit", "Regular visit"]
                    dsa_code = validate_dsa_code(dsa.get("code"), required=dsa_code_required)
                    dsa_mobile = validate_mobile(dsa.get("mobile"), "DSA Mobile Number")
                    address = dsa.get("address")
                    photo = dsa.get("photo_data")
                    lat = float(dsa["latitude"]) if dsa.get("latitude") is not None and str(dsa.get("latitude")).strip() != "" else None
                    lon = float(dsa["longitude"]) if dsa.get("longitude") is not None and str(dsa.get("longitude")).strip() != "" else None
                    loc_ts = dsa.get("location_timestamp") or (now_ts if lat is not None else None)

                    entry = VisitEntry(
                        user_role=user_role,
                        user_name=user_name,
                        user_code=user_code,
                        state=state,
                        cluster=cluster,
                        branch=branch,
                        visit_date=visit_date,
                        visit_type=VisitType.PARTNER.value,
                        sub_type="DSA visit",
                        entity_name=dsa_name,
                        entity_code=dsa_code,
                        mobile=dsa_mobile,
                        reason=reason,
                        address=address,
                        latitude=lat,
                        longitude=lon,
                        location_timestamp=loc_ts,
                        photo_data=photo,
                        notes=notes_val
                    )
                    created_entries.append(self.insert_entry(entry))

                # Connector
                if "Connector Visit" in subtypes:
                    con = p_data.get("connector") or {}
                    con_name = clean_name(con.get("name"), "Connector Name")
                    reason = con.get("reason", "Regular visit")
                    con_code_required = reason not in ["Onboarding visit", "Regular visit"]
                    con_code = validate_connector_code(con.get("code"), required=con_code_required)
                    con_mobile = validate_mobile(con.get("mobile"), "Connector Mobile Number")
                    address = con.get("address")
                    photo = con.get("photo_data")
                    lat = float(con["latitude"]) if con.get("latitude") is not None and str(con.get("latitude")).strip() != "" else None
                    lon = float(con["longitude"]) if con.get("longitude") is not None and str(con.get("longitude")).strip() != "" else None
                    loc_ts = con.get("location_timestamp") or (now_ts if lat is not None else None)

                    entry = VisitEntry(
                        user_role=user_role,
                        user_name=user_name,
                        user_code=user_code,
                        state=state,
                        cluster=cluster,
                        branch=branch,
                        visit_date=visit_date,
                        visit_type=VisitType.PARTNER.value,
                        sub_type="Connector Visit",
                        entity_name=con_name,
                        entity_code=con_code,
                        mobile=con_mobile,
                        reason=reason,
                        address=address,
                        latitude=lat,
                        longitude=lon,
                        location_timestamp=loc_ts,
                        photo_data=photo,
                        notes=notes_val
                    )
                    created_entries.append(self.insert_entry(entry))

            elif v_type == VisitType.VENDOR.value:
                v_data = payload.get("vendor_visit") or {}
                subtypes = v_data.get("subtypes") or []
                if not subtypes:
                    raise ValidationError("Please select at least one Vendor Visit Type (Technical Vendor or Legal Vendor).")

                # Technical
                if "Technical Vendor" in subtypes:
                    tech = v_data.get("technical") or {}
                    tech_name = clean_name(tech.get("name"), "Technical Vendor Name")
                    reason = tech.get("reason", "Regular visit")
                    tech_code_required = reason not in ["Onboarding visit", "Regular visit"]
                    tech_code = validate_vendor_code(tech.get("code"), required=tech_code_required)
                    tech_mobile = validate_mobile(tech.get("mobile"), "Technical Vendor Mobile Number")
                    address = tech.get("address")
                    photo = tech.get("photo_data")
                    lat = float(tech["latitude"]) if tech.get("latitude") is not None and str(tech.get("latitude")).strip() != "" else None
                    lon = float(tech["longitude"]) if tech.get("longitude") is not None and str(tech.get("longitude")).strip() != "" else None
                    loc_ts = tech.get("location_timestamp") or (now_ts if lat is not None else None)

                    entry = VisitEntry(
                        user_role=user_role,
                        user_name=user_name,
                        user_code=user_code,
                        state=state,
                        cluster=cluster,
                        branch=branch,
                        visit_date=visit_date,
                        visit_type=VisitType.VENDOR.value,
                        sub_type="Technical Vendor",
                        entity_name=tech_name,
                        entity_code=tech_code,
                        mobile=tech_mobile,
                        reason=reason,
                        address=address,
                        latitude=lat,
                        longitude=lon,
                        location_timestamp=loc_ts,
                        photo_data=photo,
                        notes=notes_val
                    )
                    created_entries.append(self.insert_entry(entry))

                # Legal
                if "Legal Vendor" in subtypes:
                    legal = v_data.get("legal") or {}
                    legal_name = clean_name(legal.get("name"), "Legal Vendor Name")
                    reason = legal.get("reason", "Regular visit")
                    legal_code_required = reason not in ["Onboarding visit", "Regular visit"]
                    legal_code = validate_vendor_code(legal.get("code"), required=legal_code_required)
                    legal_mobile = validate_mobile(legal.get("mobile"), "Legal Vendor Mobile Number")
                    address = legal.get("address")
                    photo = legal.get("photo_data")
                    lat = float(legal["latitude"]) if legal.get("latitude") is not None and str(legal.get("latitude")).strip() != "" else None
                    lon = float(legal["longitude"]) if legal.get("longitude") is not None and str(legal.get("longitude")).strip() != "" else None
                    loc_ts = legal.get("location_timestamp") or (now_ts if lat is not None else None)

                    entry = VisitEntry(
                        user_role=user_role,
                        user_name=user_name,
                        user_code=user_code,
                        state=state,
                        cluster=cluster,
                        branch=branch,
                        visit_date=visit_date,
                        visit_type=VisitType.VENDOR.value,
                        sub_type="Legal Vendor",
                        entity_name=legal_name,
                        entity_code=legal_code,
                        mobile=legal_mobile,
                        reason=reason,
                        address=address,
                        latitude=lat,
                        longitude=lon,
                        location_timestamp=loc_ts,
                        photo_data=photo,
                        notes=notes_val
                    )
                    created_entries.append(self.insert_entry(entry))

            elif v_type == VisitType.BUSINESS.value:
                b_data = payload.get("business_visit") or {}
                b_name = clean_name(b_data.get("name"), "Business Name")
                b_mobile = validate_mobile(b_data.get("mobile"), "Business Mobile Number")
                reason = b_data.get("reason", "Regular visit")
                address = b_data.get("address")
                photo = b_data.get("photo_data")
                lat = float(b_data["latitude"]) if b_data.get("latitude") is not None and str(b_data.get("latitude")).strip() != "" else None
                lon = float(b_data["longitude"]) if b_data.get("longitude") is not None and str(b_data.get("longitude")).strip() != "" else None
                loc_ts = b_data.get("location_timestamp") or (now_ts if lat is not None else None)

                entry = VisitEntry(
                    user_role=user_role,
                    user_name=user_name,
                    user_code=user_code,
                    state=state,
                    cluster=cluster,
                    branch=branch,
                    visit_date=visit_date,
                    visit_type=VisitType.BUSINESS.value,
                    sub_type="Business Entity",
                    entity_name=b_name,
                    mobile=b_mobile,
                    reason=reason,
                    address=address,
                    latitude=lat,
                    longitude=lon,
                    location_timestamp=loc_ts,
                    photo_data=photo,
                    notes=notes_val
                )
                created_entries.append(self.insert_entry(entry))

            elif v_type == VisitType.OTHER.value:
                o_data = payload.get("other_visit") or {}
                o_name = clean_name(o_data.get("name"), "Contact/Entity Name")
                o_mobile = validate_mobile(o_data.get("mobile"), "Contact Mobile Number", required=False)
                reason = o_data.get("reason", "Other discussion")
                address = o_data.get("address")
                photo = o_data.get("photo_data")
                lat = float(o_data["latitude"]) if o_data.get("latitude") is not None and str(o_data.get("latitude")).strip() != "" else None
                lon = float(o_data["longitude"]) if o_data.get("longitude") is not None and str(o_data.get("longitude")).strip() != "" else None
                loc_ts = o_data.get("location_timestamp") or (now_ts if lat is not None else None)

                entry = VisitEntry(
                    user_role=user_role,
                    user_name=user_name,
                    user_code=user_code,
                    state=state,
                    cluster=cluster,
                    branch=branch,
                    visit_date=visit_date,
                    visit_type=VisitType.OTHER.value,
                    sub_type="General / Other",
                    entity_name=o_name,
                    mobile=o_mobile,
                    reason=reason,
                    address=address,
                    latitude=lat,
                    longitude=lon,
                    location_timestamp=loc_ts,
                    photo_data=photo,
                    notes=notes_val
                )
                created_entries.append(self.insert_entry(entry))

        return created_entries

    def get_visit(self, identifier: int | str) -> Optional[VisitEntry]:
        with self.db.connect() as conn:
            cursor = conn.cursor()
            if isinstance(identifier, int) or (isinstance(identifier, str) and identifier.isdigit()):
                cursor.execute("SELECT * FROM visits WHERE id = ?", (int(identifier),))
            else:
                cursor.execute("SELECT * FROM visits WHERE visit_code = ?", (str(identifier),))
            row = cursor.fetchone()
            if not row:
                return None
            return self._row_to_entry(row)

    def update_visit(self, identifier: int | str, updates: Dict[str, Any]) -> VisitEntry:
        """Update visit entry details (master view edit capability)."""
        existing = self.get_visit(identifier)
        if not existing:
            raise ValidationError(f"Visit not found: {identifier}")

        now = self._now_iso()
        allowed_fields = [
            "entity_name", "mobile", "reason", "address", "notes",
            "status", "branch", "cluster", "state", "entity_code"
        ]

        set_clauses = ["updated_at = ?"]
        params = [now]

        for k, v in updates.items():
            if k in allowed_fields:
                if k == "entity_name" and v:
                    v = clean_name(v, "Entity Name")
                elif k == "mobile" and v:
                    v = validate_mobile(v, "Mobile Number", required=False)
                set_clauses.append(f"{k} = ?")
                params.append(v)

        params.append(existing.id)
        sql = f"UPDATE visits SET {', '.join(set_clauses)} WHERE id = ?"

        with self.db.connect() as conn:
            conn.execute(sql, params)
            conn.execute(
                "INSERT INTO audit_logs (visit_id, action, details, timestamp) VALUES (?, ?, ?, ?)",
                (existing.id, "VISIT_UPDATED", f"Visit updated by master user", now)
            )

        return self.get_visit(existing.id)  # type: ignore

    def delete_visit(self, identifier: int | str) -> bool:
        """Delete visit entry."""
        existing = self.get_visit(identifier)
        if not existing:
            return False
        with self.db.connect() as conn:
            conn.execute(
                "INSERT INTO audit_logs (visit_id, action, details, timestamp) VALUES (NULL, ?, ?, ?)",
                ("VISIT_DELETED", f"Visit {existing.visit_code} deleted", self._now_iso())
            )
            conn.execute("DELETE FROM visits WHERE id = ?", (existing.id,))
        return True

    def list_visits(
        self,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        user_role: Optional[str] = None,
        state: Optional[str] = None,
        cluster: Optional[str] = None,
        branch: Optional[str] = None,
        visit_type: Optional[str] = None,
        search_query: Optional[str] = None,
        limit: int = 1000,
        offset: int = 0
    ) -> List[VisitEntry]:
        """Query visits with master advance filters."""
        sql = "SELECT * FROM visits WHERE 1=1"
        params: List[Any] = []

        if from_date:
            sql += " AND date(visit_date) >= date(?)"
            params.append(from_date)

        if to_date:
            sql += " AND date(visit_date) <= date(?)"
            params.append(to_date)

        if user_role:
            sql += " AND user_role = ?"
            params.append(user_role.upper())

        if state and state != "All":
            sql += " AND state = ?"
            params.append(state)

        if cluster and cluster != "All":
            sql += " AND cluster = ?"
            params.append(cluster)

        if branch and branch != "All":
            sql += " AND branch = ?"
            params.append(branch)

        if visit_type and visit_type != "All":
            sql += " AND visit_type = ?"
            params.append(visit_type)

        if search_query:
            q = f"%{search_query.strip()}%"
            sql += """ AND (
                visit_code LIKE ? OR
                user_name LIKE ? OR
                user_code LIKE ? OR
                entity_name LIKE ? OR
                entity_code LIKE ? OR
                mobile LIKE ? OR
                reason LIKE ? OR
                branch LIKE ? OR
                notes LIKE ?
            )"""
            params.extend([q, q, q, q, q, q, q, q, q])

        sql += " ORDER BY id DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            return [self._row_to_entry(r) for r in cursor.fetchall()]

    def count_visits(
        self,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        user_role: Optional[str] = None,
        state: Optional[str] = None,
        cluster: Optional[str] = None,
        branch: Optional[str] = None,
        visit_type: Optional[str] = None,
        search_query: Optional[str] = None
    ) -> int:
        """Count visits matching current filters for live counter."""
        sql = "SELECT COUNT(*) FROM visits WHERE 1=1"
        params: List[Any] = []

        if from_date:
            sql += " AND date(visit_date) >= date(?)"
            params.append(from_date)
        if to_date:
            sql += " AND date(visit_date) <= date(?)"
            params.append(to_date)
        if user_role:
            sql += " AND user_role = ?"
            params.append(user_role.upper())
        if state and state != "All":
            sql += " AND state = ?"
            params.append(state)
        if cluster and cluster != "All":
            sql += " AND cluster = ?"
            params.append(cluster)
        if branch and branch != "All":
            sql += " AND branch = ?"
            params.append(branch)
        if visit_type and visit_type != "All":
            sql += " AND visit_type = ?"
            params.append(visit_type)
        if search_query:
            q = f"%{search_query.strip()}%"
            sql += """ AND (
                visit_code LIKE ? OR
                user_name LIKE ? OR
                user_code LIKE ? OR
                entity_name LIKE ? OR
                entity_code LIKE ? OR
                mobile LIKE ? OR
                reason LIKE ? OR
                branch LIKE ? OR
                notes LIKE ?
            )"""
            params.extend([q, q, q, q, q, q, q, q, q])

        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            return cursor.fetchone()[0]

    def get_stats(self) -> Dict[str, Any]:
        """Aggregate summary metrics for the master dashboard."""
        today = date.today().isoformat()
        with self.db.connect() as conn:
            cursor = conn.cursor()

            cursor.execute("SELECT COUNT(*) FROM visits")
            total_visits = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM visits WHERE date(visit_date) = date(?)", (today,))
            today_visits = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(DISTINCT user_code) FROM visits")
            active_users = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(DISTINCT branch) FROM visits")
            unique_branches = cursor.fetchone()[0]

            cursor.execute("SELECT visit_type, COUNT(*) FROM visits GROUP BY visit_type")
            by_type = {r[0]: r[1] for r in cursor.fetchall()}

            cursor.execute("SELECT user_role, COUNT(*) FROM visits GROUP BY user_role")
            by_role = {r[0]: r[1] for r in cursor.fetchall()}

        return {
            "total_visits": total_visits,
            "today_visits": today_visits,
            "active_users": active_users,
            "unique_branches": unique_branches,
            "by_type": by_type,
            "by_role": by_role,
        }

    def export_visits_csv(
        self,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        user_role: Optional[str] = None,
        state: Optional[str] = None,
        cluster: Optional[str] = None,
        branch: Optional[str] = None,
        visit_type: Optional[str] = None,
        search_query: Optional[str] = None
    ) -> str:
        """Generate comprehensive CSV with all user-entered details, coordinates, timestamps."""
        visits = self.list_visits(
            from_date=from_date,
            to_date=to_date,
            user_role=user_role,
            state=state,
            cluster=cluster,
            branch=branch,
            visit_type=visit_type,
            search_query=search_query,
            limit=20000
        )
        output = io.StringIO()
        fieldnames = [
            "visit_code", "visit_date", "visit_time", "user_role", "user_name", "user_code",
            "state", "cluster", "branch", "visit_type", "sub_type",
            "entity_name", "entity_code", "customer_status", "id_type",
            "mobile", "reason", "address", "visit_remarks", "photo_captured",
            "latitude", "longitude", "location_timestamp", "map_url", "status",
            "created_at", "updated_at"
        ]
        writer = csv.DictWriter(output, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        for v in visits:
            d = v.to_dict()
            map_url = ""
            if d.get("latitude") and d.get("longitude"):
                map_url = f"https://www.google.com/maps?q={d['latitude']},{d['longitude']}"
            d["map_url"] = map_url
            d["visit_remarks"] = d.get("notes") or ""
            d["photo_captured"] = "Yes (Verified Proof)" if d.get("photo_data") else "No"
            loc_ts = d.get("location_timestamp") or d.get("created_at") or ""
            d["visit_time"] = loc_ts.split(" ")[1] if " " in str(loc_ts) else str(loc_ts)
            row = {k: d.get(k, "") or "" for k in fieldnames}
            writer.writerow(row)
        return output.getvalue()

    def export_visits_excel(
        self,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        user_role: Optional[str] = None,
        state: Optional[str] = None,
        cluster: Optional[str] = None,
        branch: Optional[str] = None,
        visit_type: Optional[str] = None,
        search_query: Optional[str] = None
    ) -> str:
        """Generate structured Microsoft Excel XML spreadsheet (.xls) with full user details and formatted header styling."""
        visits = self.list_visits(
            from_date=from_date,
            to_date=to_date,
            user_role=user_role,
            state=state,
            cluster=cluster,
            branch=branch,
            visit_type=visit_type,
            search_query=search_query,
            limit=20000
        )
        columns = [
            ("visit_code", "Visit Code"),
            ("visit_date", "Visit Date"),
            ("visit_time", "Visit Time"),
            ("user_role", "User Role"),
            ("user_name", "User Name"),
            ("user_code", "User Code"),
            ("state", "State"),
            ("cluster", "Cluster"),
            ("branch", "Branch"),
            ("visit_type", "Visit Type"),
            ("sub_type", "Sub-Type"),
            ("customer_status", "Customer Status"),
            ("id_type", "ID Type"),
            ("entity_name", "Entity / Client Name"),
            ("entity_code", "Entity Code / ID"),
            ("mobile", "Contact Mobile"),
            ("reason", "Reason for Visit"),
            ("address", "Address Details"),
            ("visit_remarks", "Visit Remarks / Notes"),
            ("photo_captured", "Photo Proof"),
            ("latitude", "Latitude"),
            ("longitude", "Longitude"),
            ("location_timestamp", "GPS Timestamp"),
            ("map_url", "Google Maps URL"),
            ("status", "Status"),
            ("created_at", "Logged At"),
            ("updated_at", "Last Updated")
        ]

        def escape_xml(val: Any) -> str:
            if val is None:
                return ""
            s = str(val)
            return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;").replace("'", "&apos;")

        xml_lines = [
            '<?xml version="1.0"?>',
            '<?mso-application progid="Excel.Sheet"?>',
            '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"',
            ' xmlns:o="urn:schemas-microsoft-com:office:office"',
            ' xmlns:x="urn:schemas-microsoft-com:office:excel"',
            ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"',
            ' xmlns:html="http://www.w3.org/TR/REC-html40">',
            ' <Styles>',
            '  <Style ss:ID="Default" ss:Name="Normal">',
            '   <Alignment ss:Vertical="Center"/>',
            '   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>',
            '  </Style>',
            '  <Style ss:ID="HeaderStyle">',
            '   <Font ss:Bold="1" ss:Color="#FFFFFF" ss:FontName="Segoe UI" ss:Size="10"/>',
            '   <Interior ss:Color="#1E40AF" ss:Pattern="Solid"/>',
            '   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>',
            '   <Borders>',
            '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#93C5FD"/>',
            '   </Borders>',
            '  </Style>',
            '  <Style ss:ID="DataStyle">',
            '   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#0F172A"/>',
            '   <Alignment ss:Vertical="Center"/>',
            '   <Borders>',
            '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>',
            '    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>',
            '   </Borders>',
            '  </Style>',
            '  <Style ss:ID="DataStyleAlt">',
            '   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#0F172A"/>',
            '   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>',
            '   <Alignment ss:Vertical="Center"/>',
            '   <Borders>',
            '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>',
            '    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>',
            '   </Borders>',
            '  </Style>',
            ' </Styles>',
            ' <Worksheet ss:Name="Visits Master Data">',
            f'  <Table ss:ExpandedColumnCount="{len(columns)}" x:FullColumns="1" x:FullRows="1">'
        ]

        # Column widths
        for col_id, col_name in columns:
            width = max(len(col_name) * 9, 90)
            if col_id in ("address", "visit_remarks", "map_url", "entity_name"):
                width = 180
            xml_lines.append(f'   <Column ss:Width="{width}"/>')

        # Header Row
        xml_lines.append('   <Row ss:Height="26">')
        for _, col_name in columns:
            xml_lines.append(f'    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">{escape_xml(col_name)}</Data></Cell>')
        xml_lines.append('   </Row>')

        # Data Rows
        for idx, v in enumerate(visits):
            d = v.to_dict()
            map_url = ""
            if d.get("latitude") and d.get("longitude"):
                map_url = f"https://www.google.com/maps?q={d['latitude']},{d['longitude']}"
            d["map_url"] = map_url
            d["visit_remarks"] = d.get("notes") or ""
            d["photo_captured"] = "Yes (Verified Proof)" if d.get("photo_data") else "No"
            loc_ts = d.get("location_timestamp") or d.get("created_at") or ""
            d["visit_time"] = loc_ts.split(" ")[1] if " " in str(loc_ts) else str(loc_ts)

            style_id = "DataStyleAlt" if (idx % 2 == 1) else "DataStyle"
            xml_lines.append('   <Row ss:Height="22">')
            for col_id, _ in columns:
                raw_val = d.get(col_id, "") or ""
                xml_lines.append(f'    <Cell ss:StyleID="{style_id}"><Data ss:Type="String">{escape_xml(raw_val)}</Data></Cell>')
            xml_lines.append('   </Row>')

        xml_lines.extend([
            '  </Table>',
            ' </Worksheet>',
            '</Workbook>'
        ])
        return "\n".join(xml_lines)

    def send_email_report(
        self,
        recipients: List[str],
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        user_role: Optional[str] = None,
        state: Optional[str] = None,
        cluster: Optional[str] = None,
        branch: Optional[str] = None,
        visit_type: Optional[str] = None,
        search_query: Optional[str] = None,
        subject: Optional[str] = None,
        custom_note: Optional[str] = None
    ) -> Dict[str, Any]:
        """Send or dispatch formatted visit summary and Excel attachment to one or more recipient email addresses."""
        if not recipients or not isinstance(recipients, list):
            raise ValidationError("At least one recipient email address is required.")

        cleaned_recipients = []
        for em in recipients:
            em_clean = str(em).strip().lower()
            if em_clean and re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", em_clean):
                if em_clean not in cleaned_recipients:
                    cleaned_recipients.append(em_clean)
            elif em_clean:
                raise ValidationError(f"Invalid email address format: '{em_clean}'")

        if not cleaned_recipients:
            raise ValidationError("Please provide at least one valid recipient email address.")

        visits = self.list_visits(
            from_date=from_date,
            to_date=to_date,
            user_role=user_role,
            state=state,
            cluster=cluster,
            branch=branch,
            visit_type=visit_type,
            search_query=search_query,
            limit=20000
        )

        now_str = self._now_iso()
        report_date = date.today().isoformat()
        total_count = len(visits)
        email_subj = subject or f"Visit Tracker Executive Summary & Excel Report - {report_date}"

        type_counts: Dict[str, int] = {}
        for v in visits:
            t = v.visit_type or "Other"
            type_counts[t] = type_counts.get(t, 0) + 1

        excel_content = self.export_visits_excel(
            from_date=from_date, to_date=to_date, user_role=user_role,
            state=state, cluster=cluster, branch=branch,
            visit_type=visit_type, search_query=search_query
        )

        note_section = ""
        if custom_note and custom_note.strip():
            note_section = f"""
            <div style="background:#f1f5f9; border-left:4px solid #2563eb; padding:12px 16px; margin:16px 0; border-radius:4px;">
              <strong style="color:#1e3a8a;">Sender Note:</strong> {custom_note.strip()}
            </div>
            """

        rows_html = ""
        for v in visits[:20]:
            remarks_badge = f"<span style='color:#64748b;'>{v.notes or '-'}</span>"
            rows_html += f"""
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:8px 10px; font-weight:600; color:#1e40af;">{v.visit_code}</td>
              <td style="padding:8px 10px;">{v.visit_date}</td>
              <td style="padding:8px 10px;">{v.user_name} ({v.user_role})</td>
              <td style="padding:8px 10px;">{v.branch}, {v.state}</td>
              <td style="padding:8px 10px;"><span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:12px; font-size:12px;">{v.visit_type}</span></td>
              <td style="padding:8px 10px;">{v.entity_name}</td>
              <td style="padding:8px 10px;">{remarks_badge}</td>
              <td style="padding:8px 10px;"><span style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:12px; font-size:12px;">{v.status}</span></td>
            </tr>
            """

        more_notice = ""
        if len(visits) > 20:
            more_notice = f"<p style='color:#64748b; font-size:12px; margin-top:8px;'>Showing first 20 records. All {total_count} records are fully populated in the attached Excel file.</p>"

        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#0f172a; margin:0; padding:20px; background:#f8fafc;">
          <div style="max-width:800px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            <div style="background:#1e40af; padding:24px; color:#ffffff;">
              <h2 style="margin:0; font-size:22px; font-weight:700;">Visit Tracker - Executive Activity Report</h2>
              <p style="margin:6px 0 0; color:#bfdbfe; font-size:14px;">Dispatched on {now_str} IST | Generated for Management Review</p>
            </div>
            <div style="padding:24px;">
              {note_section}
              <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
                <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:12px 18px; min-width:120px;">
                  <div style="font-size:11px; font-weight:700; color:#1e40af; text-transform:uppercase;">Total Visits</div>
                  <div style="font-size:24px; font-weight:800; color:#1e3a8a;">{total_count}</div>
                </div>
                {"".join([f'''
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:12px 18px; min-width:110px;">
                  <div style="font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase;">{k}</div>
                  <div style="font-size:20px; font-weight:700; color:#0f172a;">{cnt}</div>
                </div>
                ''' for k, cnt in type_counts.items()])}
              </div>

              <h4 style="margin:18px 0 10px; color:#1e293b; font-size:15px; border-bottom:2px solid #e2e8f0; padding-bottom:6px;">Activity Highlights ({min(20, total_count)} of {total_count} records)</h4>
              <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
                <thead>
                  <tr style="background:#f1f5f9; color:#475569;">
                    <th style="padding:8px 10px;">Code</th>
                    <th style="padding:8px 10px;">Date</th>
                    <th style="padding:8px 10px;">Executive</th>
                    <th style="padding:8px 10px;">Branch</th>
                    <th style="padding:8px 10px;">Type</th>
                    <th style="padding:8px 10px;">Entity Name</th>
                    <th style="padding:8px 10px;">Remarks</th>
                    <th style="padding:8px 10px;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows_html if rows_html else '<tr><td colspan="8" style="padding:16px; text-align:center; color:#94a3b8;">No visits recorded for the selected filter criteria.</td></tr>'}
                </tbody>
              </table>
              {more_notice}

              <div style="margin-top:24px; padding:14px 18px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px;">
                <span style="font-weight:700; color:#166534;">Attached File:</span>
                <span style="color:#15803d; font-family:monospace;">visit_tracker_report_{report_date}.xls</span>
                <div style="font-size:12px; color:#166534; margin-top:4px;">Contains full dataset with GPS coordinates, timestamps, branch hierarchy, verification status, and tracking remarks.</div>
              </div>
            </div>
            <div style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:12px 24px; font-size:12px; color:#64748b; text-align:center;">
              Visit Tracker Enterprise Monitoring Portal &copy; 2026. Confidential & Proprietary.
            </div>
          </div>
        </body>
        </html>
        """

        smtp_host = os.environ.get("SMTP_HOST")
        is_live_smtp = bool(smtp_host)
        if is_live_smtp:
            smtp_port = int(os.environ.get("SMTP_PORT", 587))
            smtp_user = os.environ.get("SMTP_USER", "")
            smtp_pass = os.environ.get("SMTP_PASS", "")
            smtp_from = os.environ.get("SMTP_FROM", smtp_user or "visits@tracker.local")

            msg = MIMEMultipart("mixed")
            msg["Subject"] = email_subj
            msg["From"] = smtp_from
            msg["To"] = ", ".join(cleaned_recipients)

            msg_body = MIMEMultipart("alternative")
            msg_body.attach(MIMEText(html_body, "html"))
            msg.attach(msg_body)

            part = MIMEBase("application", "vnd.ms-excel")
            part.set_payload(excel_content.encode("utf-8"))
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f'attachment; filename="visit_tracker_report_{report_date}.xls"')
            msg.attach(part)

            with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as s:
                s.starttls()
                if smtp_user and smtp_pass:
                    s.login(smtp_user, smtp_pass)
                s.sendmail(smtp_from, cleaned_recipients, msg.as_string())

        with self.db.connect() as conn:
            conn.execute(
                "INSERT INTO audit_logs (visit_id, action, details, timestamp) VALUES (NULL, ?, ?, ?)",
                (
                    "EMAIL_DISPATCHED",
                    f"Report sent to {', '.join(cleaned_recipients)} ({total_count} records). Mode: {'LIVE_SMTP' if is_live_smtp else 'MOCK_DISPATCH'}",
                    now_str
                )
            )

        return {
            "success": True,
            "recipients": cleaned_recipients,
            "total_records": total_count,
            "subject": email_subj,
            "timestamp": now_str,
            "mode": "live_smtp" if is_live_smtp else "dispatched",
            "message": f"Visit report successfully dispatched to {len(cleaned_recipients)} recipient(s)."
        }

    def seed_demo_visits(self) -> None:
        """Seed realistic demo records if database is empty."""
        with self.db.connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM visits")
            if cursor.fetchone()[0] > 0:
                return

        demo_today = date.today().isoformat()
        demo_yesterday = (date.today() - timedelta(days=1)).isoformat()

        demo_payload_1 = {
            "user_role": "BDO",
            "user_name": "Rohan Sharma",
            "user_code": "FMF102938",
            "state": "Bihar",
            "cluster": "Muzaffarpur Cluster",
            "branch": "Muzaffarpur",
            "visit_date": demo_today,
            "visit_types": ["Customer Visit", "Business Visit"],
            "customer_visit": {
                "customer_status": "Existing Customer",
                "id_type": "Loan Application ID",
                "id_number": "482910",
                "customer_name": "Amit Kumar Singh",
                "customer_mobile": "9876543210",
                "reason": "Document related visit",
                "address": "Station Road, Muzaffarpur, Bihar",
                "latitude": 26.1209,
                "longitude": 85.3647,
                "location_timestamp": f"{demo_today} 11:30:00"
            },
            "business_visit": {
                "name": "Kisan Agro Trading",
                "mobile": "9812345678",
                "reason": "Regular visit",
                "address": "Market Yard, Muzaffarpur",
                "latitude": 26.1220,
                "longitude": 85.3680,
                "location_timestamp": f"{demo_today} 12:45:00"
            }
        }

        demo_payload_2 = {
            "user_role": "BDM",
            "user_name": "Pooja Verma",
            "user_code": "FMF204918",
            "state": "Rajasthan",
            "cluster": "Jaipur Cluster" if "Jaipur Cluster" else "Ajmer Cluster",
            "branch": "Jaipur",
            "visit_date": demo_today,
            "visit_types": ["Partner Visit"],
            "partner_visit": {
                "subtypes": ["DSA visit", "Connector Visit"],
                "dsa": {
                    "name": "Apex Finance Solutions",
                    "code": "FBGP109283",
                    "mobile": "9123456780",
                    "reason": "Onboarding visit",
                    "address": "MI Road, Jaipur, Rajasthan",
                    "latitude": 26.9124,
                    "longitude": 75.7873,
                    "location_timestamp": f"{demo_today} 14:15:00"
                },
                "connector": {
                    "name": "Sunil Rathore",
                    "code": "FGP304918",
                    "mobile": "9823456711",
                    "reason": "Customer related visit",
                    "address": "C-Scheme, Jaipur",
                    "latitude": 26.9150,
                    "longitude": 75.7910,
                    "location_timestamp": f"{demo_today} 15:40:00"
                }
            }
        }

        self.submit_multi_visits(demo_payload_1)
        self.submit_multi_visits(demo_payload_2)

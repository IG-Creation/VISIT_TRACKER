"""Business logic service layer for Visit Tracker with multi-visit generation and advanced filtering."""

from __future__ import annotations
import csv
import io
import uuid
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
                    photo_data=photo
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
                    dsa_code = validate_dsa_code(dsa.get("code"))
                    dsa_mobile = validate_mobile(dsa.get("mobile"), "DSA Mobile Number")
                    reason = dsa.get("reason", "Regular visit")
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
                        photo_data=photo
                    )
                    created_entries.append(self.insert_entry(entry))

                # Connector
                if "Connector Visit" in subtypes:
                    con = p_data.get("connector") or {}
                    con_name = clean_name(con.get("name"), "Connector Name")
                    con_code = validate_connector_code(con.get("code"))
                    con_mobile = validate_mobile(con.get("mobile"), "Connector Mobile Number")
                    reason = con.get("reason", "Regular visit")
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
                        photo_data=photo
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
                    tech_code = validate_vendor_code(tech.get("code"))
                    tech_mobile = validate_mobile(tech.get("mobile"), "Technical Vendor Mobile Number")
                    reason = tech.get("reason", "Regular visit")
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
                        photo_data=photo
                    )
                    created_entries.append(self.insert_entry(entry))

                # Legal
                if "Legal Vendor" in subtypes:
                    legal = v_data.get("legal") or {}
                    legal_name = clean_name(legal.get("name"), "Legal Vendor Name")
                    legal_code = validate_vendor_code(legal.get("code"))
                    legal_mobile = validate_mobile(legal.get("mobile"), "Legal Vendor Mobile Number")
                    reason = legal.get("reason", "Regular visit")
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
                        photo_data=photo
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
                    photo_data=photo
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
                    photo_data=photo
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
                branch LIKE ?
            )"""
            params.extend([q, q, q, q, q, q, q, q])

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
                branch LIKE ?
            )"""
            params.extend([q, q, q, q, q, q, q, q])

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
        """Generate comprehensive CSV with Google Maps link, coordinates, timestamps."""
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
            "visit_code", "visit_date", "user_role", "user_name", "user_code",
            "state", "cluster", "branch", "visit_type", "sub_type",
            "entity_name", "entity_code", "customer_status", "id_type",
            "mobile", "reason", "address", "latitude", "longitude",
            "location_timestamp", "map_url", "status", "created_at"
        ]
        writer = csv.DictWriter(output, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        for v in visits:
            d = v.to_dict()
            map_url = ""
            if d.get("latitude") and d.get("longitude"):
                map_url = f"https://www.google.com/maps?q={d['latitude']},{d['longitude']}"
            d["map_url"] = map_url
            row = {k: d.get(k, "") or "" for k in fieldnames}
            writer.writerow(row)
        return output.getvalue()

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

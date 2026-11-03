"""Data models and validation for Visit Tracker."""

from __future__ import annotations
from dataclasses import dataclass, field, asdict
from datetime import datetime
from enum import Enum
import re
from typing import Optional, Dict, Any


class VisitStatus(str, Enum):
    SCHEDULED = "SCHEDULED"
    CHECKED_IN = "CHECKED_IN"
    CHECKED_OUT = "CHECKED_OUT"
    CANCELLED = "CANCELLED"


class ValidationError(ValueError):
    """Raised when data validation fails."""
    pass


def validate_email(email: Optional[str]) -> Optional[str]:
    """Validate email address format if provided."""
    if not email:
        return None
    cleaned = email.strip()
    if not cleaned:
        return None
    if ".." in cleaned:
        raise ValidationError(f"Invalid email format: '{email}'")
    pattern = r"^[a-zA-Z0-9_.+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$"
    if not re.match(pattern, cleaned):
        raise ValidationError(f"Invalid email format: '{email}'")
    return cleaned.lower()


def validate_phone(phone: Optional[str]) -> Optional[str]:
    """Validate and clean phone number if provided."""
    if not phone:
        return None
    cleaned = phone.strip()
    if not cleaned:
        return None
    # Allow digits, spaces, plus, minus, parentheses; at least 7 digits
    digits = re.sub(r"\D", "", cleaned)
    if len(digits) < 7 or len(digits) > 15:
        raise ValidationError(f"Invalid phone number '{phone}': must contain between 7 and 15 digits.")
    return cleaned


def validate_required_string(value: Optional[str], field_name: str) -> str:
    """Validate that a required string is present and not empty."""
    if value is None or not str(value).strip():
        raise ValidationError(f"Field '{field_name}' is required and cannot be empty.")
    return str(value).strip()


@dataclass
class Visitor:
    name: str
    id: Optional[int] = None
    visitor_id: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    id_type: Optional[str] = "National ID"
    id_number: Optional[str] = None
    created_at: Optional[str] = None

    def __post_init__(self):
        self.name = validate_required_string(self.name, "visitor.name")
        self.email = validate_email(self.email)
        self.phone = validate_phone(self.phone)
        if self.company:
            self.company = self.company.strip()
        if self.id_type:
            self.id_type = self.id_type.strip()
        if self.id_number:
            self.id_number = self.id_number.strip()

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Host:
    name: str
    id: Optional[int] = None
    email: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    active: bool = True
    created_at: Optional[str] = None

    def __post_init__(self):
        self.name = validate_required_string(self.name, "host.name")
        self.email = validate_email(self.email)
        self.phone = validate_phone(self.phone)
        if self.department:
            self.department = self.department.strip()

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Location:
    name: str
    id: Optional[int] = None
    building: Optional[str] = None
    floor: Optional[str] = None
    created_at: Optional[str] = None

    def __post_init__(self):
        self.name = validate_required_string(self.name, "location.name")
        if self.building:
            self.building = self.building.strip()
        if self.floor:
            self.floor = self.floor.strip()

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Visit:
    visitor_id: int
    purpose: str
    id: Optional[int] = None
    visit_code: Optional[str] = None
    host_id: Optional[int] = None
    location_id: Optional[int] = None
    category: str = "Corporate Visitor"
    badge_number: Optional[str] = None
    status: VisitStatus = VisitStatus.SCHEDULED
    expected_checkin: Optional[str] = None
    checkin_time: Optional[str] = None
    checkout_time: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    # Joined entity details for presentation
    visitor_name: Optional[str] = None
    visitor_company: Optional[str] = None
    visitor_email: Optional[str] = None
    visitor_phone: Optional[str] = None
    host_name: Optional[str] = None
    host_department: Optional[str] = None
    location_name: Optional[str] = None

    def __post_init__(self):
        self.purpose = validate_required_string(self.purpose, "visit.purpose")
        if isinstance(self.status, str):
            try:
                self.status = VisitStatus(self.status.upper())
            except ValueError:
                valid = [s.value for s in VisitStatus]
                raise ValidationError(f"Invalid status '{self.status}'. Must be one of: {valid}")

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        d["status"] = self.status.value
        return d


@dataclass
class AuditLog:
    action: str
    id: Optional[int] = None
    visit_id: Optional[int] = None
    details: Optional[str] = None
    timestamp: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

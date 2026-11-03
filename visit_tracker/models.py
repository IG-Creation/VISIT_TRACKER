"""Data models and strict field validations for Visit Tracker."""

from __future__ import annotations
from dataclasses import dataclass, asdict
from datetime import datetime, date, timedelta
from enum import Enum
import re
from typing import Optional, Dict, Any, List


class UserRole(str, Enum):
    BDO = "BDO"
    BDM = "BDM"
    BPM = "BPM"
    BCM = "BCM"
    CCM = "CCM"
    CBM = "CBM"


class VisitType(str, Enum):
    CUSTOMER = "Customer Visit"
    PARTNER = "Partner Visit"
    VENDOR = "Vendor Visit"
    BUSINESS = "Business Visit"
    OTHER = "Other Visit"


class ValidationError(ValueError):
    """Raised when data validation fails."""
    pass


def clean_name(value: Optional[str], field_name: str = "Name") -> str:
    """Validate that name has no numeric characters and clean extra whitespace."""
    if not value or not str(value).strip():
        raise ValidationError(f"{field_name} is required.")
    cleaned = re.sub(r"\s+", " ", str(value)).strip()
    if re.search(r"\d", cleaned):
        raise ValidationError(f"{field_name} cannot contain numeric digits.")
    if not re.match(r"^[a-zA-Z\s.'-]+$", cleaned):
        raise ValidationError(f"{field_name} contains invalid characters.")
    return cleaned


def validate_user_code(value: Optional[str]) -> str:
    """Validate User code: starts with FMF followed by up to 6 digits."""
    if not value or not str(value).strip():
        raise ValidationError("User Code is required.")
    raw = str(value).strip().upper()
    if not raw.startswith("FMF"):
        raise ValidationError("User Code must start with 'FMF'.")
    digits = raw[3:]
    if not digits.isdigit():
        raise ValidationError("User Code can only contain numeric digits after 'FMF'.")
    if len(digits) == 0 or len(digits) > 6:
        raise ValidationError("User Code numeric part must be between 1 and 6 digits.")
    return f"FMF{digits}"


def validate_mobile(value: Optional[str], field_name: str = "Mobile number", required: bool = True) -> Optional[str]:
    """Validate mobile number: exactly 10 numeric digits (handles +91 or 0 prefix)."""
    if not value or not str(value).strip():
        if required:
            raise ValidationError(f"{field_name} is required.")
        return None
    cleaned = re.sub(r"\D", "", str(value).strip())
    if len(cleaned) == 12 and cleaned.startswith("91"):
        cleaned = cleaned[2:]
    elif len(cleaned) == 11 and cleaned.startswith("0"):
        cleaned = cleaned[1:]
    if len(cleaned) != 10:
        raise ValidationError(f"{field_name} must contain exactly 10 numeric digits.")
    return cleaned


def validate_dsa_code(value: Optional[str]) -> str:
    """Validate DSA code: starts with FBGP followed by up to 6 digits."""
    if not value or not str(value).strip():
        raise ValidationError("DSA Code is required.")
    raw = str(value).strip().upper()
    if not raw.startswith("FBGP"):
        raise ValidationError("DSA Code must start with 'FBGP'.")
    digits = raw[4:]
    if not digits.isdigit() or len(digits) == 0 or len(digits) > 6:
        raise ValidationError("DSA Code numeric part must be between 1 and 6 digits.")
    return f"FBGP{digits}"


def validate_connector_code(value: Optional[str]) -> str:
    """Validate Connector code: starts with FGP followed by up to 6 digits."""
    if not value or not str(value).strip():
        raise ValidationError("Connector Code is required.")
    raw = str(value).strip().upper()
    if not raw.startswith("FGP"):
        raise ValidationError("Connector Code must start with 'FGP'.")
    digits = raw[3:]
    if not digits.isdigit() or len(digits) == 0 or len(digits) > 6:
        raise ValidationError("Connector Code numeric part must be between 1 and 6 digits.")
    return f"FGP{digits}"


def validate_vendor_code(value: Optional[str]) -> Optional[str]:
    """Validate Vendor code: optional, starts with V followed by up to 6 digits."""
    if not value or not str(value).strip():
        return None
    raw = str(value).strip().upper()
    if not raw.startswith("V"):
        raise ValidationError("Vendor Code must start with 'V'.")
    digits = raw[1:]
    if not digits.isdigit() or len(digits) == 0 or len(digits) > 6:
        raise ValidationError("Vendor Code numeric part must be between 1 and 6 digits.")
    return f"V{digits}"


def validate_lead_or_loan_id(value: Optional[str], id_type: str = "ID") -> str:
    """Validate Lead or Loan Application ID: numeric only, up to 6 digits."""
    if not value or not str(value).strip():
        raise ValidationError(f"{id_type} is required for existing customer.")
    cleaned = str(value).strip()
    if not cleaned.isdigit() or len(cleaned) == 0 or len(cleaned) > 6:
        raise ValidationError(f"{id_type} must be numeric and not more than 6 digits.")
    return cleaned


def validate_visit_date(value: Optional[str]) -> str:
    """Validate visit date: format YYYY-MM-DD, not in future, not older than 62 days (2 months)."""
    if not value or not str(value).strip():
        raise ValidationError("Visit Date is required.")
    try:
        v_date = datetime.strptime(str(value).strip(), "%Y-%m-%d").date()
    except ValueError:
        raise ValidationError("Invalid Visit Date format. Use YYYY-MM-DD.")

    today = date.today()
    if v_date > today:
        raise ValidationError("Visit Date cannot be in the future.")

    # Not older than 2 months (approx 62 days)
    two_months_ago = today - timedelta(days=62)
    if v_date < two_months_ago:
        raise ValidationError(f"Visit Date cannot be more than 2 months in the past (earliest allowed: {two_months_ago}).")

    return v_date.isoformat()


@dataclass
class VisitEntry:
    user_role: str
    user_name: str
    user_code: str
    state: str
    cluster: str
    branch: str
    visit_date: str
    visit_type: str
    entity_name: str
    id: Optional[int] = None
    visit_code: Optional[str] = None
    sub_type: Optional[str] = None
    customer_status: Optional[str] = None  # "New Customer" or "Existing Customer"
    id_type: Optional[str] = None          # "Lead ID" or "Loan Application ID"
    entity_code: Optional[str] = None      # ID / DSA Code / Connector Code / Vendor Code
    mobile: Optional[str] = None
    reason: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_timestamp: Optional[str] = None
    photo_data: Optional[str] = None
    status: str = "Logged"
    notes: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    def __post_init__(self):
        # Validate Role
        if self.user_role not in [r.value for r in UserRole]:
            raise ValidationError(f"Invalid User Role '{self.user_role}'. Must be one of: {[r.value for r in UserRole]}")

        # Clean Names
        self.user_name = clean_name(self.user_name, "User Name")
        if self.entity_name:
            self.entity_name = clean_name(self.entity_name, "Entity Name")

        # Validate User Code
        self.user_code = validate_user_code(self.user_code)

        # Validate Date
        self.visit_date = validate_visit_date(self.visit_date)

        # Validate Mobile if present
        if self.mobile:
            self.mobile = validate_mobile(self.mobile, "Mobile number", required=False)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

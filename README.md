# Interactive Visit Tracker & Master Dashboard 🏢📋✨

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interactive, responsive **Field Visit Registration Form & Master Control Dashboard**. Designed for field staff (BDO, BDM, BPM, BCM, CCM, CBM) with real-time GPS geolocation capture, photo verification, dynamic cascading branch hierarchies, multi-visit type generation, and a feature-packed master analytics dashboard with 3D elements, icons, and emojis.

---

## ✨ Highlights & Key Features

### 👤 1. User Details Section
- **Role Selection:** Dropdown with `BDO`, `BDM`, `BPM`, `BCM`, `CCM`, `CBM`.
- **Name Validation:**
  - Numbers are strictly forbidden in name fields.
  - Automatic whitespace cleanup: collapses duplicate spaces into single spaces and auto-trims leading/trailing whitespace.
- **User Code (`FMF` Prefix):**
  - Prefix `FMF` is auto-freezed/pinned in the input field.
  - Only numeric digits allowed after `FMF`, maximum 6 digits (e.g. `FMF123456`).
- **Cascading State, Cluster, and Branch Hierarchy:**
  - Populated from operational branch data across Bihar, Delhi, Gujarat, Haryana, Madhya Pradesh, Rajasthan, and Uttar Pradesh.
  - **Head Office Rule:** If user selects `Head Office` in State, `Head Office` is auto-selected in Cluster and Branch.
  - **Single Option Auto-Select:** If a state has only one cluster (e.g., Gujarat $\rightarrow$ Ahmedabad Cluster, Madhya Pradesh $\rightarrow$ Indore Cluster), it is auto-selected! If a cluster has only one branch, it is auto-selected.

---

### 📅 2. Visit Details & Dynamic Sub-Sections
- **Date Restriction:** User can only select current or past dates, restricted to $\le 2$ months in the past (future dates blocked).
- **Multi-Select Visit Types:**
  - 🏢 `Customer Visit`
  - 🤝 `Partner Visit`
  - 🛠️ `Vendor Visit`
  - 💼 `Business Visit`
  - 🌐 `Other Visit`
  - Users can select multiple types at once. Selecting opens the corresponding sub-section below; deselecting hides and clears its inputs.

#### Sub-Section Details:
1. **🏢 Customer Visit:**
   - **Customer Status:** `New Customer` or `Existing Customer`.
   - **If Existing Customer:** Select ID Type (`Lead ID` or `Loan Application ID`) and enter up to 6 numeric digits only.
   - Customer Name (no numbers, auto-trim spaces).
   - Customer Mobile Number (exactly 10 numeric digits).
   - Reason for Visit (`Onboarding visit`, `Regular visit`, `Document related visit`).
   - Address details (optional).
   - Upload Photo proof with instant thumbnail preview.
   - 📍 GPS Lat/Long & Timestamp capture with interactive map pin.

2. **🤝 Partner Visit:**
   - Select `DSA visit` and/or `Connector Visit` (can select both!).
   - **DSA visit:** DSA Name, `FBGP` auto-freezed code (up to 6 digits), 10-digit mobile, Reason (`Onboarding visit`, `Regular visit`, `Document related visit`, `Customer related visit`), Address, Photo, Lat/Long + Timestamp.
   - **Connector Visit:** Connector Name, `FGP` auto-freezed code (up to 6 digits), 10-digit mobile, Reason, Address, Photo, Lat/Long + Timestamp.

3. **🛠️ Vendor Visit:**
   - Select `Technical Vendor` and/or `Legal Vendor` (can select both!).
   - Vendor Name, optional `V` prefixed code (up to 6 digits), 10-digit mobile, Reason, Address, Photo, Lat/Long + Timestamp.

4. **💼 Business Visit:**
   - Business Name, 10-digit mobile, Reason, Address, Photo, Lat/Long + Timestamp.

5. **🌐 Other Visit:**
   - Person/Entity Name, 10-digit mobile, Reason, Address, Photo, Lat/Long + Timestamp.

---

### 🚀 3. Multi-Row Generation on Submit
- When a user submits the form with multiple visit types selected (e.g. Customer Visit + Partner Visit with both DSA and Connector), the system automatically generates **distinct rows** in the database:
  - Row 1: Customer Visit record
  - Row 2: Partner Visit (DSA) record
  - Row 3: Partner Visit (Connector) record
- All rows share the user's details, role, code, branch, and visit date with individual timestamps, GPS coordinates, and photos.

---

### 📊 4. Master Control Dashboard
- **Dual User Mode:**
  - **Normal Users:** Access to clean, focused Visit Registration Form.
  - **Master Users:** Access to the Form + Full Master Control Dashboard.
- **Top Advanced Filter Bar:**
  - Date Range pickers (`From Date`, `To Date`) with Quick Filter chips (`Today`, `Yesterday`, `Last 7 Days`, `Last 30 Days`, `Last 2 Months`, `All Dates`).
  - Cascading filters for State, Cluster, Branch.
  - User Role filter (`BDO`, `BDM`, `BPM`, `BCM`, `CCM`, `CBM`).
  - Visit Type filter.
  - Keyword search across Staff Name, User Code, Entity Name, Code, Mobile.
  - **Dynamic Visits Counter:** Live counter updates as filters are applied.
- **3D Inspection Voucher (Eye View 👁️):**
  - Full modal showing officer details, branch hierarchy, client information, uploaded photo, and embedded interactive OpenStreetMap with pin.
  - Print button for physical inspection reports.
- **Master Edit (✏️):**
  - Update Reason, Mobile, Address, Status, and Master Notes.
- **CSV Export:**
  - One-click export of filtered records including direct Google Maps location links.

---

## 🚀 Quick Start

### 1. Launch Server
```bash
python run.py
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser.

- To access the Field Registration Form: `http://localhost:8080` (or click `📝 Field Visit Form`)
- To access the Master Dashboard: click `📊 Master Dashboard` (or `http://localhost:8080/?view=dashboard`)

### 2. Run Test Suite
```bash
python -m unittest discover tests -v
```

### 3. Command Line Interface (CLI)
```bash
# Seed initial demo visits
python run.py seed

# View Master Statistics
python run.py stats

# List visits with filters
python run.py list --role BDO --state Bihar

# Export database to CSV
python run.py export -o field_visits.csv
```

---

## 📄 License
MIT License.

# Visit Tracker 🏢📋

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, enterprise-ready **Visitor Management & Visit Tracker System**. Built with zero external dependencies—leveraging Python's robust standard library, SQLite database engine, and a modern responsive Single Page Application (SPA).

---

## ✨ Features

- **⚡ Zero External Dependencies:** Runs instantly on any machine with Python 3.9+ without needing `pip install` or complex build tools.
- **🖥️ Modern Web Dashboard:** Real-time KPI counters, visitor check-in modal, date/status filtering, debounced search, and printable badges.
- **🏷️ Digital & Printable Security Passes:** Instant visitor pass generation with unique pass codes, QR-style badge rendering, and print stylesheet.
- **🚨 Emergency Evacuation Roll Call:** One-click instant view and printable manifest of all active personnel currently on premises.
- **🔄 Complete Visit Lifecycle:**
  - Walk-in Instant Check-in (finds/creates visitor and checks in in one step)
  - Pre-scheduled Visit Appointments
  - Check-in validation (prevents double check-ins or checking in cancelled visits)
  - Check-out validation with automated duration calculation
  - Visit cancellation with audit reason recording
- **📊 Analytics & Export:** Real-time metrics by category, host department, average duration, and one-click CSV report export.
- **💻 CLI & Automation:** Full terminal interface for automated check-ins, roll calls, and headless server environments.
- **🛡️ Audit Trail:** Built-in audit logging recording timestamps and details for all visitor lifecycle events.
- **🧪 Comprehensive Test Suite:** 38 unit, integration, database, and API tests with 100% test pass rate.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/IG-Creation/VISIT_TRACKER.git
cd VISIT_TRACKER
```

### 2. Launch the Web Dashboard
```bash
python run.py
```
Open your browser at **[http://localhost:8080](http://localhost:8080)**.

To customize the port or host:
```bash
python run.py serve --host 0.0.0.0 --port 9000
```

---

## 💻 Command Line Interface (CLI)

The application provides a command-line interface for terminal workflows:

| Command | Description | Example |
|---|---|---|
| `serve` | Start Web UI & REST API | `python run.py serve -p 8080` |
| `seed` | Populate initial demo hosts & visitors | `python run.py seed` |
| `walkin` | Instant check-in for walk-in visitor | `python run.py walkin --name "Alice Smith" --purpose "Meeting" --company "Acme"` |
| `checkin` | Check in a scheduled visit | `python run.py checkin VT-261103-A1B2C` |
| `checkout` | Check out an active visitor | `python run.py checkout VT-261103-A1B2C` |
| `cancel` | Cancel scheduled visit | `python run.py cancel VT-261103-A1B2C --reason "Postponed"` |
| `list` | List visits with optional filters | `python run.py list --status CHECKED_IN --limit 20` |
| `active` | Emergency Roll Call (on-site visitors) | `python run.py active` |
| `stats` | Display system overview metrics | `python run.py stats` |
| `export` | Export visits database to CSV | `python run.py export -o report.csv` |

---

## 🌐 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & service metadata |
| `GET` | `/api/stats` | Dashboard KPI metrics and analytics |
| `GET` | `/api/visits` | List & filter visits (`status`, `query`, `date`, `host_id`) |
| `POST` | `/api/visits` | Schedule a visit |
| `POST` | `/api/visits/walkin` | Walk-in visitor creation & immediate check-in |
| `GET` | `/api/visits/<id_or_code>` | Retrieve visit details |
| `POST` | `/api/visits/<id_or_code>/checkin` | Check in visitor |
| `POST` | `/api/visits/<id_or_code>/checkout` | Check out visitor |
| `POST` | `/api/visits/<id_or_code>/cancel` | Cancel visit |
| `GET` | `/api/active` | Emergency roll call of active visitors |
| `GET` | `/api/visitors` | List & search registered visitors |
| `POST` | `/api/visitors` | Create new visitor record |
| `GET` | `/api/hosts` | List hosts and departments |
| `POST` | `/api/hosts` | Register new host |
| `GET` | `/api/locations` | List facility locations & checkpoints |
| `GET` | `/api/audit` | Retrieve audit trail logs |
| `GET` | `/api/export` | Download complete visits dataset as CSV |

---

## 🧪 Running Tests

The test suite covers models, validation, database transactions, service layer business rules, CLI commands, and REST APIs.

Run tests using Python's built-in `unittest`:
```bash
python -m unittest discover tests -v
```

---

## 📂 Project Structure

```
VISIT_TRACKER/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions automated testing workflow
├── visit_tracker/
│   ├── __init__.py            # Package root & exports
│   ├── __main__.py            # Module entry point (python -m visit_tracker)
│   ├── models.py              # Data classes, enums & input validation
│   ├── db.py                  # SQLite schema, transactions & seed data
│   ├── service.py             # Business logic layer
│   ├── server.py              # Threaded HTTP server & REST API dispatcher
│   ├── cli.py                 # Command line interface commands
│   └── web/                   # Responsive Web Dashboard (SPA)
│       ├── index.html         # User interface & modals
│       ├── styles.css         # Modern styles & print layout
│       └── app.js             # Client logic & asynchronous API calls
├── tests/
│   ├── __init__.py
│   ├── test_models.py         # Unit tests for models & validation
│   ├── test_db.py             # Database constraints, indexes, rollbacks
│   ├── test_service.py        # Business logic, check-in/out, roll call
│   ├── test_api.py            # API routing, error codes & responses
│   └── test_cli.py            # CLI commands & outputs
├── run.py                     # Convenience root launcher
├── requirements.txt           # Dependency declaration (zero external requirements)
├── .gitignore                 # SQLite, Python & OS exclusions
└── README.md                  # System documentation
```

---

## 📄 License

This project is licensed under the MIT License.

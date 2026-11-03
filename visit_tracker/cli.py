"""Command Line Interface (CLI) for Visit Tracker."""

from __future__ import annotations
import argparse
import sys
from typing import Optional, List

from .db import Database, DEFAULT_DB_PATH
from .service import TrackerService
from .server import run_server


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="visit_tracker",
        description="Enterprise Visit Tracker CLI & Web Server"
    )
    parser.add_argument("--db", default=DEFAULT_DB_PATH, help="Path to SQLite database file")

    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # serve command
    serve_parser = subparsers.add_parser("serve", help="Start the Web UI and REST API server")
    serve_parser.add_argument("--host", default="127.0.0.1", help="Host interface to bind (default: 127.0.0.1)")
    serve_parser.add_argument("-p", "--port", type=int, default=8080, help="Port to listen on (default: 8080)")

    # walkin command
    walkin_parser = subparsers.add_parser("walkin", help="Perform walk-in visitor check-in")
    walkin_parser.add_argument("--name", required=True, help="Visitor full name")
    walkin_parser.add_argument("--purpose", required=True, help="Purpose of visit")
    walkin_parser.add_argument("--company", help="Visitor company")
    walkin_parser.add_argument("--email", help="Visitor email")
    walkin_parser.add_argument("--phone", help="Visitor phone number")
    walkin_parser.add_argument("--host-id", type=int, help="Host ID")

    # checkin command
    checkin_parser = subparsers.add_parser("checkin", help="Check in an existing visit")
    checkin_parser.add_argument("identifier", help="Visit ID or Visit Pass Code")
    checkin_parser.add_argument("--badge", help="Custom badge number")

    # checkout command
    checkout_parser = subparsers.add_parser("checkout", help="Check out an active visit")
    checkout_parser.add_argument("identifier", help="Visit ID or Visit Pass Code")

    # cancel command
    cancel_parser = subparsers.add_parser("cancel", help="Cancel a scheduled visit")
    cancel_parser.add_argument("identifier", help="Visit ID or Visit Pass Code")
    cancel_parser.add_argument("--reason", default="", help="Reason for cancellation")

    # list command
    list_parser = subparsers.add_parser("list", help="List visits")
    list_parser.add_argument("--status", choices=["SCHEDULED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"], help="Filter by status")
    list_parser.add_argument("--query", "-q", help="Search query")
    list_parser.add_argument("--limit", type=int, default=20, help="Max records to display")

    # active command
    subparsers.add_parser("active", help="Show currently active on-site visitors (Roll Call)")

    # stats command
    subparsers.add_parser("stats", help="Display overview statistics and KPI metrics")

    # export command
    export_parser = subparsers.add_parser("export", help="Export visits to CSV file")
    export_parser.add_argument("-o", "--output", default="visits_export.csv", help="Output file path")

    # seed command
    subparsers.add_parser("seed", help="Seed default demo hosts and visitors")

    return parser


def main(argv: Optional[List[str]] = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if not args.command:
        parser.print_help()
        return 0

    db = Database(args.db)
    service = TrackerService(db)

    try:
        if args.command == "serve":
            run_server(host=args.host, port=args.port, db=db)

        elif args.command == "walkin":
            visit = service.walkin_checkin(
                visitor_name=args.name,
                purpose=args.purpose,
                visitor_company=args.company,
                visitor_email=args.email,
                visitor_phone=args.phone,
                host_id=args.host_id
            )
            print(f"[OK] Walk-in checked in successfully!")
            print(f"  Visit Code: {visit.visit_code}")
            print(f"  Visitor:    {visit.visitor_name} ({visit.visitor_company or 'Individual'})")
            print(f"  Badge:      {visit.badge_number}")
            print(f"  Time:       {visit.checkin_time}")

        elif args.command == "checkin":
            visit = service.checkin_visit(args.identifier, badge_number=args.badge)
            print(f"[OK] Visit {visit.visit_code} checked in at {visit.checkin_time} (Badge: {visit.badge_number})")

        elif args.command == "checkout":
            visit = service.checkout_visit(args.identifier)
            print(f"[OK] Visit {visit.visit_code} checked out at {visit.checkout_time}")

        elif args.command == "cancel":
            visit = service.cancel_visit(args.identifier, reason=args.reason)
            print(f"[OK] Visit {visit.visit_code} cancelled.")

        elif args.command == "list":
            visits = service.list_visits(status=args.status, query=args.query, limit=args.limit)
            if not visits:
                print("No visits found.")
            else:
                print(f"{'CODE':<16} {'STATUS':<12} {'VISITOR':<20} {'COMPANY':<18} {'PURPOSE'}")
                print("-" * 80)
                for v in visits:
                    v_name = (v.visitor_name or "Unknown")[:19]
                    v_comp = (v.visitor_company or "-")[:17]
                    print(f"{v.visit_code:<16} {v.status.value:<12} {v_name:<20} {v_comp:<18} {v.purpose}")

        elif args.command == "active":
            active = service.get_active_visitors()
            if not active:
                print("No visitors currently on-site.")
            else:
                print(f"[EMERGENCY ROLL CALL] {len(active)} VISITOR(S) ON-SITE")
                print(f"{'CODE':<16} {'BADGE':<10} {'VISITOR':<20} {'CHECK-IN TIME':<20} {'HOST'}")
                print("-" * 80)
                for v in active:
                    print(f"{v.visit_code:<16} {v.badge_number or '-':<10} {v.visitor_name:<20} {v.checkin_time or '-':<20} {v.host_name or 'Unassigned'}")

        elif args.command == "stats":
            stats = service.get_stats()
            print("================ VISIT TRACKER STATS ================")
            print(f"  Total Visits in System:    {stats['total_visits']}")
            print(f"  Currently Active On-Site:  {stats['active_now']}")
            print(f"  Today's Total Visits:      {stats['today_total']}")
            print(f"  Today's Check-ins:         {stats['today_checkins']}")
            print(f"  Today's Check-outs:        {stats['today_checkouts']}")
            print(f"  Scheduled / Pending:       {stats['today_scheduled']}")
            print(f"  Average Visit Duration:    {stats['avg_duration_minutes']} min")
            print("=====================================================")

        elif args.command == "export":
            csv_content = service.export_visits_csv()
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(csv_content)
            print(f"[OK] Exported visits to {args.output}")

        elif args.command == "seed":
            db.seed_initial_data()
            print("[OK] Demo hosts and visitors seeded successfully.")

        return 0

    except Exception as e:
        print(f"[ERROR] {str(e)}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())

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
        description="Interactive Visit Tracker CLI & Web Server"
    )
    parser.add_argument("--db", default=DEFAULT_DB_PATH, help="Path to SQLite database file")

    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # serve command
    serve_parser = subparsers.add_parser("serve", help="Start the Web UI and REST API server")
    serve_parser.add_argument("--host", default="127.0.0.1", help="Host interface (default: 127.0.0.1)")
    serve_parser.add_argument("-p", "--port", type=int, default=8080, help="Port (default: 8080)")

    # list command
    list_parser = subparsers.add_parser("list", help="List logged field visits")
    list_parser.add_argument("--role", help="Filter by user role (BDO, BDM, etc.)")
    list_parser.add_argument("--type", help="Filter by visit type")
    list_parser.add_argument("--state", help="Filter by state")
    list_parser.add_argument("--query", "-q", help="Search query")
    list_parser.add_argument("--limit", type=int, default=20, help="Max records")

    # stats command
    subparsers.add_parser("stats", help="Display overview statistics and KPI metrics")

    # export command
    export_parser = subparsers.add_parser("export", help="Export visits to CSV file")
    export_parser.add_argument("-o", "--output", default="visits_export.csv", help="Output file path")

    # seed command
    subparsers.add_parser("seed", help="Seed default demo visits matching branch hierarchy")

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

        elif args.command == "list":
            visits = service.list_visits(
                user_role=args.role,
                visit_type=args.type,
                state=args.state,
                search_query=args.query,
                limit=args.limit
            )
            if not visits:
                print("No visits found.")
            else:
                print(f"{'CODE':<16} {'DATE':<12} {'ROLE':<6} {'OFFICER':<18} {'BRANCH':<18} {'TYPE':<16} {'ENTITY'}")
                print("-" * 95)
                for v in visits:
                    v_name = (v.user_name or "")[:17]
                    v_branch = (v.branch or "")[:17]
                    v_type = (v.visit_type or "")[:15]
                    print(f"{v.visit_code:<16} {v.visit_date:<12} {v.user_role:<6} {v_name:<18} {v_branch:<18} {v_type:<16} {v.entity_name}")

        elif args.command == "stats":
            stats = service.get_stats()
            print("================ VISIT TRACKER MASTER STATS ================")
            print(f"  Total Visits in System:    {stats['total_visits']}")
            print(f"  Today's Visits:            {stats['today_visits']}")
            print(f"  Active Staff Members:      {stats['active_users']}")
            print(f"  Unique Branches Logged:    {stats['unique_branches']}")
            print("  Visits by Type:")
            for k, val in stats.get("by_type", {}).items():
                print(f"    - {k}: {val}")
            print("  Visits by Role:")
            for k, val in stats.get("by_role", {}).items():
                print(f"    - {k}: {val}")
            print("============================================================")

        elif args.command == "export":
            csv_content = service.export_visits_csv()
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(csv_content)
            print(f"[OK] Exported visits to {args.output}")

        elif args.command == "seed":
            service.seed_demo_visits()
            print("[OK] Demo visits seeded successfully.")

        return 0

    except Exception as e:
        print(f"[ERROR] {str(e)}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())

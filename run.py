#!/usr/bin/env python3
"""Convenience launcher for Visit Tracker Web Application."""

import sys
from visit_tracker.cli import main

if __name__ == "__main__":
    # If no arguments provided, default to starting the server
    if len(sys.argv) == 1:
        sys.argv.append("serve")
    sys.exit(main())

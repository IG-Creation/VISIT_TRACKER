"""Executable entry point when running `python -m visit_tracker`."""

import sys
from .cli import main

if __name__ == "__main__":
    sys.exit(main())

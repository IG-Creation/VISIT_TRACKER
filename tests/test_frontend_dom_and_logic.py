import os
import re
import unittest
from html.parser import HTMLParser

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class SimpleHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.ids = set()
        self.classes = set()
        self.buttons = []
        self.inputs = []
        self.selects = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        self.tags.append((tag, attr_dict))
        if "id" in attr_dict:
            self.ids.add(attr_dict["id"])
        if "class" in attr_dict:
            for c in attr_dict["class"].split():
                self.classes.add(c)
        if tag == "button":
            self.buttons.append(attr_dict)
        elif tag == "input":
            self.inputs.append(attr_dict)
        elif tag == "select":
            self.selects.append(attr_dict)


class TestFrontendDOMAndLogic(unittest.TestCase):
    def setUp(self):
        self.index_path = os.path.join(ROOT_DIR, "index.html")
        self.app_js_path = os.path.join(ROOT_DIR, "app.js")
        self.styles_css_path = os.path.join(ROOT_DIR, "styles.css")
        with open(self.index_path, "r", encoding="utf-8") as f:
            self.html_content = f.read()
        with open(self.app_js_path, "r", encoding="utf-8") as f:
            self.js_content = f.read()
        with open(self.styles_css_path, "r", encoding="utf-8") as f:
            self.css_content = f.read()

        self.parser = SimpleHTMLParser()
        self.parser.feed(self.html_content)

    def test_mode_switcher_buttons_exist(self):
        self.assertIn("btn-mode-form", self.parser.ids)
        self.assertIn("btn-mode-dashboard", self.parser.ids)
        self.assertIn("view-form", self.parser.ids)
        self.assertIn("view-dashboard", self.parser.ids)

        # Check that master dashboard button does NOT have a lock badge in HTML
        btn_match = re.search(r'<button\s+id="btn-mode-dashboard"[^>]*>(.*?)</button>', self.html_content, re.DOTALL)
        self.assertIsNotNone(btn_match)
        btn_inner = btn_match.group(1)
        self.assertNotIn("master-lock-badge", btn_inner)
        self.assertIn("Master Dashboard", btn_inner)

    def test_set_mode_logic_in_app_js(self):
        # setMode("dashboard") must NOT be guarded by !isMasterAuthenticated()
        self.assertNotIn("if (!isMasterAuthenticated())", self.js_content)
        # setMode should directly show viewDashboard and hide viewForm
        self.assertIn('viewDashboard.style.display = "block"', self.js_content)
        self.assertIn('viewForm.style.display = "none"', self.js_content)
        self.assertIn("loadDashboardData()", self.js_content)

    def test_modal_css_rules_guarantee_visibility(self):
        # styles.css must define active, display: flex, and display:flex as visible
        self.assertIn(".modal-overlay.active", self.css_content)
        self.assertIn('.modal-overlay[style*="display: flex"]', self.css_content)
        self.assertIn("opacity: 1 !important", self.css_content)
        self.assertIn("pointer-events: auto !important", self.css_content)

    def test_open_modal_and_close_modal_defined_and_used(self):
        self.assertIn("function openModal(modal)", self.js_content)
        self.assertIn("function closeModal(modal)", self.js_content)
        # Check all key modals are present in HTML
        required_modals = [
            "eye-view-modal",
            "edit-modal",
            "send-email-modal",
            "live-camera-modal",
            "cloud-sync-modal",
            "submit-success-modal"
        ]
        for m in required_modals:
            self.assertIn(m, self.parser.ids, f"Modal {m} missing from index.html")

    def test_master_visits_and_filtered_visits_separation(self):
        # Check that currentVisits variable was replaced with masterVisitsCache and currentFilteredVisits
        self.assertNotIn("let currentVisits = []", self.js_content)
        self.assertIn("let masterVisitsCache = []", self.js_content)
        self.assertIn("let currentFilteredVisits = []", self.js_content)
        self.assertIn("function getAllVisitsList()", self.js_content)
        self.assertIn("function getExportVisits()", self.js_content)

    def test_quick_date_chips_exist(self):
        ranges = ["all", "today", "yesterday", "week", "month", "2months"]
        for r in ranges:
            pattern = f'data-range="{r}"'
            self.assertIn(pattern, self.html_content)

    def test_partner_and_vendor_sub_choice_buttons(self):
        partner_buttons = ["btn-partner-dsa", "btn-partner-con", "btn-partner-both"]
        for pb in partner_buttons:
            self.assertIn(pb, self.parser.ids)

        vendor_buttons = ["btn-vendor-tech", "btn-vendor-legal", "btn-vendor-both"]
        for vb in vendor_buttons:
            self.assertIn(vb, self.parser.ids)

    def test_photo_and_location_prefixes_for_all_seven_types(self):
        prefixes = ["cust", "dsa", "con", "vtech", "vlegal", "biz", "oth"]
        for p in prefixes:
            self.assertIn(f"{p}_photo_data", self.parser.ids)
            self.assertIn(f"{p}_lat", self.parser.ids)
            self.assertIn(f"{p}_lon", self.parser.ids)
            self.assertIn(f"{p}_loc_ts", self.parser.ids)
            self.assertIn(f'data-prefix="{p}"', self.html_content)

    def test_export_and_email_buttons_exist(self):
        self.assertIn("btn-export-excel", self.parser.ids)
        self.assertIn("btn-send-mail", self.parser.ids)
        self.assertIn("btn-confirm-send-email", self.parser.ids)
        self.assertIn("btn-open-gmail", self.parser.ids)
        self.assertIn("btn-open-outlook", self.parser.ids)
        self.assertIn("btn-open-mailto", self.parser.ids)
        self.assertIn("btn-copy-field-link", self.parser.ids)

    def test_root_and_web_files_in_sync(self):
        web_index = os.path.join(ROOT_DIR, "visit_tracker", "web", "index.html")
        web_app = os.path.join(ROOT_DIR, "visit_tracker", "web", "app.js")
        web_styles = os.path.join(ROOT_DIR, "visit_tracker", "web", "styles.css")

        with open(web_index, "r", encoding="utf-8") as f:
            self.assertEqual(self.html_content, f.read())
        with open(web_app, "r", encoding="utf-8") as f:
            self.assertEqual(self.js_content, f.read())
        with open(web_styles, "r", encoding="utf-8") as f:
            self.assertEqual(self.css_content, f.read())


if __name__ == "__main__":
    unittest.main()

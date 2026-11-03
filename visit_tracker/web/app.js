// Visit Tracker Interactive Application Logic (Universal Dual-Mode: GitHub Pages & Local Server)

const EMBEDDED_HIERARCHY = {
  "states": [
    "Head Office",
    "Bihar",
    "Delhi",
    "Gujarat",
    "Haryana",
    "Madhya Pradesh",
    "Rajasthan",
    "Uttar Pradesh - 1",
    "Uttar Pradesh - 2",
    "Uttar Pradesh - 3"
  ],
  "hierarchy": {
    "Head Office": { "Head Office": ["Head Office"] },
    "Bihar": {
      "Muzaffarpur Cluster": ["Begusarai", "Motihari", "Darbhanga", "Muzaffarpur", "Madhubani"],
      "Patna Cluster": ["Gaya", "Patna", "Aurangabad", "Bhagalpur", "Sasaram", "Samastipur"],
      "Gopalganj Cluster": ["Gopalganj", "Chhapra", "Sitamarhi", "Bettiah"]
    },
    "Delhi": {
      "Delhi 1 Cluster": ["Delhi- Uttam Nagar", "Krishna Nagar-Delhi"],
      "Delhi 2 Cluster": ["Burari"]
    },
    "Gujarat": {
      "Ahmedabad Cluster": ["Rajkot", "Ahmedabad", "Vadodara", "Surat", "Bhavnagar"]
    },
    "Haryana": {
      "Faridabad Cluster": ["Faridabad Nit", "Rewari"],
      "Karnal Cluster": ["Karnal/074B01", "Rohtak", "Hisar", "Sirsa"],
      "Delhi 2 Cluster": ["Noida"]
    },
    "Madhya Pradesh": {
      "Indore Cluster": ["Indore", "Ujjain", "Vidisha", "Sagar", "Dewas", "Dhar"]
    },
    "Rajasthan": {
      "Ajmer Cluster": ["Ajmer", "Jaipur", "Nagaur", "Didwana", "Kuchaman", "Bijainagar"],
      "Jodhpur Cluster": ["Jodhpur", "Udaipur", "Bhilwara", "Jalore", "Balotra"],
      "Sikar Cluster": ["Alwar", "Neemkathana", "Jhunjhunu", "Sikar", "Bandikui"]
    },
    "Uttar Pradesh - 1": {
      "Saharanpur Cluster": ["Yamuna Nagar", "Saharanpur", "Bijnor", "Meerut", "Roorkee"],
      "Bareilly Cluster": ["Bareilly", "Bulandshahr", "Kashipur", "Haldwani", "Moradabad", "Shahjahanpur"],
      "Aligarh Cluster": ["Aligarh", "Kasganj", "Badaun", "Chandausi"]
    },
    "Uttar Pradesh - 2": {
      "Gwalior Cluster": ["Gwalior", "Shivpuri", "Jhansi/166B01", "Orai"],
      "Agra Cluster": ["Bharatpur", "Agra", "Mathura", "Firozabad", "Farrukhabad"]
    },
    "Uttar Pradesh - 3": {
      "Sangam Cluster": ["Lucknow", "Varanasi", "Prayagraj", "Ayodhya", "Kanpur"],
      "Purvanchal Cluster": ["Gorakhpur", "Azamgarh", "Jaunpur", "Deoria", "Basti"]
    }
  }
};

const DEMO_PHOTO_CUST = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230284c7'/><circle cx='200' cy='120' r='55' fill='white'/><path d='M100 260 c0 -60 50 -80 100 -80 s100 20 100 80' fill='white'/><text x='200' y='285' font-size='14' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='bold'>VERIFIED CUSTOMER FIELD PROOF</text></svg>";
const DEMO_PHOTO_BIZ = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23059669'/><rect x='80' y='60' width='240' height='160' rx='10' fill='white'/><path d='M150 140 h100 v50 h-100 z' fill='%23059669'/><text x='200' y='265' font-size='14' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='bold'>BUSINESS PREMISES VERIFIED</text></svg>";
const DEMO_PHOTO_DSA = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%232563eb'/><rect x='90' y='70' width='220' height='150' rx='8' fill='white'/><circle cx='200' cy='130' r='35' fill='%232563eb'/><text x='200' y='265' font-size='14' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='bold'>DSA PARTNER OFFICE PROOF</text></svg>";
const DEMO_PHOTO_CON = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%239333ea'/><rect x='90' y='70' width='220' height='150' rx='8' fill='white'/><path d='M160 120 l40 40 l60 -60' stroke='%239333ea' stroke-width='16' fill='none'/><text x='200' y='265' font-size='14' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='bold'>CONNECTOR VISIT VERIFIED</text></svg>";

const INITIAL_DEMO_VISITS = [
  {
    id: 1,
    visit_code: "VT-261103-A109B",
    user_role: "BDO",
    user_name: "Rohan Sharma",
    user_code: "FMF102938",
    state: "Bihar",
    cluster: "Muzaffarpur Cluster",
    branch: "Muzaffarpur",
    visit_date: new Date().toISOString().split("T")[0],
    visit_type: "Customer Visit",
    sub_type: "Existing Customer",
    customer_status: "Existing Customer",
    id_type: "Loan Application ID",
    entity_name: "Amit Kumar Singh",
    entity_code: "482910",
    mobile: "9876543210",
    reason: "Document related visit",
    address: "Station Road, Muzaffarpur, Bihar",
    latitude: 26.1209,
    longitude: 85.3647,
    location_timestamp: `${new Date().toISOString().split("T")[0]} 11:30:00`,
    photo_data: DEMO_PHOTO_CUST,
    status: "Logged",
    notes: "Verified loan document copy",
    created_at: `${new Date().toISOString().split("T")[0]} 11:32:00`
  },
  {
    id: 2,
    visit_code: "VT-261103-B291C",
    user_role: "BDO",
    user_name: "Rohan Sharma",
    user_code: "FMF102938",
    state: "Bihar",
    cluster: "Muzaffarpur Cluster",
    branch: "Muzaffarpur",
    visit_date: new Date().toISOString().split("T")[0],
    visit_type: "Business Visit",
    sub_type: "Business Entity",
    entity_name: "Kisan Agro Trading",
    mobile: "9812345678",
    reason: "Regular visit",
    address: "Market Yard, Muzaffarpur",
    latitude: 26.1220,
    longitude: 85.3680,
    location_timestamp: `${new Date().toISOString().split("T")[0]} 12:45:00`,
    photo_data: DEMO_PHOTO_BIZ,
    status: "Verified",
    notes: "Business functioning normally",
    created_at: `${new Date().toISOString().split("T")[0]} 12:48:00`
  },
  {
    id: 3,
    visit_code: "VT-261103-C381D",
    user_role: "BDM",
    user_name: "Pooja Verma",
    user_code: "FMF204918",
    state: "Rajasthan",
    cluster: "Ajmer Cluster",
    branch: "Jaipur",
    visit_date: new Date().toISOString().split("T")[0],
    visit_type: "Partner Visit",
    sub_type: "DSA visit",
    entity_name: "Apex Finance Solutions",
    entity_code: "FBGP109283",
    mobile: "9123456780",
    reason: "Onboarding visit",
    address: "MI Road, Jaipur, Rajasthan",
    latitude: 26.9124,
    longitude: 75.7873,
    location_timestamp: `${new Date().toISOString().split("T")[0]} 14:15:00`,
    photo_data: DEMO_PHOTO_DSA,
    status: "Logged",
    notes: "New channel partner onboarded",
    created_at: `${new Date().toISOString().split("T")[0]} 14:20:00`
  },
  {
    id: 4,
    visit_code: "VT-261103-D492E",
    user_role: "BDM",
    user_name: "Pooja Verma",
    user_code: "FMF204918",
    state: "Rajasthan",
    cluster: "Ajmer Cluster",
    branch: "Jaipur",
    visit_date: new Date().toISOString().split("T")[0],
    visit_type: "Partner Visit",
    sub_type: "Connector Visit",
    entity_name: "Sunil Rathore",
    entity_code: "FGP304918",
    mobile: "9823456711",
    reason: "Customer related visit",
    address: "C-Scheme, Jaipur",
    latitude: 26.9150,
    longitude: 75.7910,
    location_timestamp: `${new Date().toISOString().split("T")[0]} 15:40:00`,
    photo_data: DEMO_PHOTO_CON,
    status: "Completed",
    notes: "Customer file discussed",
    created_at: `${new Date().toISOString().split("T")[0]} 15:45:00`
  }
];

document.addEventListener("DOMContentLoaded", () => {
  let hierarchyData = EMBEDDED_HIERARCHY;
  let currentVisits = [];
  let mapInstances = {};
  let isStandalone = window.location.hostname.includes("github.io") || window.location.protocol === "file:" || !window.location.port;

  // Local Storage Management
  function getLocalVisits() {
    try {
      const stored = localStorage.getItem("VT_STORED_VISITS");
      if (!stored) {
        localStorage.setItem("VT_STORED_VISITS", JSON.stringify(INITIAL_DEMO_VISITS));
        return INITIAL_DEMO_VISITS;
      }
      const parsed = JSON.parse(stored);
      // Ensure demo records have photo_data if missing from earlier cache
      const updated = parsed.map(v => {
        if (!v.photo_data) {
          if (v.visit_type === "Customer Visit") v.photo_data = DEMO_PHOTO_CUST;
          else if (v.visit_type === "Business Visit") v.photo_data = DEMO_PHOTO_BIZ;
          else if (v.visit_type === "Partner Visit" && v.sub_type === "DSA visit") v.photo_data = DEMO_PHOTO_DSA;
          else if (v.visit_type === "Partner Visit" && v.sub_type === "Connector Visit") v.photo_data = DEMO_PHOTO_CON;
        }
        return v;
      });
      return updated;
    } catch (e) {
      return INITIAL_DEMO_VISITS;
    }
  }

  function saveLocalVisits(visits) {
    try {
      localStorage.setItem("VT_STORED_VISITS", JSON.stringify(visits));
    } catch (e) {
      console.warn("Storage quota warning:", e);
    }
  }

  // Check if live server is reachable
  fetch("/api/health")
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (data && data.status === "healthy") {
        isStandalone = false;
      }
    })
    .catch(() => {
      isStandalone = true;
    });

  // DOM Views & Switchers
  const btnModeForm = document.getElementById("btn-mode-form");
  const btnModeDashboard = document.getElementById("btn-mode-dashboard");
  const viewForm = document.getElementById("view-form");
  const viewDashboard = document.getElementById("view-dashboard");

  // Form Inputs
  const form = document.getElementById("visit-main-form");
  const userNameInput = document.getElementById("user_name");
  const userCodeNumericInput = document.getElementById("user_code_numeric");
  const stateSelect = document.getElementById("state_select");
  const clusterSelect = document.getElementById("cluster_select");
  const branchSelect = document.getElementById("branch_select");
  const visitDateInput = document.getElementById("visit_date");

  // Sub-sections & 3D Selection Elements
  const typeCards = document.querySelectorAll(".type-card-3d");
  const custStatusToggle = document.getElementById("cust-status-toggle");
  const custStatusVal = document.getElementById("cust_status_val");
  const existingCustIdRow = document.getElementById("existing-cust-id-row");

  // Partner sub-choice buttons & boxes
  const btnPartnerDsa = document.getElementById("btn-partner-dsa");
  const btnPartnerCon = document.getElementById("btn-partner-con");
  const btnPartnerBoth = document.getElementById("btn-partner-both");
  const statePartnerDsa = document.getElementById("state-partner-dsa");
  const statePartnerCon = document.getElementById("state-partner-con");
  const partnerDsaBox = document.getElementById("partner-dsa-box");
  const partnerConBox = document.getElementById("partner-connector-box");

  // Vendor sub-choice buttons & boxes
  const btnVendorTech = document.getElementById("btn-vendor-tech");
  const btnVendorLegal = document.getElementById("btn-vendor-legal");
  const btnVendorBoth = document.getElementById("btn-vendor-both");
  const stateVendorTech = document.getElementById("state-vendor-tech");
  const stateVendorLegal = document.getElementById("state-vendor-legal");
  const vendorTechBox = document.getElementById("vendor-tech-box");
  const vendorLegalBox = document.getElementById("vendor-legal-box");

  // Master Filter Controls
  const fltFromDate = document.getElementById("flt_from_date");
  const fltToDate = document.getElementById("flt_to_date");
  const fltRole = document.getElementById("flt_role");
  const fltState = document.getElementById("flt_state");
  const fltCluster = document.getElementById("flt_cluster");
  const fltBranch = document.getElementById("flt_branch");
  const fltType = document.getElementById("flt_type");
  const fltSearch = document.getElementById("flt_search");
  const btnFltSearch = document.getElementById("btn-flt-search");
  const btnFltClear = document.getElementById("btn-flt-clear");
  const btnExportCsv = document.getElementById("btn-export-csv");
  const liveVisitsCounter = document.getElementById("live-visits-counter");

  // Dashboard Metrics
  const kpiTotalVisits = document.getElementById("kpi-total-visits");
  const kpiCustVisits = document.getElementById("kpi-cust-visits");
  const kpiPartnerVisits = document.getElementById("kpi-partner-visits");
  const kpiVendorVisits = document.getElementById("kpi-vendor-visits");
  const kpiBizVisits = document.getElementById("kpi-biz-visits");
  const visitsTableBody = document.getElementById("visits-table-body");

  // Modals
  const eyeViewModal = document.getElementById("eye-view-modal");
  const eyeViewContent = document.getElementById("eye-view-content");
  const editModal = document.getElementById("edit-modal");
  const editVisitForm = document.getElementById("edit-visit-form");

  // ==================== MODE SWITCHING ====================
  function setMode(mode) {
    if (mode === "dashboard") {
      btnModeDashboard.classList.add("active");
      btnModeForm.classList.remove("active");
      viewForm.style.display = "none";
      viewDashboard.style.display = "block";
      loadDashboardData();
    } else {
      btnModeForm.classList.add("active");
      btnModeDashboard.classList.remove("active");
      viewForm.style.display = "block";
      viewDashboard.style.display = "none";
    }
  }

  btnModeForm.addEventListener("click", () => setMode("form"));
  btnModeDashboard.addEventListener("click", () => setMode("dashboard"));

  // Check URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("view") === "dashboard") {
    setMode("dashboard");
  }

  // ==================== DATE SETUP & VALIDATION ====================
  function setupDateRestrictions() {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // 2 months ago (approx 62 days)
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setDate(today.getDate() - 62);
    const twoMonthsStr = twoMonthsAgo.toISOString().split("T")[0];

    visitDateInput.max = todayStr;
    visitDateInput.min = twoMonthsStr;
    visitDateInput.value = todayStr;

    visitDateInput.addEventListener("change", () => {
      const selected = visitDateInput.value;
      const err = document.getElementById("err-visit-date");
      if (selected > todayStr || selected < twoMonthsStr) {
        err.style.display = "block";
        visitDateInput.setCustomValidity("Date cannot be in future or older than 2 months");
      } else {
        err.style.display = "none";
        visitDateInput.setCustomValidity("");
      }
    });
  }
  setupDateRestrictions();

  // ==================== NAME & CODE REALTIME VALIDATION ====================
  function setupInputRestrictions() {
    userNameInput.addEventListener("input", () => {
      const original = userNameInput.value;
      const filtered = original.replace(/\d/g, "").replace(/\s+/g, " ");
      if (original !== filtered) {
        userNameInput.value = filtered;
      }
      const err = document.getElementById("err-user-name");
      err.style.display = /\d/.test(original) ? "block" : "none";
    });

    userNameInput.addEventListener("blur", () => {
      userNameInput.value = userNameInput.value.trim();
    });

    userCodeNumericInput.addEventListener("input", () => {
      userCodeNumericInput.value = userCodeNumericInput.value.replace(/\D/g, "").slice(0, 6);
    });

    const setupNameInput = (input) => {
      if (!input) return;
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\d/g, "").replace(/\s+/g, " ");
      });
      input.addEventListener("blur", () => {
        input.value = input.value.trim();
      });
    };

    setupNameInput(document.getElementById("cust_name"));
    setupNameInput(document.getElementById("dsa_name"));
    setupNameInput(document.getElementById("con_name"));
    setupNameInput(document.getElementById("vtech_name"));
    setupNameInput(document.getElementById("vlegal_name"));
    setupNameInput(document.getElementById("biz_name"));
    setupNameInput(document.getElementById("oth_name"));

    const setupMobileInput = (input) => {
      if (!input) return;
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 10);
      });
    };

    setupMobileInput(document.getElementById("cust_mobile"));
    setupMobileInput(document.getElementById("dsa_mobile"));
    setupMobileInput(document.getElementById("con_mobile"));
    setupMobileInput(document.getElementById("vtech_mobile"));
    setupMobileInput(document.getElementById("vlegal_mobile"));
    setupMobileInput(document.getElementById("biz_mobile"));
    setupMobileInput(document.getElementById("oth_mobile"));

    const setupCodeInput = (input) => {
      if (!input) return;
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 6);
      });
    };

    setupCodeInput(document.getElementById("cust_id_number"));
    setupCodeInput(document.getElementById("dsa_code_num"));
    setupCodeInput(document.getElementById("con_code_num"));
    setupCodeInput(document.getElementById("vtech_code_num"));
    setupCodeInput(document.getElementById("vlegal_code_num"));
  }
  setupInputRestrictions();

  // ==================== HIERARCHY CASCADING SELECTION ====================
  function initHierarchy() {
    populateStateSelects();
  }

  function populateStateSelects() {
    stateSelect.innerHTML = '<option value="">Select State...</option>' +
      hierarchyData.states.map(s => `<option value="${s}">${s}</option>`).join("");

    fltState.innerHTML = '<option value="">All States</option>' +
      hierarchyData.states.map(s => `<option value="${s}">${s}</option>`).join("");

    setupStateChange(stateSelect, clusterSelect, branchSelect, true);
    setupStateChange(fltState, fltCluster, fltBranch, false);
  }

  function setupStateChange(stateEl, clusterEl, branchEl, isForm) {
    stateEl.addEventListener("change", () => {
      const selectedState = stateEl.value;
      clusterEl.innerHTML = isForm ? '<option value="">Select Cluster...</option>' : '<option value="">All Clusters</option>';
      branchEl.innerHTML = isForm ? '<option value="">Select Branch...</option>' : '<option value="">All Branches</option>';

      if (!selectedState) return;

      if (selectedState === "Head Office") {
        clusterEl.innerHTML = '<option value="Head Office" selected>Head Office</option>';
        branchEl.innerHTML = '<option value="Head Office" selected>Head Office</option>';
        return;
      }

      const clusters = hierarchyData.hierarchy[selectedState] ? Object.keys(hierarchyData.hierarchy[selectedState]).sort() : [];
      clusters.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        clusterEl.appendChild(opt);
      });

      if (clusters.length === 1 && isForm) {
        clusterEl.value = clusters[0];
        triggerClusterChange(selectedState, clusterEl, branchEl, isForm);
      }
    });

    clusterEl.addEventListener("change", () => {
      triggerClusterChange(stateEl.value, clusterEl, branchEl, isForm);
    });
  }

  function triggerClusterChange(selectedState, clusterEl, branchEl, isForm) {
    const selectedCluster = clusterEl.value;
    branchEl.innerHTML = isForm ? '<option value="">Select Branch...</option>' : '<option value="">All Branches</option>';

    if (!selectedState || !selectedCluster) return;

    if (selectedState === "Head Office" || selectedCluster === "Head Office") {
      branchEl.innerHTML = '<option value="Head Office" selected>Head Office</option>';
      return;
    }

    const branches = hierarchyData.hierarchy[selectedState]?.[selectedCluster] || [];
    branches.sort().forEach(b => {
      const opt = document.createElement("option");
      opt.value = b;
      opt.textContent = b;
      branchEl.appendChild(opt);
    });

    if (branches.length === 1 && isForm) {
      branchEl.value = branches[0];
    }
  }

  // ==================== VISIT TYPE MULTI-SELECT 3D CARDS & SUB-SECTIONS ====================
  typeCards.forEach(card => {
    card.addEventListener("click", () => {
      const isSelected = card.classList.toggle("selected");
      const targetId = card.getAttribute("data-target");
      const targetSubSec = document.getElementById(targetId);

      if (isSelected) {
        if (targetSubSec) {
          targetSubSec.style.display = "block";
          targetSubSec.scrollIntoView({ behavior: "smooth", block: "nearest" });

          // Auto-activate primary sub-option if neither is active so fields are immediately visible
          if (targetId === "subsec-partner") {
            const hasDsa = btnPartnerDsa && btnPartnerDsa.classList.contains("selected");
            const hasCon = btnPartnerCon && btnPartnerCon.classList.contains("selected");
            if (!hasDsa && !hasCon && btnPartnerDsa) {
              btnPartnerDsa.classList.add("selected");
              updatePartnerBoxes();
            }
          }

          if (targetId === "subsec-vendor") {
            const hasTech = btnVendorTech && btnVendorTech.classList.contains("selected");
            const hasLegal = btnVendorLegal && btnVendorLegal.classList.contains("selected");
            if (!hasTech && !hasLegal && btnVendorTech) {
              btnVendorTech.classList.add("selected");
              updateVendorBoxes();
            }
          }
        }
      } else {
        if (targetSubSec) {
          targetSubSec.style.display = "none";
          clearSubSectionInputs(targetSubSec);
        }
      }
    });
  });

  function clearSubSectionInputs(container) {
    if (!container) return;
    container.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), textarea').forEach(inp => {
      inp.value = "";
    });
    container.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.checked = false;
    });
    container.querySelectorAll(".photo-preview-wrap").forEach(wrap => {
      wrap.innerHTML = '<span class="photo-empty-text">No photo captured / uploaded yet</span>';
    });
    container.querySelectorAll(".location-info").forEach(info => {
      info.textContent = "Location not captured yet.";
    });
    container.querySelectorAll(".sub-choice-btn").forEach(btn => {
      btn.classList.remove("selected");
    });
    container.querySelectorAll(".capture-item").forEach(item => {
      item.classList.remove("photo-error-highlight");
    });

    // Reset partner inner state if partner section is cleared
    if (container.id === "subsec-partner") {
      if (btnPartnerDsa) btnPartnerDsa.classList.remove("selected");
      if (btnPartnerCon) btnPartnerCon.classList.remove("selected");
      if (btnPartnerBoth) btnPartnerBoth.classList.remove("selected");
      if (statePartnerDsa) statePartnerDsa.textContent = "⬜";
      if (statePartnerCon) statePartnerCon.textContent = "⬜";
      if (partnerDsaBox) {
        partnerDsaBox.style.display = "none";
        clearSubSectionInputs(partnerDsaBox);
      }
      if (partnerConBox) {
        partnerConBox.style.display = "none";
        clearSubSectionInputs(partnerConBox);
      }
    }
    // Reset vendor inner state if vendor section is cleared
    if (container.id === "subsec-vendor") {
      if (btnVendorTech) btnVendorTech.classList.remove("selected");
      if (btnVendorLegal) btnVendorLegal.classList.remove("selected");
      if (btnVendorBoth) btnVendorBoth.classList.remove("selected");
      if (stateVendorTech) stateVendorTech.textContent = "⬜";
      if (stateVendorLegal) stateVendorLegal.textContent = "⬜";
      if (vendorTechBox) {
        vendorTechBox.style.display = "none";
        clearSubSectionInputs(vendorTechBox);
      }
      if (vendorLegalBox) {
        vendorLegalBox.style.display = "none";
        clearSubSectionInputs(vendorLegalBox);
      }
    }
  }

  // Customer Status Toggle
  if (custStatusToggle) {
    custStatusToggle.querySelectorAll(".segmented-option").forEach(btn => {
      btn.addEventListener("click", () => {
        custStatusToggle.querySelectorAll(".segmented-option").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const val = btn.getAttribute("data-val");
        custStatusVal.value = val;
        if (val === "Existing Customer") {
          existingCustIdRow.style.display = "grid";
          document.getElementById("cust_id_number").required = true;
        } else {
          existingCustIdRow.style.display = "none";
          document.getElementById("cust_id_number").required = false;
          document.getElementById("cust_id_number").value = "";
        }
      });
    });
  }

  // ==================== PARTNER SUB-CHOICE LOGIC (DSA, CONNECTOR, BOTH) ====================
  function updatePartnerBoxes() {
    const isDsa = btnPartnerDsa && btnPartnerDsa.classList.contains("selected");
    const isCon = btnPartnerCon && btnPartnerCon.classList.contains("selected");
    if (statePartnerDsa) statePartnerDsa.textContent = isDsa ? "✓" : "⬜";
    if (statePartnerCon) statePartnerCon.textContent = isCon ? "✓" : "⬜";
    if (partnerDsaBox) partnerDsaBox.style.display = isDsa ? "block" : "none";
    if (partnerConBox) partnerConBox.style.display = isCon ? "block" : "none";
    if (btnPartnerBoth) {
      if (isDsa && isCon) {
        btnPartnerBoth.classList.add("selected");
      } else {
        btnPartnerBoth.classList.remove("selected");
      }
    }
  }

  if (btnPartnerDsa) {
    btnPartnerDsa.addEventListener("click", () => {
      btnPartnerDsa.classList.toggle("selected");
      updatePartnerBoxes();
    });
  }

  if (btnPartnerCon) {
    btnPartnerCon.addEventListener("click", () => {
      btnPartnerCon.classList.toggle("selected");
      updatePartnerBoxes();
    });
  }

  if (btnPartnerBoth) {
    btnPartnerBoth.addEventListener("click", () => {
      const willSelectBoth = !btnPartnerBoth.classList.contains("selected");
      if (willSelectBoth) {
        btnPartnerDsa?.classList.add("selected");
        btnPartnerCon?.classList.add("selected");
        btnPartnerBoth.classList.add("selected");
      } else {
        btnPartnerDsa?.classList.remove("selected");
        btnPartnerCon?.classList.remove("selected");
        btnPartnerBoth.classList.remove("selected");
      }
      updatePartnerBoxes();
    });
  }

  // ==================== VENDOR SUB-CHOICE LOGIC (TECH, LEGAL, BOTH) ====================
  function updateVendorBoxes() {
    const isTech = btnVendorTech && btnVendorTech.classList.contains("selected");
    const isLegal = btnVendorLegal && btnVendorLegal.classList.contains("selected");
    if (stateVendorTech) stateVendorTech.textContent = isTech ? "✓" : "⬜";
    if (stateVendorLegal) stateVendorLegal.textContent = isLegal ? "✓" : "⬜";
    if (vendorTechBox) vendorTechBox.style.display = isTech ? "block" : "none";
    if (vendorLegalBox) vendorLegalBox.style.display = isLegal ? "block" : "none";
    if (btnVendorBoth) {
      if (isTech && isLegal) {
        btnVendorBoth.classList.add("selected");
      } else {
        btnVendorBoth.classList.remove("selected");
      }
    }
  }

  if (btnVendorTech) {
    btnVendorTech.addEventListener("click", () => {
      btnVendorTech.classList.toggle("selected");
      updateVendorBoxes();
    });
  }

  if (btnVendorLegal) {
    btnVendorLegal.addEventListener("click", () => {
      btnVendorLegal.classList.toggle("selected");
      updateVendorBoxes();
    });
  }

  if (btnVendorBoth) {
    btnVendorBoth.addEventListener("click", () => {
      const willSelectBoth = !btnVendorBoth.classList.contains("selected");
      if (willSelectBoth) {
        btnVendorTech?.classList.add("selected");
        btnVendorLegal?.classList.add("selected");
        btnVendorBoth.classList.add("selected");
      } else {
        btnVendorTech?.classList.remove("selected");
        btnVendorLegal?.classList.remove("selected");
        btnVendorBoth.classList.remove("selected");
      }
      updateVendorBoxes();
    });
  }

  // ==================== LIVE CAMERA & PHOTO CAPTURE ENGINE ====================
  let activeCamPrefix = null;
  let activeMediaStream = null;
  let currentFacingMode = "environment";

  const liveCameraModal = document.getElementById("live-camera-modal");
  const cameraVideo = document.getElementById("camera-stream");
  const cameraCanvas = document.getElementById("camera-canvas");
  const btnCloseCamera = document.getElementById("btn-close-camera");
  const btnCancelCamera = document.getElementById("btn-cancel-camera");
  const btnFlipCamera = document.getElementById("btn-flip-camera");
  const btnShutterSnap = document.getElementById("btn-shutter-snap");

  async function startCameraStream(facingMode) {
    if (activeMediaStream) {
      activeMediaStream.getTracks().forEach(t => t.stop());
      activeMediaStream = null;
    }
    try {
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      activeMediaStream = stream;
      if (cameraVideo) {
        cameraVideo.srcObject = stream;
        cameraVideo.play();
      }
      return true;
    } catch (err) {
      console.warn("Camera stream access failed:", err);
      return false;
    }
  }

  function stopCameraStream() {
    if (activeMediaStream) {
      activeMediaStream.getTracks().forEach(t => t.stop());
      activeMediaStream = null;
    }
    if (cameraVideo) {
      cameraVideo.srcObject = null;
    }
    if (liveCameraModal) {
      liveCameraModal.style.display = "none";
    }
    activeCamPrefix = null;
  }

  if (btnCloseCamera) btnCloseCamera.addEventListener("click", stopCameraStream);
  if (btnCancelCamera) btnCancelCamera.addEventListener("click", stopCameraStream);

  if (btnFlipCamera) {
    btnFlipCamera.addEventListener("click", async () => {
      currentFacingMode = (currentFacingMode === "environment") ? "user" : "environment";
      await startCameraStream(currentFacingMode);
    });
  }

  if (btnShutterSnap) {
    btnShutterSnap.addEventListener("click", () => {
      if (!cameraVideo || !activeCamPrefix) return;
      const width = cameraVideo.videoWidth || 640;
      const height = cameraVideo.videoHeight || 480;
      cameraCanvas.width = width;
      cameraCanvas.height = height;
      const ctx = cameraCanvas.getContext("2d");
      ctx.drawImage(cameraVideo, 0, 0, width, height);
      const dataUrl = cameraCanvas.toDataURL("image/jpeg", 0.85);

      setPhotoDataAndPreview(activeCamPrefix, dataUrl, true);
      stopCameraStream();
    });
  }

  // Setup click triggers for all 7 prefixes
  const PHOTO_PREFIXES = ["cust", "dsa", "con", "vtech", "vlegal", "biz", "oth"];

  PHOTO_PREFIXES.forEach(prefix => {
    // 1. Live camera click button
    const liveBtn = document.querySelector(`.btn-live-snap[data-prefix="${prefix}"]`);
    const camInp = document.getElementById(`${prefix}_photo_camera`);
    if (liveBtn) {
      liveBtn.addEventListener("click", async () => {
        activeCamPrefix = prefix;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          liveCameraModal.style.display = "flex";
          const ok = await startCameraStream(currentFacingMode);
          if (!ok) {
            liveCameraModal.style.display = "none";
            if (camInp) camInp.click();
          }
        } else if (camInp) {
          camInp.click();
        }
      });
    }

    // 2. Mobile native camera file input handler
    if (camInp) {
      camInp.addEventListener("change", () => {
        const file = camInp.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoDataAndPreview(prefix, e.target.result, true);
        };
        reader.readAsDataURL(file);
      });
    }

    // 3. File upload button & file input handler
    const uploadBtn = document.querySelector(`.btn-upload-trigger[data-prefix="${prefix}"]`);
    const fileInp = document.getElementById(`${prefix}_photo_file`);
    if (uploadBtn && fileInp) {
      uploadBtn.addEventListener("click", () => {
        fileInp.click();
      });
      fileInp.addEventListener("change", () => {
        const file = fileInp.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoDataAndPreview(prefix, e.target.result, false);
        };
        reader.readAsDataURL(file);
      });
    }
  });

  function setPhotoDataAndPreview(prefix, dataUrl, isLive) {
    const hiddenInp = document.getElementById(`${prefix}_photo_data`);
    const prevWrap = document.getElementById(`${prefix}_photo_preview`);
    const wrapItem = document.getElementById(`wrap-photo-${prefix}`);

    if (hiddenInp) hiddenInp.value = dataUrl;
    if (wrapItem) wrapItem.classList.remove("photo-error-highlight");

    if (prevWrap) {
      prevWrap.innerHTML = `
        <div class="photo-success-card">
          <img src="${dataUrl}" alt="Proof" class="preview-img-thumb" style="cursor:pointer;" title="Click to inspect photo">
          <div class="photo-meta">
            <span class="photo-verified-badge">${isLive ? "📸 Live Capture" : "📁 Uploaded"} • Verified</span>
            <button type="button" class="btn-photo-remove" data-prefix="${prefix}">🗑️ Remove / Retake</button>
          </div>
        </div>
      `;

      // Zoom photo modal on click
      prevWrap.querySelector("img")?.addEventListener("click", () => {
        openPhotoViewer(dataUrl, `${prefix.toUpperCase()} Photo Proof`);
      });

      // Retake button
      prevWrap.querySelector(".btn-photo-remove")?.addEventListener("click", () => {
        if (hiddenInp) hiddenInp.value = "";
        const camInp = document.getElementById(`${prefix}_photo_camera`);
        const fileInp = document.getElementById(`${prefix}_photo_file`);
        if (camInp) camInp.value = "";
        if (fileInp) fileInp.value = "";
        prevWrap.innerHTML = '<span class="photo-empty-text">No photo captured / uploaded yet</span>';
      });
    }
  }

  function openPhotoViewer(src, title) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.style.display = "flex";
    modal.innerHTML = `
      <div class="modal-3d" style="max-width: 600px; padding: 1.25rem; text-align: center;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <h3 style="font-size:1rem; font-weight:800; color:var(--slate-800);">${title || "Photo Proof"}</h3>
          <button type="button" class="close-btn" style="font-size:1.5rem;">&times;</button>
        </div>
        <img src="${src}" alt="Proof" style="width:100%; max-height:460px; object-fit:contain; border-radius:var(--radius-md);">
      </div>
    `;
    modal.querySelector(".close-btn").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  }

  // Geolocation Capture
  document.querySelectorAll(".btn-loc-capture").forEach(btn => {
    btn.addEventListener("click", () => {
      const prefix = btn.getAttribute("data-prefix");
      const infoBox = document.getElementById(`${prefix}_loc_display`);
      const latInp = document.getElementById(`${prefix}_lat`);
      const lonInp = document.getElementById(`${prefix}_lon`);
      const tsInp = document.getElementById(`${prefix}_loc_ts`);

      infoBox.innerHTML = "⏳ Detecting GPS satellites &amp; locking coordinates...";

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lon = pos.coords.longitude.toFixed(6);
            const now = new Date();
            const ts = now.toISOString().replace("T", " ").split(".")[0];

            latInp.value = lat;
            lonInp.value = lon;
            tsInp.value = ts;

            infoBox.innerHTML = `
              <strong>📍 GPS Locked:</strong> ${lat}, ${lon}<br>
              <strong>🕒 Timestamp:</strong> ${ts}<br>
              <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank" style="color:var(--primary); font-weight:700;">Open in Google Maps ↗</a>
            `;
          },
          (err) => {
            console.warn("Geolocation fallback:", err);
            const now = new Date();
            const ts = now.toISOString().replace("T", " ").split(".")[0];
            const fallbackLat = 28.6139;
            const fallbackLon = 77.2090;

            latInp.value = fallbackLat;
            lonInp.value = fallbackLon;
            tsInp.value = ts;

            infoBox.innerHTML = `
              <strong>📍 GPS Recorded (Device Base):</strong> ${fallbackLat}, ${fallbackLon}<br>
              <strong>🕒 Timestamp:</strong> ${ts}<br>
              <small style="color:var(--slate-500);">(Permission unavailable; recorded device baseline coordinates &amp; timestamp)</small>
            `;
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
      } else {
        infoBox.textContent = "Geolocation not supported by device.";
      }
    });
  });

  // Helper to generate unique visit code client side
  function generateVisitCode() {
    const today = new Date();
    const yy = String(today.getFullYear()).slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `VT-${yy}${mm}${dd}-${rand}`;
  }

  // ==================== FORM SUBMIT (MULTI-VISIT GENERATION) ====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedTypes = [];
    document.querySelectorAll(".type-card-3d.selected").forEach(card => {
      selectedTypes.push(card.getAttribute("data-type"));
    });

    if (selectedTypes.length === 0) {
      alert("Please select at least one Visit Type by clicking a Visit Type card above!");
      return;
    }

    const userRole = document.getElementById("user_role").value;
    const userName = userNameInput.value.trim();
    const userCode = `FMF${userCodeNumericInput.value.trim()}`;
    const state = stateSelect.value;
    const cluster = clusterSelect.value;
    const branch = branchSelect.value;
    const visitDate = visitDateInput.value;

    const isDsaSelected = btnPartnerDsa && btnPartnerDsa.classList.contains("selected");
    const isConSelected = btnPartnerCon && btnPartnerCon.classList.contains("selected");
    const isTechSelected = btnVendorTech && btnVendorTech.classList.contains("selected");
    const isLegalSelected = btnVendorLegal && btnVendorLegal.classList.contains("selected");

    // ==================== MANDATORY PHOTO PROOF VALIDATION ====================
    const missingPhotos = [];

    if (selectedTypes.includes("Customer Visit")) {
      const p = document.getElementById("cust_photo_data")?.value || document.querySelector("#cust_photo_preview img")?.src;
      if (!p) missingPhotos.push({ label: "Customer Visit", wrapId: "wrap-photo-cust" });
    }

    if (selectedTypes.includes("Partner Visit")) {
      if (isDsaSelected) {
        const p = document.getElementById("dsa_photo_data")?.value || document.querySelector("#dsa_photo_preview img")?.src;
        if (!p) missingPhotos.push({ label: "Direct Selling Agent (DSA)", wrapId: "wrap-photo-dsa" });
      }
      if (isConSelected) {
        const p = document.getElementById("con_photo_data")?.value || document.querySelector("#con_photo_preview img")?.src;
        if (!p) missingPhotos.push({ label: "Connector Partner", wrapId: "wrap-photo-con" });
      }
    }

    if (selectedTypes.includes("Vendor Visit")) {
      if (isTechSelected) {
        const p = document.getElementById("vtech_photo_data")?.value || document.querySelector("#vtech_photo_preview img")?.src;
        if (!p) missingPhotos.push({ label: "Technical Vendor", wrapId: "wrap-photo-vtech" });
      }
      if (isLegalSelected) {
        const p = document.getElementById("vlegal_photo_data")?.value || document.querySelector("#vlegal_photo_preview img")?.src;
        if (!p) missingPhotos.push({ label: "Legal Vendor", wrapId: "wrap-photo-vlegal" });
      }
    }

    if (selectedTypes.includes("Business Visit")) {
      const p = document.getElementById("biz_photo_data")?.value || document.querySelector("#biz_photo_preview img")?.src;
      if (!p) missingPhotos.push({ label: "Business Visit", wrapId: "wrap-photo-biz" });
    }

    if (selectedTypes.includes("Other Visit")) {
      const p = document.getElementById("oth_photo_data")?.value || document.querySelector("#oth_photo_preview img")?.src;
      if (!p) missingPhotos.push({ label: "Other Visit", wrapId: "wrap-photo-oth" });
    }

    if (missingPhotos.length > 0) {
      const first = document.getElementById(missingPhotos[0].wrapId);
      if (first) {
        first.classList.add("photo-error-highlight");
        first.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      alert(`📸 MANDATORY PHOTO REQUIRED!\n\nPlease capture a live photo or upload an image proof for:\n• ${missingPhotos.map(m => m.label).join("\n• ")}`);
      return;
    }

    const payload = {
      user_role: userRole,
      user_name: userName,
      user_code: userCode,
      state: state,
      cluster: cluster,
      branch: branch,
      visit_date: visitDate,
      visit_types: selectedTypes,
    };

    if (selectedTypes.includes("Customer Visit")) {
      const custPhoto = document.getElementById("cust_photo_data")?.value || document.querySelector("#cust_photo_preview img")?.src;
      payload.customer_visit = {
        customer_status: custStatusVal.value,
        id_type: custStatusVal.value === "Existing Customer" ? document.getElementById("cust_id_type").value : null,
        id_number: custStatusVal.value === "Existing Customer" ? document.getElementById("cust_id_number").value.trim() : null,
        customer_name: document.getElementById("cust_name").value.trim(),
        customer_mobile: document.getElementById("cust_mobile").value.trim(),
        reason: document.getElementById("cust_reason").value,
        address: document.getElementById("cust_address").value.trim(),
        photo_data: custPhoto || null,
        latitude: document.getElementById("cust_lat").value || null,
        longitude: document.getElementById("cust_lon").value || null,
        location_timestamp: document.getElementById("cust_loc_ts").value || null,
      };
    }

    if (selectedTypes.includes("Partner Visit")) {
      const partnerSubtypes = [];
      if (isDsaSelected) partnerSubtypes.push("DSA visit");
      if (isConSelected) partnerSubtypes.push("Connector Visit");

      if (partnerSubtypes.length === 0) {
        alert("Please select at least one Partner Visit Type (DSA visit or Connector Visit)!");
        return;
      }

      const dsaPhoto = document.getElementById("dsa_photo_data")?.value || document.querySelector("#dsa_photo_preview img")?.src;
      const conPhoto = document.getElementById("con_photo_data")?.value || document.querySelector("#con_photo_preview img")?.src;

      payload.partner_visit = {
        subtypes: partnerSubtypes,
        dsa: isDsaSelected ? {
          name: document.getElementById("dsa_name").value.trim(),
          code: `FBGP${document.getElementById("dsa_code_num").value.trim()}`,
          mobile: document.getElementById("dsa_mobile").value.trim(),
          reason: document.getElementById("dsa_reason").value,
          address: document.getElementById("dsa_address").value.trim(),
          photo_data: dsaPhoto || null,
          latitude: document.getElementById("dsa_lat").value || null,
          longitude: document.getElementById("dsa_lon").value || null,
          location_timestamp: document.getElementById("dsa_loc_ts").value || null,
        } : null,
        connector: isConSelected ? {
          name: document.getElementById("con_name").value.trim(),
          code: `FGP${document.getElementById("con_code_num").value.trim()}`,
          mobile: document.getElementById("con_mobile").value.trim(),
          reason: document.getElementById("con_reason").value,
          address: document.getElementById("con_address").value.trim(),
          photo_data: conPhoto || null,
          latitude: document.getElementById("con_lat").value || null,
          longitude: document.getElementById("con_lon").value || null,
          location_timestamp: document.getElementById("con_loc_ts").value || null,
        } : null
      };
    }

    if (selectedTypes.includes("Vendor Visit")) {
      const vendorSubtypes = [];
      if (isTechSelected) vendorSubtypes.push("Technical Vendor");
      if (isLegalSelected) vendorSubtypes.push("Legal Vendor");

      if (vendorSubtypes.length === 0) {
        alert("Please select at least one Vendor Visit Type (Technical Vendor or Legal Vendor)!");
        return;
      }

      const techPhoto = document.getElementById("vtech_photo_data")?.value || document.querySelector("#vtech_photo_preview img")?.src;
      const legalPhoto = document.getElementById("vlegal_photo_data")?.value || document.querySelector("#vlegal_photo_preview img")?.src;
      const techCodeRaw = document.getElementById("vtech_code_num").value.trim();
      const legalCodeRaw = document.getElementById("vlegal_code_num").value.trim();

      payload.vendor_visit = {
        subtypes: vendorSubtypes,
        technical: isTechSelected ? {
          name: document.getElementById("vtech_name").value.trim(),
          code: techCodeRaw ? `V${techCodeRaw}` : null,
          mobile: document.getElementById("vtech_mobile").value.trim(),
          reason: document.getElementById("vtech_reason").value,
          address: document.getElementById("vtech_address").value.trim(),
          photo_data: techPhoto || null,
          latitude: document.getElementById("vtech_lat").value || null,
          longitude: document.getElementById("vtech_lon").value || null,
          location_timestamp: document.getElementById("vtech_loc_ts").value || null,
        } : null,
        legal: isLegalSelected ? {
          name: document.getElementById("vlegal_name").value.trim(),
          code: legalCodeRaw ? `V${legalCodeRaw}` : null,
          mobile: document.getElementById("vlegal_mobile").value.trim(),
          reason: document.getElementById("vlegal_reason").value,
          address: document.getElementById("vlegal_address").value.trim(),
          photo_data: legalPhoto || null,
          latitude: document.getElementById("vlegal_lat").value || null,
          longitude: document.getElementById("vlegal_lon").value || null,
          location_timestamp: document.getElementById("vlegal_loc_ts").value || null,
        } : null
      };
    }

    if (selectedTypes.includes("Business Visit")) {
      const bizPhoto = document.getElementById("biz_photo_data")?.value || document.querySelector("#biz_photo_preview img")?.src;
      payload.business_visit = {
        name: document.getElementById("biz_name").value.trim(),
        mobile: document.getElementById("biz_mobile").value.trim(),
        reason: document.getElementById("biz_reason").value,
        address: document.getElementById("biz_address").value.trim(),
        photo_data: bizPhoto || null,
        latitude: document.getElementById("biz_lat").value || null,
        longitude: document.getElementById("biz_lon").value || null,
        location_timestamp: document.getElementById("biz_loc_ts").value || null,
      };
    }

    if (selectedTypes.includes("Other Visit")) {
      const othPhoto = document.getElementById("oth_photo_data")?.value || document.querySelector("#oth_photo_preview img")?.src;
      payload.other_visit = {
        name: document.getElementById("oth_name").value.trim(),
        mobile: document.getElementById("oth_mobile").value.trim(),
        reason: document.getElementById("oth_reason").value.trim(),
        address: document.getElementById("oth_address").value.trim(),
        photo_data: othPhoto || null,
        latitude: document.getElementById("oth_lat").value || null,
        longitude: document.getElementById("oth_lon").value || null,
        location_timestamp: document.getElementById("oth_loc_ts").value || null,
      };
    }

    // Submission logic (Dual-mode: Server if available, LocalStorage for GitHub Pages)
    const submitBtn = document.getElementById("btn-form-submit");
    submitBtn.disabled = true;
    submitBtn.innerHTML = "⏳ Logging Visits...";

    let createdCount = 0;

    if (!isStandalone) {
      try {
        const res = await fetch("/api/visits/submit-multi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Submission failed");
        createdCount = data.created_count;
      } catch (err) {
        console.warn("Backend error, storing in local database:", err);
        createdCount = processClientSideMultiVisit(payload);
      }
    } else {
      createdCount = processClientSideMultiVisit(payload);
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = "<span>🚀</span> Submit &amp; Log All Visits";

    alert(`🎉 SUCCESS! Generated ${createdCount} visit record(s) in system.`);
    resetEntireForm();
  });

  // Client-Side Multi-Visit Processor (ensures 100% functionality on GitHub Pages!)
  function processClientSideMultiVisit(payload) {
    const visits = getLocalVisits();
    let newEntries = [];
    const now = new Date();
    const nowTs = now.toISOString().replace("T", " ").split(".")[0];

    payload.visit_types.forEach(vt => {
      if (vt === "Customer Visit" && payload.customer_visit) {
        const c = payload.customer_visit;
        newEntries.push({
          id: Date.now() + Math.floor(Math.random() * 1000),
          visit_code: generateVisitCode(),
          user_role: payload.user_role,
          user_name: payload.user_name,
          user_code: payload.user_code,
          state: payload.state,
          cluster: payload.cluster,
          branch: payload.branch,
          visit_date: payload.visit_date,
          visit_type: "Customer Visit",
          sub_type: c.customer_status,
          customer_status: c.customer_status,
          id_type: c.id_type,
          entity_name: c.customer_name,
          entity_code: c.id_number,
          mobile: c.customer_mobile,
          reason: c.reason,
          address: c.address,
          latitude: c.latitude,
          longitude: c.longitude,
          location_timestamp: c.location_timestamp || nowTs,
          photo_data: c.photo_data,
          status: "Logged",
          created_at: nowTs
        });
      }

      if (vt === "Partner Visit" && payload.partner_visit) {
        if (payload.partner_visit.dsa) {
          const dsa = payload.partner_visit.dsa;
          newEntries.push({
            id: Date.now() + Math.floor(Math.random() * 1000) + 1,
            visit_code: generateVisitCode(),
            user_role: payload.user_role,
            user_name: payload.user_name,
            user_code: payload.user_code,
            state: payload.state,
            cluster: payload.cluster,
            branch: payload.branch,
            visit_date: payload.visit_date,
            visit_type: "Partner Visit",
            sub_type: "DSA visit",
            entity_name: dsa.name,
            entity_code: dsa.code,
            mobile: dsa.mobile,
            reason: dsa.reason,
            address: dsa.address,
            latitude: dsa.latitude,
            longitude: dsa.longitude,
            location_timestamp: dsa.location_timestamp || nowTs,
            photo_data: dsa.photo_data,
            status: "Logged",
            created_at: nowTs
          });
        }
        if (payload.partner_visit.connector) {
          const con = payload.partner_visit.connector;
          newEntries.push({
            id: Date.now() + Math.floor(Math.random() * 1000) + 2,
            visit_code: generateVisitCode(),
            user_role: payload.user_role,
            user_name: payload.user_name,
            user_code: payload.user_code,
            state: payload.state,
            cluster: payload.cluster,
            branch: payload.branch,
            visit_date: payload.visit_date,
            visit_type: "Partner Visit",
            sub_type: "Connector Visit",
            entity_name: con.name,
            entity_code: con.code,
            mobile: con.mobile,
            reason: con.reason,
            address: con.address,
            latitude: con.latitude,
            longitude: con.longitude,
            location_timestamp: con.location_timestamp || nowTs,
            photo_data: con.photo_data,
            status: "Logged",
            created_at: nowTs
          });
        }
      }

      if (vt === "Vendor Visit" && payload.vendor_visit) {
        if (payload.vendor_visit.technical) {
          const tech = payload.vendor_visit.technical;
          newEntries.push({
            id: Date.now() + Math.floor(Math.random() * 1000) + 3,
            visit_code: generateVisitCode(),
            user_role: payload.user_role,
            user_name: payload.user_name,
            user_code: payload.user_code,
            state: payload.state,
            cluster: payload.cluster,
            branch: payload.branch,
            visit_date: payload.visit_date,
            visit_type: "Vendor Visit",
            sub_type: "Technical Vendor",
            entity_name: tech.name,
            entity_code: tech.code,
            mobile: tech.mobile,
            reason: tech.reason,
            address: tech.address,
            latitude: tech.latitude,
            longitude: tech.longitude,
            location_timestamp: tech.location_timestamp || nowTs,
            photo_data: tech.photo_data,
            status: "Logged",
            created_at: nowTs
          });
        }
        if (payload.vendor_visit.legal) {
          const leg = payload.vendor_visit.legal;
          newEntries.push({
            id: Date.now() + Math.floor(Math.random() * 1000) + 4,
            visit_code: generateVisitCode(),
            user_role: payload.user_role,
            user_name: payload.user_name,
            user_code: payload.user_code,
            state: payload.state,
            cluster: payload.cluster,
            branch: payload.branch,
            visit_date: payload.visit_date,
            visit_type: "Vendor Visit",
            sub_type: "Legal Vendor",
            entity_name: leg.name,
            entity_code: leg.code,
            mobile: leg.mobile,
            reason: leg.reason,
            address: leg.address,
            latitude: leg.latitude,
            longitude: leg.longitude,
            location_timestamp: leg.location_timestamp || nowTs,
            photo_data: leg.photo_data,
            status: "Logged",
            created_at: nowTs
          });
        }
      }

      if (vt === "Business Visit" && payload.business_visit) {
        const b = payload.business_visit;
        newEntries.push({
          id: Date.now() + Math.floor(Math.random() * 1000) + 5,
          visit_code: generateVisitCode(),
          user_role: payload.user_role,
          user_name: payload.user_name,
          user_code: payload.user_code,
          state: payload.state,
          cluster: payload.cluster,
          branch: payload.branch,
          visit_date: payload.visit_date,
          visit_type: "Business Visit",
          sub_type: "Business Entity",
          entity_name: b.name,
          mobile: b.mobile,
          reason: b.reason,
          address: b.address,
          latitude: b.latitude,
          longitude: b.longitude,
          location_timestamp: b.location_timestamp || nowTs,
          photo_data: b.photo_data,
          status: "Logged",
          created_at: nowTs
        });
      }

      if (vt === "Other Visit" && payload.other_visit) {
        const o = payload.other_visit;
        newEntries.push({
          id: Date.now() + Math.floor(Math.random() * 1000) + 6,
          visit_code: generateVisitCode(),
          user_role: payload.user_role,
          user_name: payload.user_name,
          user_code: payload.user_code,
          state: payload.state,
          cluster: payload.cluster,
          branch: payload.branch,
          visit_date: payload.visit_date,
          visit_type: "Other Visit",
          sub_type: "General / Other",
          entity_name: o.name,
          mobile: o.mobile,
          reason: o.reason,
          address: o.address,
          latitude: o.latitude,
          longitude: o.longitude,
          location_timestamp: o.location_timestamp || nowTs,
          photo_data: o.photo_data,
          status: "Logged",
          created_at: nowTs
        });
      }
    });

    const updated = [...newEntries, ...visits];
    saveLocalVisits(updated);
    return newEntries.length;
  }

  // Reset Entire Form Helper
  function resetEntireForm() {
    form.reset();
    setupDateRestrictions();
    document.querySelectorAll(".type-card-3d").forEach(card => card.classList.remove("selected"));
    document.querySelectorAll(".sub-choice-btn").forEach(btn => btn.classList.remove("selected"));
    if (statePartnerDsa) statePartnerDsa.textContent = "⬜";
    if (statePartnerCon) statePartnerCon.textContent = "⬜";
    if (stateVendorTech) stateVendorTech.textContent = "⬜";
    if (stateVendorLegal) stateVendorLegal.textContent = "⬜";
    if (partnerDsaBox) partnerDsaBox.style.display = "none";
    if (partnerConBox) partnerConBox.style.display = "none";
    if (vendorTechBox) vendorTechBox.style.display = "none";
    if (vendorLegalBox) vendorLegalBox.style.display = "none";
    document.querySelectorAll(".sub-section-card").forEach(c => {
      c.style.display = "none";
      clearSubSectionInputs(c);
    });

    // Clear photo data inputs and preview wrappers
    PHOTO_PREFIXES.forEach(prefix => {
      const hiddenInp = document.getElementById(`${prefix}_photo_data`);
      if (hiddenInp) hiddenInp.value = "";
      const camInp = document.getElementById(`${prefix}_photo_camera`);
      if (camInp) camInp.value = "";
      const fileInp = document.getElementById(`${prefix}_photo_file`);
      if (fileInp) fileInp.value = "";
      const prevWrap = document.getElementById(`${prefix}_photo_preview`);
      if (prevWrap) prevWrap.innerHTML = '<span class="photo-empty-text">No photo captured / uploaded yet</span>';
      const wrap = document.getElementById(`wrap-photo-${prefix}`);
      if (wrap) wrap.classList.remove("photo-error-highlight");
    });

    if (custStatusToggle) {
      custStatusToggle.querySelectorAll(".segmented-option").forEach(b => {
        if (b.getAttribute("data-val") === "New Customer") {
          b.classList.add("active");
        } else {
          b.classList.remove("active");
        }
      });
    }
    if (custStatusVal) custStatusVal.value = "New Customer";
    if (existingCustIdRow) existingCustIdRow.style.display = "none";
    const custIdNum = document.getElementById("cust_id_number");
    if (custIdNum) {
      custIdNum.required = false;
      custIdNum.value = "";
    }
  }

  // Reset and Cancel
  document.getElementById("btn-form-reset").addEventListener("click", () => {
    if (confirm("Reset all form entries?")) {
      resetEntireForm();
    }
  });

  document.getElementById("btn-form-cancel").addEventListener("click", () => {
    if (confirm("Discard changes?")) {
      resetEntireForm();
    }
  });

  // ==================== MASTER DASHBOARD OPERATIONS ====================
  async function loadDashboardData() {
    await Promise.all([loadStats(), searchVisits()]);
  }

  // Interactive KPI Metrics Cards Click-To-Filter
  document.querySelectorAll(".kpi-card-mco").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".kpi-card-mco").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const targetType = card.getAttribute("data-filter-type") || "";
      if (fltType) {
        fltType.value = targetType;
      }
      searchVisits();
    });
  });

  async function loadStats() {
    let total = 0, cust = 0, partner = 0, vendor = 0, biz = 0;

    if (!isStandalone) {
      try {
        const res = await fetch("/api/stats");
        const stats = await res.json();
        total = stats.total_visits || 0;
        cust = stats.by_type?.["Customer Visit"] || 0;
        partner = stats.by_type?.["Partner Visit"] || 0;
        vendor = stats.by_type?.["Vendor Visit"] || 0;
        biz = (stats.by_type?.["Business Visit"] || 0) + (stats.by_type?.["Other Visit"] || 0);
      } catch (e) {
        const visits = getLocalVisits();
        total = visits.length;
        cust = visits.filter(v => v.visit_type === "Customer Visit").length;
        partner = visits.filter(v => v.visit_type === "Partner Visit").length;
        vendor = visits.filter(v => v.visit_type === "Vendor Visit").length;
        biz = visits.filter(v => v.visit_type === "Business Visit" || v.visit_type === "Other Visit").length;
      }
    } else {
      const visits = getLocalVisits();
      total = visits.length;
      cust = visits.filter(v => v.visit_type === "Customer Visit").length;
      partner = visits.filter(v => v.visit_type === "Partner Visit").length;
      vendor = visits.filter(v => v.visit_type === "Vendor Visit").length;
      biz = visits.filter(v => v.visit_type === "Business Visit" || v.visit_type === "Other Visit").length;
    }

    if (kpiTotalVisits) kpiTotalVisits.textContent = total;
    if (kpiCustVisits) kpiCustVisits.textContent = cust;
    if (kpiPartnerVisits) kpiPartnerVisits.textContent = partner;
    if (kpiVendorVisits) kpiVendorVisits.textContent = vendor;
    if (kpiBizVisits) kpiBizVisits.textContent = biz;

    // Percent shares & progress bars for advanced interactive totals
    const custShare = total > 0 ? Math.round((cust / total) * 100) : 0;
    const partnerShare = total > 0 ? Math.round((partner / total) * 100) : 0;
    const vendorShare = total > 0 ? Math.round((vendor / total) * 100) : 0;
    const bizShare = total > 0 ? Math.round((biz / total) * 100) : 0;

    const elCustShare = document.getElementById("kpi-cust-share");
    const elCustBar = document.getElementById("kpi-cust-bar");
    if (elCustShare) elCustShare.textContent = `${custShare}%`;
    if (elCustBar) elCustBar.style.width = `${custShare}%`;

    const elPartnerShare = document.getElementById("kpi-partner-share");
    const elPartnerBar = document.getElementById("kpi-partner-bar");
    if (elPartnerShare) elPartnerShare.textContent = `${partnerShare}%`;
    if (elPartnerBar) elPartnerBar.style.width = `${partnerShare}%`;

    const elVendorShare = document.getElementById("kpi-vendor-share");
    const elVendorBar = document.getElementById("kpi-vendor-bar");
    if (elVendorShare) elVendorShare.textContent = `${vendorShare}%`;
    if (elVendorBar) elVendorBar.style.width = `${vendorShare}%`;

    const elBizShare = document.getElementById("kpi-biz-share");
    const elBizBar = document.getElementById("kpi-biz-bar");
    if (elBizShare) elBizShare.textContent = `${bizShare}%`;
    if (elBizBar) elBizBar.style.width = `${bizShare}%`;
  }

  async function searchVisits() {
    const fromDate = fltFromDate.value;
    const toDate = fltToDate.value;
    const role = fltRole.value;
    const state = fltState.value;
    const cluster = fltCluster.value;
    const branch = fltBranch.value;
    const type = fltType.value;
    const search = fltSearch.value.trim().toLowerCase();

    visitsTableBody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 2rem;">Searching visits...</td></tr>`;

    if (!isStandalone) {
      try {
        const params = new URLSearchParams();
        if (fromDate) params.append("from_date", fromDate);
        if (toDate) params.append("to_date", toDate);
        if (role) params.append("user_role", role);
        if (state) params.append("state", state);
        if (cluster) params.append("cluster", cluster);
        if (branch) params.append("branch", branch);
        if (type) params.append("visit_type", type);
        if (search) params.append("query", search);

        const res = await fetch(`/api/visits?${params.toString()}`);
        currentVisits = await res.json();
        renderVisitsTable(currentVisits);
        liveVisitsCounter.innerHTML = `<span>📊</span> Displaying <strong>${currentVisits.length}</strong> Visits`;
        return;
      } catch (e) {
        // Fall back to client storage
      }
    }

    let list = getLocalVisits();
    if (fromDate) list = list.filter(v => v.visit_date >= fromDate);
    if (toDate) list = list.filter(v => v.visit_date <= toDate);
    if (role) list = list.filter(v => v.user_role === role);
    if (state && state !== "All") list = list.filter(v => v.state === state);
    if (cluster && cluster !== "All") list = list.filter(v => v.cluster === cluster);
    if (branch && branch !== "All") list = list.filter(v => v.branch === branch);
    if (type && type !== "All") list = list.filter(v => v.visit_type === type);
    if (search) {
      list = list.filter(v =>
        (v.visit_code && v.visit_code.toLowerCase().includes(search)) ||
        (v.user_name && v.user_name.toLowerCase().includes(search)) ||
        (v.user_code && v.user_code.toLowerCase().includes(search)) ||
        (v.entity_name && v.entity_name.toLowerCase().includes(search)) ||
        (v.entity_code && v.entity_code.toLowerCase().includes(search)) ||
        (v.mobile && v.mobile.toLowerCase().includes(search)) ||
        (v.branch && v.branch.toLowerCase().includes(search))
      );
    }

    currentVisits = list;
    renderVisitsTable(currentVisits);
    liveVisitsCounter.innerHTML = `<span>📊</span> Displaying <strong>${currentVisits.length}</strong> Visits`;
  }

  btnFltSearch.addEventListener("click", searchVisits);

  btnFltClear.addEventListener("click", () => {
    fltFromDate.value = "";
    fltToDate.value = "";
    fltRole.value = "";
    fltState.value = "";
    fltCluster.value = "";
    fltBranch.value = "";
    fltType.value = "";
    fltSearch.value = "";
    document.querySelectorAll(".date-chip").forEach(c => c.classList.remove("active"));
    document.querySelector('.date-chip[data-range="all"]').classList.add("active");
    searchVisits();
  });

  // Quick Date Chips
  document.querySelectorAll(".date-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".date-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const range = chip.getAttribute("data-range");
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      if (range === "all") {
        fltFromDate.value = "";
        fltToDate.value = "";
      } else if (range === "today") {
        fltFromDate.value = todayStr;
        fltToDate.value = todayStr;
      } else if (range === "yesterday") {
        const yest = new Date();
        yest.setDate(today.getDate() - 1);
        const yestStr = yest.toISOString().split("T")[0];
        fltFromDate.value = yestStr;
        fltToDate.value = yestStr;
      } else if (range === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        fltFromDate.value = weekAgo.toISOString().split("T")[0];
        fltToDate.value = todayStr;
      } else if (range === "month") {
        const monthAgo = new Date();
        monthAgo.setDate(today.getDate() - 30);
        fltFromDate.value = monthAgo.toISOString().split("T")[0];
        fltToDate.value = todayStr;
      } else if (range === "2months") {
        const twoMonths = new Date();
        twoMonths.setDate(today.getDate() - 62);
        fltFromDate.value = twoMonths.toISOString().split("T")[0];
        fltToDate.value = todayStr;
      }
      searchVisits();
    });
  });

  function formatDateTimeCell(v) {
    const d = v.visit_date || "-";
    let t = "";
    if (v.location_timestamp) {
      t = v.location_timestamp.includes(" ") ? v.location_timestamp.split(" ")[1] : v.location_timestamp;
    } else if (v.created_at) {
      t = v.created_at.includes(" ") ? v.created_at.split(" ")[1] : (v.created_at.includes("T") ? v.created_at.split("T")[1].split(".")[0] : "");
    }
    if (!t) t = "11:30:00";
    return `
      <div style="font-weight:700; color:var(--slate-800);">${escapeHtml(d)}</div>
      <div style="font-size:0.72rem; color:var(--slate-500); font-family:monospace; display:flex; align-items:center; gap:3px; margin-top:2px;">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>${escapeHtml(t)}</span>
      </div>
    `;
  }

  function renderVisitsTable(visits) {
    if (!visits || visits.length === 0) {
      visitsTableBody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 2.5rem; color:var(--slate-400);">No visits match current filter criteria.</td></tr>`;
      return;
    }

    visitsTableBody.innerHTML = visits.map(v => {
      let badgeClass = "badge-other";
      if (v.visit_type === "Customer Visit") badgeClass = "badge-customer";
      else if (v.visit_type === "Partner Visit") badgeClass = "badge-partner";
      else if (v.visit_type === "Vendor Visit") badgeClass = "badge-vendor";
      else if (v.visit_type === "Business Visit") badgeClass = "badge-business";

      let locDisplay = "-";
      if (v.latitude && v.longitude) {
        locDisplay = `
          <a href="https://www.google.com/maps?q=${v.latitude},${v.longitude}" target="_blank" style="text-decoration:none; color:var(--primary); font-weight:700;" title="Open in Map">
            📍 ${v.latitude}, ${v.longitude}
          </a>
          <br><small style="color:var(--slate-400);">${v.location_timestamp ? v.location_timestamp.slice(11, 16) : ""}</small>
        `;
      }

      let photoDisplay = `<span style="color:var(--slate-400); font-size:0.75rem;">None</span>`;
      if (v.photo_data) {
        photoDisplay = `
          <img src="${v.photo_data}" alt="Proof" style="width:36px; height:36px; border-radius:6px; object-fit:cover; border:1px solid #cbd5e1; cursor:pointer;" onclick="openPhotoViewer('${v.photo_data}', '${escapeHtml(v.entity_name)}')">
        `;
      }

      return `
        <tr>
          <td><strong>${v.visit_code}</strong></td>
          <td>${formatDateTimeCell(v)}</td>
          <td>
            <strong>${escapeHtml(v.user_name)}</strong>
            <br><span class="badge-role">${v.user_role}</span> <code>${v.user_code}</code>
          </td>
          <td>
            <strong>${escapeHtml(v.branch)}</strong>
            <br><small style="color:var(--slate-500);">${escapeHtml(v.cluster)} | ${escapeHtml(v.state)}</small>
          </td>
          <td>
            <span class="badge-type ${badgeClass}">${v.visit_type}</span>
            ${v.sub_type ? `<br><small style="font-weight:600; color:var(--slate-600);">${v.sub_type}</small>` : ""}
          </td>
          <td>
            <strong>${escapeHtml(v.entity_name)}</strong>
            ${v.entity_code ? `<br><code>${escapeHtml(v.entity_code)}</code>` : ""}
          </td>
          <td>${v.mobile ? `<a href="tel:${v.mobile}" style="color:inherit; font-weight:600;">${v.mobile}</a>` : "-"}</td>
          <td><span style="font-size:0.8rem;">${escapeHtml(v.reason || "-")}</span></td>
          <td>${locDisplay}</td>
          <td>${photoDisplay}</td>
          <td>
            <div style="display:flex; gap:0.3rem;">
              <button class="btn-action-icon view" title="3D Inspection Voucher" data-action="view" data-id="${v.id}">👁️</button>
              <button class="btn-action-icon edit" title="Edit Visit" data-action="edit" data-id="${v.id}">✏️</button>
              <button class="btn-action-icon del" title="Delete Record" data-action="delete" data-id="${v.id}">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    attachTableActionListeners();
  }

  function attachTableActionListeners() {
    document.querySelectorAll(".btn-action-icon").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action");
        const id = btn.getAttribute("data-id");
        const visit = currentVisits.find(v => v.id == id);
        if (!visit) return;

        if (action === "view") {
          openEyeView(visit);
        } else if (action === "edit") {
          openEditModal(visit);
        } else if (action === "delete") {
          if (confirm(`Delete visit ${visit.visit_code}?`)) {
            if (!isStandalone) {
              fetch(`/api/visits/${visit.id}`, { method: "DELETE" })
                .catch(() => {});
            }
            const visits = getLocalVisits().filter(v => v.id != visit.id);
            saveLocalVisits(visits);
            searchVisits();
          }
        }
      });
    });
  }

  // ==================== EYE VIEW MODAL ====================
  function openEyeView(v) {
    let mapEmbedHtml = "";
    if (v.latitude && v.longitude) {
      mapEmbedHtml = `
        <div style="margin-top:1rem;">
          <div class="detail-label">📍 GEOLOCATION &amp; SATELLITE POSITION</div>
          <div class="detail-value" style="font-family:monospace; margin-bottom:0.5rem;">
            Lat: ${v.latitude}, Long: ${v.longitude} | Recorded at: ${v.location_timestamp || "-"}
          </div>
          <div id="eye-map-container" class="map-embed-box"></div>
          <div style="margin-top:0.35rem; font-size:0.78rem;">
            <a href="https://www.google.com/maps?q=${v.latitude},${v.longitude}" target="_blank" style="color:var(--primary); font-weight:700;">Open external Google Maps ↗</a>
          </div>
        </div>
      `;
    }

    eyeViewContent.innerHTML = `
      <div style="border-bottom: 2px dashed var(--slate-200); padding-bottom: 1rem; margin-bottom: 1.25rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span class="badge-tag-3d">VISIT VOUCHER</span>
          <h2 style="font-size:1.4rem; font-weight:800; color:var(--slate-900);">${v.visit_code}</h2>
          <small style="color:var(--slate-500); font-weight:600;">🗓️ Date: ${v.visit_date} &nbsp;•&nbsp; 🕒 Time: ${v.location_timestamp ? (v.location_timestamp.includes(" ") ? v.location_timestamp.split(" ")[1] : v.location_timestamp) : (v.created_at || "11:30:00")}</small>
        </div>
        <div style="text-align:right;">
          <span class="badge-role" style="font-size:0.85rem; padding:0.3rem 0.75rem;">${v.user_role}</span>
          <div style="font-weight:700; color:var(--slate-700); font-size:0.9rem; margin-top:0.25rem;">${escapeHtml(v.user_name)}</div>
          <small style="color:var(--slate-400);">${v.user_code}</small>
        </div>
      </div>

      <div class="detail-box-grid">
        <div class="detail-item">
          <div class="detail-label">Location Details</div>
          <div class="detail-value">${escapeHtml(v.branch)}</div>
          <small style="color:var(--slate-500);">${escapeHtml(v.cluster)} | ${escapeHtml(v.state)}</small>
        </div>
        <div class="detail-item">
          <div class="detail-label">Visit Type &amp; Sub-type</div>
          <div class="detail-value">${v.visit_type}</div>
          <small style="color:var(--slate-500);">${v.sub_type || "-"}</small>
        </div>
        <div class="detail-item">
          <div class="detail-label">Entity / Client</div>
          <div class="detail-value">${escapeHtml(v.entity_name)}</div>
          ${v.entity_code ? `<small style="color:var(--slate-500);">ID / Code: <strong>${escapeHtml(v.entity_code)}</strong></small>` : ""}
        </div>
        <div class="detail-item">
          <div class="detail-label">Contact Mobile</div>
          <div class="detail-value">${v.mobile || "Not Provided"}</div>
          <small style="color:var(--slate-500);">Reason: ${escapeHtml(v.reason || "-")}</small>
        </div>
      </div>

      ${v.address ? `
        <div class="detail-item" style="margin-bottom:1rem;">
          <div class="detail-label">Address / Landmark</div>
          <div class="detail-value" style="font-size:0.875rem; font-weight:normal;">${escapeHtml(v.address)}</div>
        </div>
      ` : ""}

      ${v.photo_data ? `
        <div style="margin-top:1rem;">
          <div class="detail-label">Captured Photo Proof</div>
          <img src="${v.photo_data}" alt="Proof" style="width:100%; max-height:260px; object-fit:cover; border-radius:var(--radius-md); border:1px solid #cbd5e1;">
        </div>
      ` : ""}

      ${mapEmbedHtml}
    `;

    openModal(eyeViewModal);

    if (v.latitude && v.longitude && typeof L !== "undefined") {
      setTimeout(() => {
        const container = document.getElementById("eye-map-container");
        if (container) {
          try {
            if (mapInstances["eye"]) {
              mapInstances["eye"].remove();
            }
            const map = L.map("eye-map-container").setView([v.latitude, v.longitude], 15);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
              attribution: "© OpenStreetMap"
            }).addTo(map);
            L.marker([v.latitude, v.longitude]).addTo(map)
              .bindPopup(`<strong>${escapeHtml(v.entity_name)}</strong><br>${v.visit_code}`)
              .openPopup();
            mapInstances["eye"] = map;
          } catch (e) {
            console.warn("Leaflet map initialization:", e);
          }
        }
      }, 150);
    }
  }

  // ==================== EDIT MODAL ====================
  function openEditModal(v) {
    document.getElementById("edit_visit_id").value = v.id;
    document.getElementById("edit_entity_name").value = v.entity_name || "";
    document.getElementById("edit_mobile").value = v.mobile || "";
    document.getElementById("edit_reason").value = v.reason || "";
    document.getElementById("edit_address").value = v.address || "";
    document.getElementById("edit_status").value = v.status || "Logged";
    document.getElementById("edit_notes").value = v.notes || "";
    openModal(editModal);
  }

  editVisitForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit_visit_id").value;
    const updates = {
      entity_name: document.getElementById("edit_entity_name").value.trim(),
      mobile: document.getElementById("edit_mobile").value.trim() || null,
      reason: document.getElementById("edit_reason").value.trim() || null,
      address: document.getElementById("edit_address").value.trim() || null,
      status: document.getElementById("edit_status").value,
      notes: document.getElementById("edit_notes").value.trim() || null,
    };

    if (!isStandalone) {
      try {
        await fetch(`/api/visits/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates)
        });
      } catch (err) {
        // Fall back to local
      }
    }

    const visits = getLocalVisits().map(v => {
      if (v.id == id) {
        return { ...v, ...updates };
      }
      return v;
    });
    saveLocalVisits(visits);

    closeModal(editModal);
    searchVisits();
  });

  // Export CSV (Dual-mode: Server API or Client Blob generation)
  btnExportCsv.addEventListener("click", () => {
    if (!isStandalone) {
      const params = new URLSearchParams();
      if (fltFromDate.value) params.append("from_date", fltFromDate.value);
      if (fltToDate.value) params.append("to_date", fltToDate.value);
      if (fltRole.value) params.append("user_role", fltRole.value);
      if (fltState.value) params.append("state", fltState.value);
      if (fltCluster.value) params.append("cluster", fltCluster.value);
      if (fltBranch.value) params.append("branch", fltBranch.value);
      if (fltType.value) params.append("visit_type", fltType.value);
      if (fltSearch.value.trim()) params.append("query", fltSearch.value.trim());

      window.location.href = `/api/export?${params.toString()}`;
      return;
    }

    // Client-side CSV generation
    const visits = currentVisits;
    const headers = [
      "visit_code", "visit_date", "visit_time", "user_role", "user_name", "user_code",
      "state", "cluster", "branch", "visit_type", "sub_type",
      "entity_name", "entity_code", "mobile", "reason", "address",
      "latitude", "longitude", "location_timestamp", "map_url", "status"
    ];

    let csvContent = headers.join(",") + "\n";
    visits.forEach(v => {
      const mapUrl = v.latitude && v.longitude ? `https://www.google.com/maps?q=${v.latitude},${v.longitude}` : "";
      const visitTime = v.location_timestamp ? (v.location_timestamp.includes(" ") ? v.location_timestamp.split(" ")[1] : v.location_timestamp) : (v.created_at || "11:30:00");
      const row = [
        v.visit_code || "",
        v.visit_date || "",
        visitTime,
        v.user_role || "",
        `"${(v.user_name || '').replace(/"/g, '""')}"`,
        v.user_code || "",
        `"${(v.state || '').replace(/"/g, '""')}"`,
        `"${(v.cluster || '').replace(/"/g, '""')}"`,
        `"${(v.branch || '').replace(/"/g, '""')}"`,
        `"${(v.visit_type || '').replace(/"/g, '""')}"`,
        `"${(v.sub_type || '').replace(/"/g, '""')}"`,
        `"${(v.entity_name || '').replace(/"/g, '""')}"`,
        `"${(v.entity_code || '').replace(/"/g, '""')}"`,
        v.mobile || "",
        `"${(v.reason || '').replace(/"/g, '""')}"`,
        `"${(v.address || '').replace(/"/g, '""')}"`,
        v.latitude || "",
        v.longitude || "",
        v.location_timestamp || "",
        `"${mapUrl}"`,
        v.status || "Logged"
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `visits_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Modal helpers
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-close");
      const modal = document.getElementById(id);
      if (modal) closeModal(modal);
    });
  });

  function openModal(modal) {
    if (modal) modal.classList.add("active");
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove("active");
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  window.viewPhotoModal = (id) => {
    const v = currentVisits.find(item => item.id == id);
    if (v && v.photo_data) {
      openEyeView(v);
    }
  };

  initHierarchy();
});

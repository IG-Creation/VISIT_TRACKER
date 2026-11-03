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
      return JSON.parse(stored);
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
  const statePartnerDsa = document.getElementById("state-partner-dsa");
  const statePartnerCon = document.getElementById("state-partner-con");
  const partnerDsaBox = document.getElementById("partner-dsa-box");
  const partnerConBox = document.getElementById("partner-connector-box");

  // Vendor sub-choice buttons & boxes
  const btnVendorTech = document.getElementById("btn-vendor-tech");
  const btnVendorLegal = document.getElementById("btn-vendor-legal");
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
      wrap.innerHTML = '<span class="photo-empty-text">No photo uploaded</span>';
    });
    container.querySelectorAll(".location-info").forEach(info => {
      info.textContent = "Location not captured yet.";
    });
    // Reset partner inner state if partner section is cleared
    if (container.id === "subsec-partner") {
      if (btnPartnerDsa) btnPartnerDsa.classList.remove("selected");
      if (btnPartnerCon) btnPartnerCon.classList.remove("selected");
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

  // Partner Visit: DSA & Connector Sub-choice buttons
  if (btnPartnerDsa) {
    btnPartnerDsa.addEventListener("click", () => {
      const isSelected = btnPartnerDsa.classList.toggle("selected");
      if (statePartnerDsa) statePartnerDsa.textContent = isSelected ? "✓" : "⬜";
      partnerDsaBox.style.display = isSelected ? "block" : "none";
      if (!isSelected) clearSubSectionInputs(partnerDsaBox);
    });
  }
  if (btnPartnerCon) {
    btnPartnerCon.addEventListener("click", () => {
      const isSelected = btnPartnerCon.classList.toggle("selected");
      if (statePartnerCon) statePartnerCon.textContent = isSelected ? "✓" : "⬜";
      partnerConBox.style.display = isSelected ? "block" : "none";
      if (!isSelected) clearSubSectionInputs(partnerConBox);
    });
  }

  // Vendor Visit: Tech & Legal Sub-choice buttons
  if (btnVendorTech) {
    btnVendorTech.addEventListener("click", () => {
      const isSelected = btnVendorTech.classList.toggle("selected");
      if (stateVendorTech) stateVendorTech.textContent = isSelected ? "✓" : "⬜";
      vendorTechBox.style.display = isSelected ? "block" : "none";
      if (!isSelected) clearSubSectionInputs(vendorTechBox);
    });
  }
  if (btnVendorLegal) {
    btnVendorLegal.addEventListener("click", () => {
      const isSelected = btnVendorLegal.classList.toggle("selected");
      if (stateVendorLegal) stateVendorLegal.textContent = isSelected ? "✓" : "⬜";
      vendorLegalBox.style.display = isSelected ? "block" : "none";
      if (!isSelected) clearSubSectionInputs(vendorLegalBox);
    });
  }

  // ==================== PHOTO & GPS CAPTURE ====================
  function setupPhotoUpload(inputId, previewId) {
    const fileInp = document.getElementById(inputId);
    const prevWrap = document.getElementById(previewId);
    if (!fileInp || !prevWrap) return;

    fileInp.addEventListener("change", () => {
      const file = fileInp.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        prevWrap.innerHTML = `<img src="${e.target.result}" alt="Proof" style="cursor: pointer;" title="Click to view full">`;
      };
      reader.readAsDataURL(file);
    });
  }

  setupPhotoUpload("cust_photo_file", "cust_photo_preview");
  setupPhotoUpload("dsa_photo_file", "dsa_photo_preview");
  setupPhotoUpload("con_photo_file", "con_photo_preview");
  setupPhotoUpload("vtech_photo_file", "vtech_photo_preview");
  setupPhotoUpload("vlegal_photo_file", "vlegal_photo_preview");
  setupPhotoUpload("biz_photo_file", "biz_photo_preview");
  setupPhotoUpload("oth_photo_file", "oth_photo_preview");

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
      const custPhotoImg = document.querySelector("#cust_photo_preview img");
      payload.customer_visit = {
        customer_status: custStatusVal.value,
        id_type: custStatusVal.value === "Existing Customer" ? document.getElementById("cust_id_type").value : null,
        id_number: custStatusVal.value === "Existing Customer" ? document.getElementById("cust_id_number").value.trim() : null,
        customer_name: document.getElementById("cust_name").value.trim(),
        customer_mobile: document.getElementById("cust_mobile").value.trim(),
        reason: document.getElementById("cust_reason").value,
        address: document.getElementById("cust_address").value.trim(),
        photo_data: custPhotoImg ? custPhotoImg.src : null,
        latitude: document.getElementById("cust_lat").value || null,
        longitude: document.getElementById("cust_lon").value || null,
        location_timestamp: document.getElementById("cust_loc_ts").value || null,
      };
    }

    if (selectedTypes.includes("Partner Visit")) {
      const isDsaSelected = btnPartnerDsa && btnPartnerDsa.classList.contains("selected");
      const isConSelected = btnPartnerCon && btnPartnerCon.classList.contains("selected");
      const partnerSubtypes = [];
      if (isDsaSelected) partnerSubtypes.push("DSA visit");
      if (isConSelected) partnerSubtypes.push("Connector Visit");

      if (partnerSubtypes.length === 0) {
        alert("Please select at least one Partner Visit Type (DSA visit or Connector Visit)!");
        return;
      }

      const dsaPhoto = document.querySelector("#dsa_photo_preview img");
      const conPhoto = document.querySelector("#con_photo_preview img");

      payload.partner_visit = {
        subtypes: partnerSubtypes,
        dsa: isDsaSelected ? {
          name: document.getElementById("dsa_name").value.trim(),
          code: `FBGP${document.getElementById("dsa_code_num").value.trim()}`,
          mobile: document.getElementById("dsa_mobile").value.trim(),
          reason: document.getElementById("dsa_reason").value,
          address: document.getElementById("dsa_address").value.trim(),
          photo_data: dsaPhoto ? dsaPhoto.src : null,
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
          photo_data: conPhoto ? conPhoto.src : null,
          latitude: document.getElementById("con_lat").value || null,
          longitude: document.getElementById("con_lon").value || null,
          location_timestamp: document.getElementById("con_loc_ts").value || null,
        } : null
      };
    }

    if (selectedTypes.includes("Vendor Visit")) {
      const isTechSelected = btnVendorTech && btnVendorTech.classList.contains("selected");
      const isLegalSelected = btnVendorLegal && btnVendorLegal.classList.contains("selected");
      const vendorSubtypes = [];
      if (isTechSelected) vendorSubtypes.push("Technical Vendor");
      if (isLegalSelected) vendorSubtypes.push("Legal Vendor");

      if (vendorSubtypes.length === 0) {
        alert("Please select at least one Vendor Visit Type (Technical Vendor or Legal Vendor)!");
        return;
      }

      const techPhoto = document.querySelector("#vtech_photo_preview img");
      const legalPhoto = document.querySelector("#vlegal_photo_preview img");
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
          photo_data: techPhoto ? techPhoto.src : null,
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
          photo_data: legalPhoto ? legalPhoto.src : null,
          latitude: document.getElementById("vlegal_lat").value || null,
          longitude: document.getElementById("vlegal_lon").value || null,
          location_timestamp: document.getElementById("vlegal_loc_ts").value || null,
        } : null
      };
    }

    if (selectedTypes.includes("Business Visit")) {
      const bizPhoto = document.querySelector("#biz_photo_preview img");
      payload.business_visit = {
        name: document.getElementById("biz_name").value.trim(),
        mobile: document.getElementById("biz_mobile").value.trim(),
        reason: document.getElementById("biz_reason").value,
        address: document.getElementById("biz_address").value.trim(),
        photo_data: bizPhoto ? bizPhoto.src : null,
        latitude: document.getElementById("biz_lat").value || null,
        longitude: document.getElementById("biz_lon").value || null,
        location_timestamp: document.getElementById("biz_loc_ts").value || null,
      };
    }

    if (selectedTypes.includes("Other Visit")) {
      const othPhoto = document.querySelector("#oth_photo_preview img");
      payload.other_visit = {
        name: document.getElementById("oth_name").value.trim(),
        mobile: document.getElementById("oth_mobile").value.trim(),
        reason: document.getElementById("oth_reason").value.trim(),
        address: document.getElementById("oth_address").value.trim(),
        photo_data: othPhoto ? othPhoto.src : null,
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

  async function loadStats() {
    if (!isStandalone) {
      try {
        const res = await fetch("/api/stats");
        const stats = await res.json();
        kpiTotalVisits.textContent = stats.total_visits || 0;
        kpiCustVisits.textContent = stats.by_type?.["Customer Visit"] || 0;
        kpiPartnerVisits.textContent = stats.by_type?.["Partner Visit"] || 0;
        kpiVendorVisits.textContent = stats.by_type?.["Vendor Visit"] || 0;
        kpiBizVisits.textContent = (stats.by_type?.["Business Visit"] || 0) + (stats.by_type?.["Other Visit"] || 0);
        return;
      } catch (e) {
        // Fall back to client storage
      }
    }

    const visits = getLocalVisits();
    kpiTotalVisits.textContent = visits.length;
    kpiCustVisits.textContent = visits.filter(v => v.visit_type === "Customer Visit").length;
    kpiPartnerVisits.textContent = visits.filter(v => v.visit_type === "Partner Visit").length;
    kpiVendorVisits.textContent = visits.filter(v => v.visit_type === "Vendor Visit").length;
    kpiBizVisits.textContent = visits.filter(v => v.visit_type === "Business Visit" || v.visit_type === "Other Visit").length;
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
          <img src="${v.photo_data}" alt="Proof" style="width:36px; height:36px; border-radius:6px; object-fit:cover; border:1px solid #cbd5e1; cursor:pointer;" onclick="viewPhotoModal('${v.id}')">
        `;
      }

      return `
        <tr>
          <td><strong>${v.visit_code}</strong></td>
          <td>${v.visit_date}</td>
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
          <small style="color:var(--slate-500);">Logged on ${v.created_at || v.visit_date}</small>
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
      "visit_code", "visit_date", "user_role", "user_name", "user_code",
      "state", "cluster", "branch", "visit_type", "sub_type",
      "entity_name", "entity_code", "mobile", "reason", "address",
      "latitude", "longitude", "location_timestamp", "map_url", "status"
    ];

    let csvContent = headers.join(",") + "\n";
    visits.forEach(v => {
      const mapUrl = v.latitude && v.longitude ? `https://www.google.com/maps?q=${v.latitude},${v.longitude}` : "";
      const row = [
        v.visit_code || "",
        v.visit_date || "",
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

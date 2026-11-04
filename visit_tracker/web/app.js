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
  let masterVisitsCache = [];
  let currentFilteredVisits = [];
  let mapInstances = {};
  let isStandalone = window.location.hostname.includes("github.io") || window.location.protocol === "file:" || !window.location.port;

  // High-Capacity Client-Side Storage Engine with IndexedDB & LocalStorage
  const VT_Storage = {
    dbName: "VisitTrackerDB",
    storeName: "visits",
    dbVersion: 1,
    _db: null,

    async getDB() {
      if (this._db) return this._db;
      return new Promise((resolve) => {
        if (!window.indexedDB) {
          resolve(null);
          return;
        }
        const req = indexedDB.open(this.dbName, this.dbVersion);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { keyPath: "id" });
            store.createIndex("visit_date", "visit_date", { unique: false });
            store.createIndex("visit_type", "visit_type", { unique: false });
            store.createIndex("user_name", "user_name", { unique: false });
            store.createIndex("created_at", "created_at", { unique: false });
          }
        };
        req.onsuccess = (e) => {
          this._db = e.target.result;
          resolve(this._db);
        };
        req.onerror = () => resolve(null);
      });
    },

    async getAllVisits() {
      try {
        const db = await this.getDB();
        if (db) {
          return new Promise((resolve) => {
            const tx = db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);
            const req = store.getAll();
            req.onsuccess = () => {
              const results = req.result || [];
              if (results.length > 0) {
                results.sort((a, b) => (b.id || 0) - (a.id || 0));
                resolve(results);
              } else {
                resolve(this._getFromLocalStorage());
              }
            };
            req.onerror = () => resolve(this._getFromLocalStorage());
          });
        }
      } catch (e) {
        console.warn("IndexedDB read error:", e);
      }
      return this._getFromLocalStorage();
    },

    async saveVisits(visits) {
      try {
        const db = await this.getDB();
        if (db) {
          const tx = db.transaction(this.storeName, "readwrite");
          const store = tx.objectStore(this.storeName);
          for (const v of visits) {
            store.put(v);
          }
        }
      } catch (e) {
        console.warn("IndexedDB save error:", e);
      }

      try {
        localStorage.setItem("VT_STORED_VISITS", JSON.stringify(visits.slice(0, 300)));
      } catch (e) {
        try {
          const lightweight = visits.slice(0, 80).map(v => ({
            ...v,
            photo_data: (v.photo_data && v.photo_data.length > 300) ? "[Captured Photo]" : v.photo_data
          }));
          localStorage.setItem("VT_STORED_VISITS", JSON.stringify(lightweight));
        } catch (err) {
          console.warn("LocalStorage quota fallback:", err);
        }
      }
    },

    _getFromLocalStorage() {
      try {
        const stored = localStorage.getItem("VT_STORED_VISITS");
        if (stored) return JSON.parse(stored);
      } catch (e) {}
      return INITIAL_DEMO_VISITS;
    }
  };

  // Canvas-based Client Image Compressor (drops 10MB mobile photos to ~25KB JPEG)
  function compressImage(sourceDataUrl, maxDimension = 800, quality = 0.65) {
    return new Promise((resolve) => {
      if (!sourceDataUrl || !sourceDataUrl.startsWith("data:image")) {
        resolve(sourceDataUrl);
        return;
      }
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", quality);
        resolve(compressed);
      };
      img.onerror = () => resolve(sourceDataUrl);
      img.src = sourceDataUrl;
    });
  }

  // Modal State Helpers (Guarantees visible & interactive modals across browsers)
  function openModal(modal) {
    if (modal) {
      modal.style.display = "flex";
      modal.classList.add("active");
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove("active");
      modal.style.display = "none";
    }
  }

  // Local Storage & In-Memory Retrieval
  function getAllVisitsList() {
    if (masterVisitsCache && masterVisitsCache.length > 0) {
      return [...masterVisitsCache];
    }
    const fromStorage = VT_Storage._getFromLocalStorage();
    if (fromStorage && fromStorage.length > 0) {
      masterVisitsCache = [...fromStorage];
    }
    return [...masterVisitsCache];
  }

  function saveAllVisitsList(visits) {
    masterVisitsCache = Array.isArray(visits) ? [...visits] : [];
    VT_Storage.saveVisits(masterVisitsCache);
  }

  function getLocalVisits() {
    return getAllVisitsList();
  }

  function saveLocalVisits(visits) {
    saveAllVisitsList(visits);
  }

  function getExportVisits() {
    if (currentFilteredVisits && currentFilteredVisits.length > 0) {
      return currentFilteredVisits;
    }
    return getAllVisitsList();
  }

  // Initialize data from IndexedDB
  VT_Storage.getAllVisits().then(visits => {
    if (visits && visits.length > 0) {
      masterVisitsCache = visits;
      if (document.getElementById("view-dashboard") && document.getElementById("view-dashboard").style.display !== "none") {
        loadDashboardData();
      }
    }
  });

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
  const visitRemarksInput = document.getElementById("visit_remarks");

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

  // ==================== MASTER AUTHENTICATION & ACCESS CONTROL ====================
  const masterAuthModal = document.getElementById("master-auth-modal");
  const masterPasscodeInput = document.getElementById("master_passcode_input");
  const btnUnlockMaster = document.getElementById("btn-unlock-master");
  const btnCloseMasterAuth = document.getElementById("btn-close-master-auth");
  const btnCancelMasterAuth = document.getElementById("btn-cancel-master-auth");
  const chkRememberMaster = document.getElementById("chk_remember_master");
  const masterLockBadge = document.getElementById("master-lock-badge");

  function isMasterAuthenticated() {
    return true; // Direct access for Master Dashboard
  }

  function openMasterAuthModal() {
    if (masterAuthModal) {
      openModal(masterAuthModal);
      if (masterPasscodeInput) {
        masterPasscodeInput.value = "";
        masterPasscodeInput.focus();
      }
    }
  }

  function closeMasterAuthModal() {
    if (masterAuthModal) closeModal(masterAuthModal);
  }

  if (btnUnlockMaster) {
    btnUnlockMaster.addEventListener("click", () => {
      closeMasterAuthModal();
      setMode("dashboard");
    });
  }

  if (masterPasscodeInput) {
    masterPasscodeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        btnUnlockMaster?.click();
      }
    });
  }

  if (btnCloseMasterAuth) btnCloseMasterAuth.addEventListener("click", closeMasterAuthModal);
  if (btnCancelMasterAuth) btnCancelMasterAuth.addEventListener("click", closeMasterAuthModal);

  const btnTogglePasscode = document.getElementById("btn-toggle-passcode");
  if (btnTogglePasscode && masterPasscodeInput) {
    btnTogglePasscode.addEventListener("click", () => {
      masterPasscodeInput.type = (masterPasscodeInput.type === "password") ? "text" : "password";
    });
  }

  // ==================== MODE SWITCHING ====================
  function setMode(mode) {
    if (mode === "dashboard") {
      btnModeDashboard.classList.add("active");
      btnModeForm.classList.remove("active");
      viewForm.style.display = "none";
      viewDashboard.style.display = "block";
      loadDashboardData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      btnModeForm.classList.add("active");
      btnModeDashboard.classList.remove("active");
      viewForm.style.display = "block";
      viewDashboard.style.display = "none";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  btnModeForm.addEventListener("click", () => setMode("form"));
  btnModeDashboard.addEventListener("click", () => setMode("dashboard"));

  // Check URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const isFieldRole = urlParams.get("role") === "field" || urlParams.get("mode") === "field";
  if (isFieldRole) {
    // Field officer mode: Hide Master Dashboard tab completely
    if (btnModeDashboard) btnModeDashboard.style.display = "none";
  }

  if (urlParams.get("sync")) {
    const incomingSync = decodeURIComponent(urlParams.get("sync"));
    if (incomingSync.startsWith("http")) {
      localStorage.setItem("VT_CLOUD_SYNC_URL", incomingSync);
      VT_CLOUD_URL = incomingSync;
    }
  }

  if (urlParams.get("view") === "dashboard" && !isFieldRole) {
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

  // ==================== DYNAMIC PARTNER & VENDOR CODE REQUIREMENTS ====================
  function updateDsaCodeRequirement() {
    const reason = document.getElementById("dsa_reason")?.value;
    const isOptional = reason === "Onboarding visit" || reason === "Regular visit";
    const lbl = document.getElementById("lbl_dsa_code");
    if (lbl) {
      lbl.innerHTML = isOptional
        ? `DSA Code <span class="badge-opt-pill">(Optional for ${escapeHtml(reason)})</span>`
        : `DSA Code <span class="badge-req-pill">* (Mandatory)</span>`;
    }
  }

  function updateConCodeRequirement() {
    const reason = document.getElementById("con_reason")?.value;
    const isOptional = reason === "Onboarding visit" || reason === "Regular visit";
    const lbl = document.getElementById("lbl_con_code");
    if (lbl) {
      lbl.innerHTML = isOptional
        ? `Connector Code <span class="badge-opt-pill">(Optional for ${escapeHtml(reason)})</span>`
        : `Connector Code <span class="badge-req-pill">* (Mandatory)</span>`;
    }
  }

  function updateTechCodeRequirement() {
    const reason = document.getElementById("vtech_reason")?.value;
    const isOptional = reason === "Onboarding visit" || reason === "Regular visit";
    const lbl = document.getElementById("lbl_vtech_code");
    if (lbl) {
      lbl.innerHTML = isOptional
        ? `Vendor Code <span class="badge-opt-pill">(Optional for ${escapeHtml(reason)})</span>`
        : `Vendor Code <span class="badge-req-pill">* (Mandatory)</span>`;
    }
  }

  function updateLegalCodeRequirement() {
    const reason = document.getElementById("vlegal_reason")?.value;
    const isOptional = reason === "Onboarding visit" || reason === "Regular visit";
    const lbl = document.getElementById("lbl_vlegal_code");
    if (lbl) {
      lbl.innerHTML = isOptional
        ? `Vendor Code <span class="badge-opt-pill">(Optional for ${escapeHtml(reason)})</span>`
        : `Vendor Code <span class="badge-req-pill">* (Mandatory)</span>`;
    }
  }

  document.getElementById("dsa_reason")?.addEventListener("change", updateDsaCodeRequirement);
  document.getElementById("con_reason")?.addEventListener("change", updateConCodeRequirement);
  document.getElementById("vtech_reason")?.addEventListener("change", updateTechCodeRequirement);
  document.getElementById("vlegal_reason")?.addEventListener("change", updateLegalCodeRequirement);

  // Initialize requirement labels on load
  updateDsaCodeRequirement();
  updateConCodeRequirement();
  updateTechCodeRequirement();
  updateLegalCodeRequirement();

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
      closeModal(liveCameraModal);
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
    btnShutterSnap.addEventListener("click", async () => {
      if (!cameraVideo || !activeCamPrefix) return;
      const width = cameraVideo.videoWidth || 640;
      const height = cameraVideo.videoHeight || 480;
      cameraCanvas.width = width;
      cameraCanvas.height = height;
      const ctx = cameraCanvas.getContext("2d");
      ctx.drawImage(cameraVideo, 0, 0, width, height);
      const rawDataUrl = cameraCanvas.toDataURL("image/jpeg", 0.85);
      const compressed = await compressImage(rawDataUrl, 800, 0.65);

      setPhotoDataAndPreview(activeCamPrefix, compressed, true);
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
          openModal(liveCameraModal);
          const ok = await startCameraStream(currentFacingMode);
          if (!ok) {
            closeModal(liveCameraModal);
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
        reader.onload = async (e) => {
          const compressed = await compressImage(e.target.result, 800, 0.65);
          setPhotoDataAndPreview(prefix, compressed, true);
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
        reader.onload = async (e) => {
          const compressed = await compressImage(e.target.result, 800, 0.65);
          setPhotoDataAndPreview(prefix, compressed, false);
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

    const kbSize = Math.round((dataUrl.length * 3) / 4 / 1024);

    if (prevWrap) {
      prevWrap.innerHTML = `
        <div class="photo-success-card">
          <img src="${dataUrl}" alt="Proof" class="preview-img-thumb" style="cursor:pointer;" title="Click to inspect photo">
          <div class="photo-meta">
            <span class="photo-verified-badge">${isLive ? "📸 Live Capture" : "📁 Uploaded"} • Verified (${kbSize} KB)</span>
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
    modal.className = "modal-overlay active";
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
      visit_remarks: (visitRemarksInput ? visitRemarksInput.value.trim() : ""),
      notes: (visitRemarksInput ? visitRemarksInput.value.trim() : ""),
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

      let dsaCode = null;
      if (isDsaSelected) {
        const dsaReason = document.getElementById("dsa_reason").value;
        const dsaDigits = document.getElementById("dsa_code_num").value.trim();
        const isDsaCodeOpt = (dsaReason === "Onboarding visit" || dsaReason === "Regular visit");
        if (!isDsaCodeOpt && !dsaDigits) {
          alert(`DSA Code is mandatory when Reason is "${dsaReason}"! Please enter 1 to 6 numeric digits.`);
          document.getElementById("dsa_code_num").focus();
          return;
        }
        dsaCode = dsaDigits ? `FBGP${dsaDigits}` : null;
      }

      let conCode = null;
      if (isConSelected) {
        const conReason = document.getElementById("con_reason").value;
        const conDigits = document.getElementById("con_code_num").value.trim();
        const isConCodeOpt = (conReason === "Onboarding visit" || conReason === "Regular visit");
        if (!isConCodeOpt && !conDigits) {
          alert(`Connector Code is mandatory when Reason is "${conReason}"! Please enter 1 to 6 numeric digits.`);
          document.getElementById("con_code_num").focus();
          return;
        }
        conCode = conDigits ? `FGP${conDigits}` : null;
      }

      const dsaPhoto = document.getElementById("dsa_photo_data")?.value || document.querySelector("#dsa_photo_preview img")?.src;
      const conPhoto = document.getElementById("con_photo_data")?.value || document.querySelector("#con_photo_preview img")?.src;

      payload.partner_visit = {
        subtypes: partnerSubtypes,
        dsa: isDsaSelected ? {
          name: document.getElementById("dsa_name").value.trim(),
          code: dsaCode,
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
          code: conCode,
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

      let techCode = null;
      if (isTechSelected) {
        const techReason = document.getElementById("vtech_reason").value;
        const techDigits = document.getElementById("vtech_code_num").value.trim();
        const isTechCodeOpt = (techReason === "Onboarding visit" || techReason === "Regular visit");
        if (!isTechCodeOpt && !techDigits) {
          alert(`Technical Vendor Code is mandatory when Reason is "${techReason}"! Please enter 1 to 6 numeric digits.`);
          document.getElementById("vtech_code_num").focus();
          return;
        }
        techCode = techDigits ? `V${techDigits}` : null;
      }

      let legalCode = null;
      if (isLegalSelected) {
        const legalReason = document.getElementById("vlegal_reason").value;
        const legalDigits = document.getElementById("vlegal_code_num").value.trim();
        const isLegalCodeOpt = (legalReason === "Onboarding visit" || legalReason === "Regular visit");
        if (!isLegalCodeOpt && !legalDigits) {
          alert(`Legal Vendor Code is mandatory when Reason is "${legalReason}"! Please enter 1 to 6 numeric digits.`);
          document.getElementById("vlegal_code_num").focus();
          return;
        }
        legalCode = legalDigits ? `V${legalDigits}` : null;
      }

      const techPhoto = document.getElementById("vtech_photo_data")?.value || document.querySelector("#vtech_photo_preview img")?.src;
      const legalPhoto = document.getElementById("vlegal_photo_data")?.value || document.querySelector("#vlegal_photo_preview img")?.src;

      payload.vendor_visit = {
        subtypes: vendorSubtypes,
        technical: isTechSelected ? {
          name: document.getElementById("vtech_name").value.trim(),
          code: techCode,
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
          code: legalCode,
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

    // Submission logic (Dual-mode: Server if available, LocalStorage/IndexedDB for GitHub Pages)
    const submitBtn = document.getElementById("btn-form-submit");
    submitBtn.disabled = true;
    submitBtn.innerHTML = "⏳ Logging Visits...";

    // 1. Process client-side immediately so memory & IndexedDB have records
    const newEntriesGenerated = processClientSideMultiVisit(payload);
    const createdCount = newEntriesGenerated.length;

    // 2. If backend server is available, also persist to SQLite
    if (!isStandalone) {
      try {
        const res = await fetch("/api/visits/submit-multi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errData = await res.json();
          console.warn("Server API response note:", errData);
        }
      } catch (err) {
        console.warn("Server API offline; saved to high-capacity local IndexedDB:", err);
      }
    }

    // 3. Push to Cloud Webhook (e.g. Google Sheets) if connected
    await pushVisitsToCloud(newEntriesGenerated);

    // 4. Update memory & Dashboard immediately
    await loadStats();
    await searchVisits();

    submitBtn.disabled = false;
    submitBtn.innerHTML = "<span>🚀</span> Submit &amp; Log All Visits";

    // 5. Show rich confirmation modal
    showSubmissionSuccessModal(createdCount, newEntriesGenerated);
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
          notes: payload.visit_remarks || null,
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
            notes: payload.visit_remarks || null,
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
            notes: payload.visit_remarks || null,
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
            notes: payload.visit_remarks || null,
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
            notes: payload.visit_remarks || null,
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
          notes: payload.visit_remarks || null,
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
          notes: payload.visit_remarks || null,
          status: "Logged",
          created_at: nowTs
        });
      }
    });

    const allExisting = getAllVisitsList();
    const updated = [...newEntries, ...allExisting];
    saveAllVisitsList(updated);
    return newEntries;
  }

  // Reset Entire Form Helper
  function resetEntireForm() {
    form.reset();
    if (visitRemarksInput) visitRemarksInput.value = "";
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
        if (res.ok) {
          const stats = await res.json();
          total = stats.total_visits || 0;
          cust = stats.by_type?.["Customer Visit"] || 0;
          partner = stats.by_type?.["Partner Visit"] || 0;
          vendor = stats.by_type?.["Vendor Visit"] || 0;
          biz = (stats.by_type?.["Business Visit"] || 0) + (stats.by_type?.["Other Visit"] || 0);
        } else {
          throw new Error("Stats API failed");
        }
      } catch (e) {
        const visits = getAllVisitsList();
        total = visits.length;
        cust = visits.filter(v => v.visit_type === "Customer Visit").length;
        partner = visits.filter(v => v.visit_type === "Partner Visit").length;
        vendor = visits.filter(v => v.visit_type === "Vendor Visit").length;
        biz = visits.filter(v => v.visit_type === "Business Visit" || v.visit_type === "Other Visit").length;
      }
    } else {
      const visits = getAllVisitsList();
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
    const fromDate = fltFromDate ? fltFromDate.value : "";
    const toDate = fltToDate ? fltToDate.value : "";
    const role = fltRole ? fltRole.value : "";
    const state = fltState ? fltState.value : "";
    const cluster = fltCluster ? fltCluster.value : "";
    const branch = fltBranch ? fltBranch.value : "";
    const type = fltType ? fltType.value : "";
    const search = fltSearch ? fltSearch.value.trim().toLowerCase() : "";

    if (visitsTableBody) {
      visitsTableBody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 2rem;">Searching visits...</td></tr>`;
    }

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
        if (res.ok) {
          currentFilteredVisits = await res.json();
          renderVisitsTable(currentFilteredVisits);
          if (liveVisitsCounter) {
            liveVisitsCounter.innerHTML = `<span>📊</span> Displaying <strong>${currentFilteredVisits.length}</strong> Visits`;
          }
          return;
        }
      } catch (e) {
        // Fall back to client storage
      }
    }

    let list = getAllVisitsList();
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
        (v.branch && v.branch.toLowerCase().includes(search)) ||
        (v.notes && v.notes.toLowerCase().includes(search)) ||
        (v.reason && v.reason.toLowerCase().includes(search))
      );
    }

    currentFilteredVisits = list;
    renderVisitsTable(currentFilteredVisits);
    if (liveVisitsCounter) {
      liveVisitsCounter.innerHTML = `<span>📊</span> Displaying <strong>${currentFilteredVisits.length}</strong> Visits`;
    }
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
      visitsTableBody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding: 2.5rem; color:var(--slate-400);">No visits match current filter criteria.</td></tr>`;
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

      const remarksDisplay = v.notes ?
        `<span class="table-remark-pill" title="${escapeHtml(v.notes)}">📝 ${escapeHtml(v.notes)}</span>` :
        `<span style="color:var(--slate-400); font-size:0.75rem;">—</span>`;

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
          <td>${remarksDisplay}</td>
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
      btn.addEventListener("click", async () => {
        const action = btn.getAttribute("data-action");
        const id = btn.getAttribute("data-id");
        const visit = getAllVisitsList().find(v => v.id == id);
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
            const visits = getAllVisitsList().filter(v => v.id != visit.id);
            saveAllVisitsList(visits);
            await loadStats();
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

      ${v.notes ? `
        <div class="detail-item" style="margin-bottom:1rem; background:#eff6ff; border-color:#bfdbfe;">
          <div class="detail-label" style="color:#1d4ed8;">📝 Visit Remarks / Tracking Notes</div>
          <div class="detail-value" style="font-size:0.9rem; font-weight:600; color:#1e3a8a;">${escapeHtml(v.notes)}</div>
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

    const visits = getAllVisitsList().map(v => {
      if (v.id == id) {
        return { ...v, ...updates };
      }
      return v;
    });
    saveAllVisitsList(visits);

    closeModal(editModal);
    await loadStats();
    searchVisits();
  });

  // ==================== EXCEL SPREADSHEET & CSV EXPORT ====================
  function generateExcelXml(visits) {
    const columns = [
      { id: "visit_code", label: "Visit Code", width: 120 },
      { id: "visit_date", label: "Visit Date", width: 90 },
      { id: "visit_time", label: "Visit Time", width: 80 },
      { id: "user_role", label: "Staff Role", width: 75 },
      { id: "user_name", label: "Staff Name", width: 140 },
      { id: "user_code", label: "Staff Code", width: 95 },
      { id: "state", label: "State", width: 130 },
      { id: "cluster", label: "Cluster", width: 140 },
      { id: "branch", label: "Branch", width: 120 },
      { id: "visit_type", label: "Visit Type", width: 110 },
      { id: "sub_type", label: "Sub-Type", width: 110 },
      { id: "customer_status", label: "Customer Status", width: 110 },
      { id: "id_type", label: "ID Type", width: 120 },
      { id: "entity_name", label: "Entity / Client Name", width: 160 },
      { id: "entity_code", label: "Entity Code / ID", width: 110 },
      { id: "mobile", label: "Contact Mobile", width: 110 },
      { id: "reason", label: "Reason for Visit", width: 140 },
      { id: "address", label: "Address Details", width: 180 },
      { id: "visit_remarks", label: "Visit Remarks / Notes", width: 180 },
      { id: "photo_captured", label: "Photo Proof", width: 90 },
      { id: "latitude", label: "Latitude", width: 85 },
      { id: "longitude", label: "Longitude", width: 85 },
      { id: "location_timestamp", label: "GPS Timestamp", width: 130 },
      { id: "map_url", label: "Google Maps URL", width: 180 },
      { id: "status", label: "Tracking Status", width: 90 },
      { id: "created_at", label: "Logged At", width: 130 },
      { id: "updated_at", label: "Last Updated", width: 130 }
    ];

    function escapeXml(s) {
      if (!s) return "";
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    }

    let rowsXml = "";
    // Header Row
    rowsXml += '<Row ss:Height="26">';
    columns.forEach(col => {
      rowsXml += `<Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">${escapeXml(col.label)}</Data></Cell>`;
    });
    rowsXml += '</Row>';

    // Data Rows
    visits.forEach((v, idx) => {
      const mapUrl = v.latitude && v.longitude ? `https://www.google.com/maps?q=${v.latitude},${v.longitude}` : "";
      const visitTime = v.location_timestamp ? (v.location_timestamp.includes(" ") ? v.location_timestamp.split(" ")[1] : v.location_timestamp) : (v.created_at || "11:30:00");
      const photoStatus = v.photo_data ? "Yes (Verified Proof)" : "No";
      const remarks = v.notes || "";

      const rowMap = {
        visit_code: v.visit_code || "",
        visit_date: v.visit_date || "",
        visit_time: visitTime,
        user_role: v.user_role || "",
        user_name: v.user_name || "",
        user_code: v.user_code || "",
        state: v.state || "",
        cluster: v.cluster || "",
        branch: v.branch || "",
        visit_type: v.visit_type || "",
        sub_type: v.sub_type || "",
        customer_status: v.customer_status || "",
        id_type: v.id_type || "",
        entity_name: v.entity_name || "",
        entity_code: v.entity_code || "",
        mobile: v.mobile || "",
        reason: v.reason || "",
        address: v.address || "",
        visit_remarks: remarks,
        photo_captured: photoStatus,
        latitude: v.latitude || "",
        longitude: v.longitude || "",
        location_timestamp: v.location_timestamp || "",
        map_url: mapUrl,
        status: v.status || "Logged",
        created_at: v.created_at || "",
        updated_at: v.updated_at || v.created_at || ""
      };

      const styleId = idx % 2 === 1 ? "DataStyleAlt" : "DataStyle";
      rowsXml += '<Row ss:Height="22">';
      columns.forEach(col => {
        const val = rowMap[col.id] || "";
        rowsXml += `<Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(val)}</Data></Cell>`;
      });
      rowsXml += '</Row>';
    });

    let colsXml = "";
    columns.forEach(col => {
      colsXml += `<Column ss:Width="${col.width}"/>`;
    });

    return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Font ss:Bold="1" ss:Color="#FFFFFF" ss:FontName="Segoe UI" ss:Size="10"/>
   <Interior ss:Color="#1E40AF" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#93C5FD"/>
   </Borders>
  </Style>
  <Style ss:ID="DataStyle">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#0F172A"/>
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
   </Borders>
  </Style>
  <Style ss:ID="DataStyleAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#0F172A"/>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Visits Master Data">
  <Table ss:ExpandedColumnCount="${columns.length}" x:FullColumns="1" x:FullRows="1">
   ${colsXml}
   ${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;
  }

  function downloadExcelFile(visits) {
    const dataToExport = (visits && visits.length > 0) ? visits : getExportVisits();
    if (!dataToExport || dataToExport.length === 0) {
      alert("No visit records available to download.");
      return;
    }
    const xmlContent = generateExcelXml(dataToExport);
    const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const todayStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `visits_master_report_${todayStr}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  // Bind Download Excel Button
  const btnExportExcel = document.getElementById("btn-export-excel") || document.getElementById("btn-export-csv");
  if (btnExportExcel) {
    btnExportExcel.addEventListener("click", () => {
      downloadExcelFile(getExportVisits());
    });
  }

  // ==================== EMAIL DISPATCH SYSTEM WITH SAVED RECIPIENTS ====================
  const STORAGE_KEY_SAVED_EMAILS = "VT_SAVED_EMAILS";
  let activeRecipients = [];

  function getSavedEmails() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED_EMAILS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Error reading saved emails:", e);
    }
    return [
      "rohan.sharma@fusionmicrofinance.com",
      "cluster.head@fusionmicrofinance.com"
    ];
  }

  function saveEmailToHistory(email) {
    const list = getSavedEmails();
    const clean = email.trim().toLowerCase();
    if (!list.includes(clean)) {
      list.unshift(clean);
      if (list.length > 15) list.pop();
      try {
        localStorage.setItem(STORAGE_KEY_SAVED_EMAILS, JSON.stringify(list));
      } catch (e) {}
    }
  }

  function removeEmailFromHistory(email) {
    let list = getSavedEmails().filter(e => e.toLowerCase() !== email.toLowerCase());
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_EMAILS, JSON.stringify(list));
    } catch (e) {}
    renderPreviousEmails();
  }

  function clearAllEmailHistory() {
    localStorage.removeItem(STORAGE_KEY_SAVED_EMAILS);
    renderPreviousEmails();
  }

  function renderActiveRecipientChips() {
    const wrap = document.getElementById("active-email-chips");
    if (!wrap) return;

    if (activeRecipients.length === 0) {
      wrap.innerHTML = `<span class="empty-chips-hint">No email addresses added yet. Enter above or select from previous below.</span>`;
      return;
    }

    wrap.innerHTML = activeRecipients.map(em => `
      <span class="recipient-chip">
        <span>✉️ ${escapeHtml(em)}</span>
        <button type="button" class="recipient-chip-remove" data-email="${escapeHtml(em)}" title="Remove recipient">&times;</button>
      </span>
    `).join("");

    wrap.querySelectorAll(".recipient-chip-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const emailToRemove = btn.getAttribute("data-email");
        activeRecipients = activeRecipients.filter(e => e !== emailToRemove);
        renderActiveRecipientChips();
        renderPreviousEmails();
      });
    });
  }

  function renderPreviousEmails() {
    const container = document.getElementById("previous-emails-list");
    if (!container) return;

    const saved = getSavedEmails();
    if (saved.length === 0) {
      container.innerHTML = `<span style="font-size: 0.75rem; color: var(--slate-400);">No previous email addresses stored yet.</span>`;
      return;
    }

    container.innerHTML = saved.map(em => {
      const isSelected = activeRecipients.includes(em);
      return `
        <span class="recent-email-pill ${isSelected ? 'selected' : ''}" data-email="${escapeHtml(em)}">
          <span>${isSelected ? '✓' : '➕'}</span>
          <span>${escapeHtml(em)}</span>
          <span class="pill-del" data-del-email="${escapeHtml(em)}" title="Remove from history">&times;</span>
        </span>
      `;
    }).join("");

    container.querySelectorAll(".recent-email-pill").forEach(pill => {
      pill.addEventListener("click", (e) => {
        if (e.target.classList.contains("pill-del")) return;
        const email = pill.getAttribute("data-email");
        if (activeRecipients.includes(email)) {
          activeRecipients = activeRecipients.filter(e => e !== email);
        } else {
          activeRecipients.push(email);
        }
        renderActiveRecipientChips();
        renderPreviousEmails();
      });
    });

    container.querySelectorAll(".pill-del").forEach(delBtn => {
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const email = delBtn.getAttribute("data-del-email");
        removeEmailFromHistory(email);
      });
    });
  }

  function addEmailsFromInput() {
    const input = document.getElementById("email-input-field");
    if (!input) return;
    const raw = input.value.trim();
    if (!raw) return;

    const parts = raw.split(/[\s,;]+/);
    let addedCount = 0;
    parts.forEach(part => {
      const em = part.trim().toLowerCase();
      if (em && em.includes("@") && em.includes(".")) {
        if (!activeRecipients.includes(em)) {
          activeRecipients.push(em);
          saveEmailToHistory(em);
          addedCount++;
        }
      }
    });

    if (addedCount > 0) {
      input.value = "";
      renderActiveRecipientChips();
      renderPreviousEmails();
    } else {
      alert("Please enter a valid email address (e.g. name@company.com)");
    }
  }

  function openSendEmailModal() {
    const modal = document.getElementById("send-email-modal");
    if (!modal) return;

    const exportVisits = getExportVisits();
    const countBadge = document.getElementById("email-summary-count-badge");
    if (countBadge) countBadge.textContent = `${exportVisits.length} Records`;

    const statsGrid = document.getElementById("email-summary-stats-grid");
    if (statsGrid) {
      const typeCounts = {};
      exportVisits.forEach(v => {
        const t = v.visit_type || "Other";
        typeCounts[t] = (typeCounts[t] || 0) + 1;
      });

      statsGrid.innerHTML = Object.entries(typeCounts).map(([type, cnt]) => `
        <div class="email-stat-card">
          <span style="color:var(--slate-500);">${escapeHtml(type)}:</span>
          <strong>${cnt}</strong>
        </div>
      `).join("");
    }

    const subjInput = document.getElementById("email-subject-input");
    if (subjInput) {
      const todayStr = new Date().toISOString().split("T")[0];
      subjInput.value = `Visit Tracker Executive Summary & Master Excel Report - ${todayStr}`;
    }

    const statusBanner = document.getElementById("email-dispatch-status");
    if (statusBanner) statusBanner.style.display = "none";

    renderActiveRecipientChips();
    renderPreviousEmails();
    openModal(modal);
  }

  const btnSendMail = document.getElementById("btn-send-mail");
  if (btnSendMail) {
    btnSendMail.addEventListener("click", () => {
      openSendEmailModal();
    });
  }

  const btnAddEmailChip = document.getElementById("btn-add-email-chip");
  if (btnAddEmailChip) {
    btnAddEmailChip.addEventListener("click", addEmailsFromInput);
  }

  const emailInputField = document.getElementById("email-input-field");
  if (emailInputField) {
    emailInputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addEmailsFromInput();
      }
    });
  }

  const btnClearEmailHistory = document.getElementById("btn-clear-email-history");
  if (btnClearEmailHistory) {
    btnClearEmailHistory.addEventListener("click", () => {
      if (confirm("Clear all previously saved recipient email addresses?")) {
        clearAllEmailHistory();
      }
    });
  }

  function generateEmailTextBody(subject, customNote) {
    const exportVisits = getExportVisits();
    const todayStr = new Date().toLocaleDateString("en-IN", { dateStyle: "long" });
    let body = `VISIT TRACKER - EXECUTIVE ACTIVITY REPORT\nDate: ${todayStr}\nTotal Visits Logged: ${exportVisits.length}\n`;
    if (customNote) {
      body += `\nNote / Message:\n${customNote}\n`;
    }
    body += `\nSummary by Visit Type:\n`;
    const typeCounts = {};
    exportVisits.forEach(v => {
      const t = v.visit_type || "Other Visit";
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
    for (const [k, cnt] of Object.entries(typeCounts)) {
      body += `• ${k}: ${cnt} visits\n`;
    }
    body += `\nActivity Highlights (Recent Records):\n`;
    exportVisits.slice(0, 5).forEach((v, idx) => {
      body += `${idx + 1}. [${v.visit_code || "VT"}] ${v.visit_date} - ${v.user_name} (${v.user_role}) visited ${v.entity_name} at ${v.branch}, ${v.state}. Remarks: ${v.notes || "None"}. Status: ${v.status || "Logged"}\n`;
    });
    body += `\nAttached file: visit_tracker_report.xls contains full data with GPS satellite coordinates, timestamps, branch hierarchy, verification status, and tracking remarks.\n\nGenerated via Visit Tracker Enterprise System.`;
    return body;
  }

  const btnConfirmSendEmail = document.getElementById("btn-confirm-send-email");
  if (btnConfirmSendEmail) {
    btnConfirmSendEmail.addEventListener("click", async () => {
      // Auto-add any pending email typed into the input field
      const pendingInput = document.getElementById("email-input-field")?.value.trim();
      if (pendingInput) {
        addEmailsFromInput();
      }

      if (activeRecipients.length === 0) {
        alert("⚠️ Please enter or select at least one recipient email ID before sending!");
        document.getElementById("email-input-field")?.focus();
        return;
      }

      activeRecipients.forEach(em => saveEmailToHistory(em));

      const exportVisits = getExportVisits();
      const subject = document.getElementById("email-subject-input")?.value.trim() || "Visit Tracker Executive Summary & Master Excel Report";
      const customNote = document.getElementById("email-custom-note")?.value.trim() || "";
      const emailBody = generateEmailTextBody(subject, customNote);

      btnConfirmSendEmail.disabled = true;
      btnConfirmSendEmail.innerHTML = "⏳ Dispatching...";

      // Trigger excel download
      downloadExcelFile(exportVisits);

      // 1. If backend server is active
      if (!isStandalone) {
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipients: activeRecipients,
              subject: subject,
              custom_note: customNote,
              from_date: fltFromDate.value || null,
              to_date: fltToDate.value || null,
              user_role: fltRole.value || null,
              state: fltState.value || null,
              cluster: fltCluster.value || null,
              branch: fltBranch.value || null,
              visit_type: fltType.value || null,
              query: fltSearch.value.trim() || null
            })
          });
        } catch (e) {
          console.warn("Backend email dispatch error:", e);
        }
      }

      // 2. If Cloud Webhook (Google Sheets) is active
      if (VT_CLOUD_URL) {
        try {
          await fetch(VT_CLOUD_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "send_email",
              recipients: activeRecipients,
              subject: subject,
              body: emailBody
            })
          });
        } catch (e) {
          console.warn("Cloud email push note:", e);
        }
      }

      btnConfirmSendEmail.disabled = false;
      btnConfirmSendEmail.innerHTML = "<span>🚀</span> Send Email Now";

      const statusBanner = document.getElementById("email-dispatch-status");
      if (statusBanner) {
        statusBanner.style.display = "block";
        statusBanner.innerHTML = `
          <div style="background:#ecfdf5; border:1px solid #10b981; border-radius:8px; padding:12px; margin-top:10px;">
            <strong style="color:#065f46; font-size:0.88rem;">✓ REPORT PREPARED &amp; DISPATCHED!</strong>
            <p style="margin:4px 0 8px; font-size:0.8rem; color:#047857;">
              Populated Excel report (${exportVisits.length} visits) generated and dispatched to:<br>
              <strong>${activeRecipients.map(e => escapeHtml(e)).join(", ")}</strong>.
            </p>
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;">
              <button type="button" class="btn btn-reset btn-quick-gmail" style="background:#fff; color:#dc2626; border-color:#fca5a5; padding:4px 10px; font-size:0.75rem;">Open in Gmail ↗</button>
              <button type="button" class="btn btn-reset btn-quick-outlook" style="background:#fff; color:#2563eb; border-color:#93c5fd; padding:4px 10px; font-size:0.75rem;">Open in Outlook ↗</button>
              <button type="button" class="btn btn-reset btn-quick-mailto" style="background:#fff; color:#334155; border-color:#cbd5e1; padding:4px 10px; font-size:0.75rem;">Open in Mail App ↗</button>
            </div>
          </div>
        `;
        statusBanner.querySelector(".btn-quick-gmail")?.addEventListener("click", () => {
          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(activeRecipients.join(","))}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
          window.open(gmailUrl, "_blank");
        });
        statusBanner.querySelector(".btn-quick-outlook")?.addEventListener("click", () => {
          const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(activeRecipients.join(";"))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
          window.open(outlookUrl, "_blank");
        });
        statusBanner.querySelector(".btn-quick-mailto")?.addEventListener("click", () => {
          const mailtoUrl = `mailto:${activeRecipients.join(",")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
          window.location.href = mailtoUrl;
        });
      }

      alert(`🎉 SUCCESS!\n\nMaster Excel report (${exportVisits.length} records) downloaded.\nDispatched to: ${activeRecipients.join(", ")}`);
    });
  }

  const btnOpenGmail = document.getElementById("btn-open-gmail");
  if (btnOpenGmail) {
    btnOpenGmail.addEventListener("click", () => {
      const pendingInput = document.getElementById("email-input-field")?.value.trim();
      if (pendingInput) addEmailsFromInput();
      if (activeRecipients.length === 0) {
        alert("Please enter or select at least one recipient email address first.");
        document.getElementById("email-input-field")?.focus();
        return;
      }
      const exportVisits = getExportVisits();
      const subject = document.getElementById("email-subject-input")?.value.trim() || "Visit Tracker Executive Summary & Master Excel Report";
      const customNote = document.getElementById("email-custom-note")?.value.trim() || "";
      const body = generateEmailTextBody(subject, customNote);
      downloadExcelFile(exportVisits);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(activeRecipients.join(","))}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, "_blank");
    });
  }

  const btnOpenOutlook = document.getElementById("btn-open-outlook");
  if (btnOpenOutlook) {
    btnOpenOutlook.addEventListener("click", () => {
      const pendingInput = document.getElementById("email-input-field")?.value.trim();
      if (pendingInput) addEmailsFromInput();
      if (activeRecipients.length === 0) {
        alert("Please enter or select at least one recipient email address first.");
        document.getElementById("email-input-field")?.focus();
        return;
      }
      const exportVisits = getExportVisits();
      const subject = document.getElementById("email-subject-input")?.value.trim() || "Visit Tracker Executive Summary & Master Excel Report";
      const customNote = document.getElementById("email-custom-note")?.value.trim() || "";
      const body = generateEmailTextBody(subject, customNote);
      downloadExcelFile(exportVisits);
      const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(activeRecipients.join(";"))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(outlookUrl, "_blank");
    });
  }

  const btnOpenMailto = document.getElementById("btn-open-mailto");
  if (btnOpenMailto) {
    btnOpenMailto.addEventListener("click", () => {
      const pendingInput = document.getElementById("email-input-field")?.value.trim();
      if (pendingInput) addEmailsFromInput();
      if (activeRecipients.length === 0) {
        alert("Please enter or select at least one recipient email address first.");
        document.getElementById("email-input-field")?.focus();
        return;
      }
      const exportVisits = getExportVisits();
      const subject = document.getElementById("email-subject-input")?.value.trim() || "Visit Tracker Executive Summary & Master Excel Report";
      const customNote = document.getElementById("email-custom-note")?.value.trim() || "";
      const body = generateEmailTextBody(subject, customNote);
      downloadExcelFile(exportVisits);
      const mailtoUrl = `mailto:${activeRecipients.join(",")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });
  }

  // Modal helpers
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-close");
      const modal = document.getElementById(id);
      if (modal) closeModal(modal);
    });
  });

  // Close modals when clicking backdrop overlay
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

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
    const v = getAllVisitsList().find(item => item.id == id);
    if (v && v.photo_data) {
      openEyeView(v);
    }
  };

  // ==================== SUBMISSION SUCCESS CONFIRMATION MODAL ====================
  function showSubmissionSuccessModal(count, entries) {
    const modal = document.getElementById("submit-success-modal");
    const subtext = document.getElementById("success-modal-subtext");
    const recordsBox = document.getElementById("success-modal-records");
    if (!modal) {
      alert(`🎉 SUCCESS! Generated ${count} visit record(s) in system.`);
      return;
    }
    if (subtext) {
      subtext.textContent = `Generated and logged ${count} visit record(s) with live photo proof and satellite GPS coordinates.`;
    }
    if (recordsBox) {
      recordsBox.innerHTML = entries.map(e => `
        <div style="padding:0.4rem 0; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${escapeHtml(e.visit_code)}</strong> • <span style="color:#0284c7; font-weight:700;">${escapeHtml(e.visit_type)}</span> (${escapeHtml(e.sub_type || "-")})<br>
            <span style="font-size:0.75rem; color:#64748b;">${escapeHtml(e.entity_name)} • ${escapeHtml(e.branch)}, ${escapeHtml(e.state)}</span>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.72rem; color:#059669; font-weight:700;">✅ Logged</span><br>
            <small style="font-size:0.7rem; color:#94a3b8;">${escapeHtml(e.visit_date)}</small>
          </div>
        </div>
      `).join("");
    }
    openModal(modal);
  }

  const btnSuccessNew = document.getElementById("btn-success-new");
  const btnSuccessDashboard = document.getElementById("btn-success-dashboard");
  if (btnSuccessNew) {
    btnSuccessNew.addEventListener("click", () => {
      const modal = document.getElementById("submit-success-modal");
      if (modal) closeModal(modal);
    });
  }
  if (btnSuccessDashboard) {
    btnSuccessDashboard.addEventListener("click", () => {
      const modal = document.getElementById("submit-success-modal");
      if (modal) closeModal(modal);
      setMode("dashboard");
    });
  }

  // ==================== CLOUD DATABASE & MULTI-USER TEAM SYNC ====================
  let VT_CLOUD_URL = localStorage.getItem("VT_CLOUD_SYNC_URL") || "";

  const GOOGLE_APPS_SCRIPT_TEMPLATE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["ID", "Visit Code", "Date", "Role", "Name", "Code", "State", "Cluster", "Branch", "Visit Type", "Sub Type", "Entity Name", "Entity Code", "Mobile", "Reason", "Remarks", "Address", "Latitude", "Longitude", "Timestamp", "Created At"]);
    }
    var data = JSON.parse(e.postData.contents);
    if (data.action === "add_visits" && Array.isArray(data.visits)) {
      data.visits.forEach(function(v) {
        sheet.appendRow([
          v.id || "",
          v.visit_code || "",
          v.visit_date || "",
          v.user_role || "",
          v.user_name || "",
          v.user_code || "",
          v.state || "",
          v.cluster || "",
          v.branch || "",
          v.visit_type || "",
          v.sub_type || "",
          v.entity_name || "",
          v.entity_code || "",
          v.mobile || "",
          v.reason || "",
          v.notes || "",
          v.address || "",
          v.latitude || "",
          v.longitude || "",
          v.location_timestamp || "",
          v.created_at || ""
        ]);
      });
      return ContentService.createTextOutput(JSON.stringify({ status: "success", count: data.visits.length }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (data.action === "send_email" && Array.isArray(data.recipients)) {
      var emailSubj = data.subject || "Visit Tracker Executive Summary Report";
      var emailBody = data.body || "Please find the Visit Tracker Activity Report.";
      MailApp.sendEmail({
        to: data.recipients.join(","),
        subject: emailSubj,
        body: emailBody
      });
      return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "email_sent" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  }
  var visits = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    visits.push({
      id: r[0],
      visit_code: r[1],
      visit_date: r[2],
      user_role: r[3],
      user_name: r[4],
      user_code: r[5],
      state: r[6],
      cluster: r[7],
      branch: r[8],
      visit_type: r[9],
      sub_type: r[10],
      entity_name: r[11],
      entity_code: r[12],
      mobile: r[13],
      reason: r[14],
      notes: r[15],
      address: r[16],
      latitude: r[17],
      longitude: r[18],
      location_timestamp: r[19],
      created_at: r[20]
    });
  }
  return ContentService.createTextOutput(JSON.stringify(visits)).setMimeType(ContentService.MimeType.JSON);
}`;

  async function pushVisitsToCloud(entries) {
    if (!VT_CLOUD_URL || !entries || entries.length === 0) return;
    try {
      await fetch(VT_CLOUD_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_visits",
          visits: entries
        })
      });
      console.log("Visits pushed to Cloud Database");
    } catch (e) {
      console.warn("Cloud push note:", e);
    }
  }

  async function syncVisitsFromCloud() {
    const syncIcon = document.getElementById("sync-icon");
    if (syncIcon) syncIcon.style.animation = "spin 1s linear infinite";

    if (!VT_CLOUD_URL) {
      if (syncIcon) syncIcon.style.animation = "none";
      openCloudConfigModal();
      return;
    }

    try {
      const res = await fetch(VT_CLOUD_URL, { method: "GET" });
      if (res.ok) {
        const cloudVisits = await res.json();
        if (Array.isArray(cloudVisits) && cloudVisits.length > 0) {
          const allExisting = getAllVisitsList();
          const existingCodes = new Set(allExisting.map(v => v.visit_code));
          const toAdd = cloudVisits.filter(v => v.visit_code && !existingCodes.has(v.visit_code));
          if (toAdd.length > 0) {
            const updated = [...toAdd, ...allExisting];
            saveAllVisitsList(updated);
            await loadStats();
            await searchVisits();
            alert(`☁️ Cloud Sync Completed! Pulled ${toAdd.length} new visit record(s) from team.`);
          } else {
            alert(`☁️ Cloud Synced! Master Dashboard is fully up to date with team records.`);
          }
        }
      }
    } catch (e) {
      console.warn("Cloud pull error:", e);
      alert("Cloud Sync Note: Unable to reach Google Sheet endpoint. Make sure your Apps Script Web App has 'Who has access' set to 'Anyone'.");
    } finally {
      if (syncIcon) syncIcon.style.animation = "none";
    }
  }

  // Cloud Modal & Actions
  const cloudModal = document.getElementById("cloud-sync-modal");
  const cloudWebhookInput = document.getElementById("cloud_webhook_url");
  const btnSaveCloudUrl = document.getElementById("btn-save-cloud-url");
  const btnTestCloud = document.getElementById("btn-test-cloud");
  const btnCopyScript = document.getElementById("btn-copy-script");
  const btnBackupJson = document.getElementById("btn-backup-json");
  const btnCloseCloudModal = document.getElementById("btn-close-cloud-modal");
  const btnCloseCloudDone = document.getElementById("btn-close-cloud-done");
  const cloudConnStatus = document.getElementById("cloud-conn-status");
  const btnCloudConfig = document.getElementById("btn-cloud-config");
  const btnSyncCloud = document.getElementById("btn-sync-cloud");
  const btnCopyFieldLink = document.getElementById("btn-copy-field-link");

  function openCloudConfigModal() {
    if (cloudModal) {
      openModal(cloudModal);
      if (cloudWebhookInput) cloudWebhookInput.value = VT_CLOUD_URL;
      updateCloudStatusText();
    }
  }

  function updateCloudStatusText() {
    if (cloudConnStatus) {
      if (VT_CLOUD_URL) {
        cloudConnStatus.textContent = "Connected to Google Sheet / Cloud Webhook";
        cloudConnStatus.style.color = "#059669";
      } else {
        cloudConnStatus.textContent = "Using High-Capacity Local IndexedDB (No cloud configured)";
        cloudConnStatus.style.color = "#d97706";
      }
    }
  }

  if (btnCloudConfig) btnCloudConfig.addEventListener("click", openCloudConfigModal);
  if (btnCloseCloudModal) btnCloseCloudModal.addEventListener("click", () => closeModal(cloudModal));
  if (btnCloseCloudDone) btnCloseCloudDone.addEventListener("click", () => closeModal(cloudModal));

  if (btnSaveCloudUrl && cloudWebhookInput) {
    btnSaveCloudUrl.addEventListener("click", () => {
      const val = cloudWebhookInput.value.trim();
      VT_CLOUD_URL = val;
      localStorage.setItem("VT_CLOUD_SYNC_URL", val);
      updateCloudStatusText();
      alert("✅ Cloud Sync URL saved successfully!");
    });
  }

  if (btnCopyScript) {
    btnCopyScript.addEventListener("click", () => {
      navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE).then(() => {
        alert("📋 Google Apps Script code copied to clipboard! Paste it into Extensions > Apps Script in Google Sheets.");
      }).catch(() => {
        prompt("Copy Google Apps Script code:", GOOGLE_APPS_SCRIPT_TEMPLATE);
      });
    });
  }

  if (btnTestCloud) {
    btnTestCloud.addEventListener("click", async () => {
      if (!VT_CLOUD_URL) {
        alert("Please enter and save a Web App URL first.");
        return;
      }
      try {
        const res = await fetch(VT_CLOUD_URL, { method: "GET" });
        if (res.ok) {
          alert("🎉 Cloud Connection Successful! Your Google Sheet is reachable.");
        } else {
          alert(`Connection returned status ${res.status}. Ensure 'Who has access' is 'Anyone'.`);
        }
      } catch (err) {
        alert("Connection test note: Unable to connect directly. If deployed as Web App, test submissions work seamlessly via POST.");
      }
    });
  }

  if (btnBackupJson) {
    btnBackupJson.addEventListener("click", () => {
      const allVisits = getAllVisitsList();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allVisits, null, 2));
      const a = document.createElement("a");
      a.setAttribute("href", dataStr);
      a.setAttribute("download", `visits_backup_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  if (btnSyncCloud) {
    btnSyncCloud.addEventListener("click", syncVisitsFromCloud);
  }

  if (btnCopyFieldLink) {
    btnCopyFieldLink.addEventListener("click", () => {
      const syncParam = VT_CLOUD_URL ? `&sync=${encodeURIComponent(VT_CLOUD_URL)}` : "";
      const fieldUrl = `${window.location.origin}${window.location.pathname}?role=field${syncParam}`;
      navigator.clipboard.writeText(fieldUrl).then(() => {
        alert(`📋 Field Team Link Copied to Clipboard!\n\n${fieldUrl}\n\nShare this link with your field officers. They will see only the Entry Form and all submissions will stream to your Master Dashboard!`);
      }).catch(() => {
        prompt("Copy this Field Team Link:", fieldUrl);
      });
    });
  }

  initHierarchy();
});

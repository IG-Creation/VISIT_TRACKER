// Visit Tracker Interactive Application Logic

document.addEventListener("DOMContentLoaded", () => {
  let hierarchyData = { states: [], hierarchy: {} };
  let currentVisits = [];
  let mapInstances = {};

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

  // Sub-sections
  const typeChips = document.querySelectorAll(".type-chip");
  const custStatusToggle = document.getElementById("cust-status-toggle");
  const custStatusVal = document.getElementById("cust_status_val");
  const existingCustIdRow = document.getElementById("existing-cust-id-row");

  // Partner checkboxes
  const chkPartnerDsa = document.getElementById("chk-partner-dsa");
  const chkPartnerCon = document.getElementById("chk-partner-connector");
  const partnerDsaBox = document.getElementById("partner-dsa-box");
  const partnerConBox = document.getElementById("partner-connector-box");

  // Vendor checkboxes
  const chkVendorTech = document.getElementById("chk-vendor-tech");
  const chkVendorLegal = document.getElementById("chk-vendor-legal");
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

    // 2 months ago (approx 60 days)
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
    // User Name: no numbers, auto-collapse spaces
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

    // User Code: numeric only, max 6 digits
    userCodeNumericInput.addEventListener("input", () => {
      userCodeNumericInput.value = userCodeNumericInput.value.replace(/\D/g, "").slice(0, 6);
    });

    // General name input restriction helper
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

    // Mobile inputs restriction (10 numeric digits)
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

    // Code numeric inputs restriction
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
  async function loadHierarchy() {
    try {
      const res = await fetch("/api/hierarchy");
      hierarchyData = await res.json();
      populateStateSelects();
    } catch (e) {
      console.error("Failed to load hierarchy:", e);
    }
  }

  function populateStateSelects() {
    // Form State
    stateSelect.innerHTML = '<option value="">Select State...</option>' +
      hierarchyData.states.map(s => `<option value="${s}">${s}</option>`).join("");

    // Master Filter State
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

      // Special Rule: Head Office
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

      // Special Rule: Auto-select if only 1 cluster
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

    // Special Rule: Auto-select if only 1 branch
    if (branches.length === 1 && isForm) {
      branchEl.value = branches[0];
    }
  }

  // ==================== VISIT TYPE MULTI-SELECT CHIPS & SUB-SECTIONS ====================
  typeChips.forEach(chip => {
    const checkbox = chip.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    chip.addEventListener("click", (e) => {
      if (e.target.tagName !== "INPUT") {
        checkbox.checked = !checkbox.checked;
      }
      const targetId = chip.getAttribute("data-target");
      const targetSubSec = document.getElementById(targetId);

      if (checkbox.checked) {
        chip.classList.add("selected");
        if (targetSubSec) {
          targetSubSec.style.display = "block";
          targetSubSec.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      } else {
        chip.classList.remove("selected");
        if (targetSubSec) {
          targetSubSec.style.display = "none";
          // Clear sub section fields so no stale data remains per prompt
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
  }

  // Customer Status Toggle (New Customer vs Existing Customer)
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

  // Partner Visit: DSA & Connector Boxes
  chkPartnerDsa.addEventListener("change", () => {
    partnerDsaBox.style.display = chkPartnerDsa.checked ? "block" : "none";
    if (!chkPartnerDsa.checked) clearSubSectionInputs(partnerDsaBox);
  });
  chkPartnerCon.addEventListener("change", () => {
    partnerConBox.style.display = chkPartnerCon.checked ? "block" : "none";
    if (!chkPartnerCon.checked) clearSubSectionInputs(partnerConBox);
  });

  // Vendor Visit: Tech & Legal Boxes
  chkVendorTech.addEventListener("change", () => {
    vendorTechBox.style.display = chkVendorTech.checked ? "block" : "none";
    if (!chkVendorTech.checked) clearSubSectionInputs(vendorTechBox);
  });
  chkVendorLegal.addEventListener("change", () => {
    vendorLegalBox.style.display = chkVendorLegal.checked ? "block" : "none";
    if (!chkVendorLegal.checked) clearSubSectionInputs(vendorLegalBox);
  });

  // ==================== PHOTO & GPS CAPTURE ====================
  // Photo file reading
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
            // Friendly fallback if denied or desktop blocked
            console.warn("Geolocation fallback:", err);
            const now = new Date();
            const ts = now.toISOString().replace("T", " ").split(".")[0];
            const fallbackLat = 28.6139; // Default office baseline
            const fallbackLon = 77.2090;

            latInp.value = fallbackLat;
            lonInp.value = fallbackLon;
            tsInp.value = ts;

            infoBox.innerHTML = `
              <strong>📍 GPS Recorded (Device Base):</strong> ${fallbackLat}, ${fallbackLon}<br>
              <strong>🕒 Timestamp:</strong> ${ts}<br>
              <small style="color:var(--slate-500);">(Browser permission blocked; captured baseline coordinates &amp; timestamp)</small>
            `;
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
      } else {
        infoBox.textContent = "Geolocation not supported by device.";
      }
    });
  });

  // ==================== FORM SUBMIT (MULTI-VISIT GENERATION) ====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Collect selected visit types
    const selectedTypes = [];
    document.querySelectorAll('input[name="visit_types"]:checked').forEach(c => {
      selectedTypes.push(c.value);
    });

    if (selectedTypes.length === 0) {
      alert("Please select at least one Visit Type from the options!");
      return;
    }

    // 2. Build Payload
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

    // Sub-sections extraction
    // Customer
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

    // Partner
    if (selectedTypes.includes("Partner Visit")) {
      const partnerSubtypes = [];
      if (chkPartnerDsa.checked) partnerSubtypes.push("DSA visit");
      if (chkPartnerCon.checked) partnerSubtypes.push("Connector Visit");

      if (partnerSubtypes.length === 0) {
        alert("Please select at least one Partner Visit Type (DSA visit or Connector Visit)!");
        return;
      }

      const dsaPhoto = document.querySelector("#dsa_photo_preview img");
      const conPhoto = document.querySelector("#con_photo_preview img");

      payload.partner_visit = {
        subtypes: partnerSubtypes,
        dsa: chkPartnerDsa.checked ? {
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
        connector: chkPartnerCon.checked ? {
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

    // Vendor
    if (selectedTypes.includes("Vendor Visit")) {
      const vendorSubtypes = [];
      if (chkVendorTech.checked) vendorSubtypes.push("Technical Vendor");
      if (chkVendorLegal.checked) vendorSubtypes.push("Legal Vendor");

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
        technical: chkVendorTech.checked ? {
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
        legal: chkVendorLegal.checked ? {
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

    // Business
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

    // Other
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

    // Send to backend
    try {
      const submitBtn = document.getElementById("btn-form-submit");
      submitBtn.disabled = true;
      submitBtn.innerHTML = "⏳ Logging Visits...";

      const res = await fetch("/api/visits/submit-multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      submitBtn.disabled = false;
      submitBtn.innerHTML = "<span>🚀</span> Submit &amp; Log All Visits";

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      alert(`🎉 SUCCESS! Successfully generated ${data.created_count} visit record(s) in system.`);
      form.reset();
      setupDateRestrictions();
      typeChips.forEach(c => {
        c.classList.remove("selected");
        const chk = c.querySelector('input[type="checkbox"]');
        if (chk) chk.checked = false;
      });
      document.querySelectorAll(".sub-section-card").forEach(c => {
        c.style.display = "none";
        clearSubSectionInputs(c);
      });
    } catch (err) {
      alert(`⚠️ Validation / Submission Error: ${err.message}`);
    }
  });

  // Reset and Cancel buttons
  document.getElementById("btn-form-reset").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all form entries?")) {
      form.reset();
      setupDateRestrictions();
      typeChips.forEach(c => {
        c.classList.remove("selected");
        const chk = c.querySelector('input[type="checkbox"]');
        if (chk) chk.checked = false;
      });
      document.querySelectorAll(".sub-section-card").forEach(c => {
        c.style.display = "none";
        clearSubSectionInputs(c);
      });
    }
  });

  document.getElementById("btn-form-cancel").addEventListener("click", () => {
    if (confirm("Discard changes and return?")) {
      form.reset();
      setupDateRestrictions();
    }
  });

  // ==================== MASTER DASHBOARD OPERATIONS ====================
  async function loadDashboardData() {
    await Promise.all([loadStats(), searchVisits()]);
  }

  async function loadStats() {
    try {
      const res = await fetch("/api/stats");
      const stats = await res.json();
      kpiTotalVisits.textContent = stats.total_visits || 0;
      kpiCustVisits.textContent = stats.by_type?.["Customer Visit"] || 0;
      kpiPartnerVisits.textContent = stats.by_type?.["Partner Visit"] || 0;
      kpiVendorVisits.textContent = stats.by_type?.["Vendor Visit"] || 0;
      kpiBizVisits.textContent = (stats.by_type?.["Business Visit"] || 0) + (stats.by_type?.["Other Visit"] || 0);
    } catch (e) {
      console.error(e);
    }
  }

  async function searchVisits() {
    const params = new URLSearchParams();
    if (fltFromDate.value) params.append("from_date", fltFromDate.value);
    if (fltToDate.value) params.append("to_date", fltToDate.value);
    if (fltRole.value) params.append("user_role", fltRole.value);
    if (fltState.value) params.append("state", fltState.value);
    if (fltCluster.value) params.append("cluster", fltCluster.value);
    if (fltBranch.value) params.append("branch", fltBranch.value);
    if (fltType.value) params.append("visit_type", fltType.value);
    if (fltSearch.value.trim()) params.append("query", fltSearch.value.trim());

    visitsTableBody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 2rem;">Searching visits...</td></tr>`;

    try {
      const res = await fetch(`/api/visits?${params.toString()}`);
      currentVisits = await res.json();
      renderVisitsTable(currentVisits);
      liveVisitsCounter.innerHTML = `<span>📊</span> Displaying <strong>${currentVisits.length}</strong> Visits`;
    } catch (e) {
      visitsTableBody.innerHTML = `<tr><td colspan="11" style="text-align:center; color:red;">Failed to load visits.</td></tr>`;
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

  // Render Visits Table
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
          if (confirm(`Are you sure you want to delete visit ${visit.visit_code}?`)) {
            fetch(`/api/visits/${visit.id}`, { method: "DELETE" })
              .then(res => res.json())
              .then(() => searchVisits());
          }
        }
      });
    });
  }

  // ==================== EYE VIEW MODAL (3D INSPECTION) ====================
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

    // Initialize Leaflet map if coordinates exist and Leaflet is available
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
            console.warn("Leaflet map initialization skipped:", e);
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
    const payload = {
      entity_name: document.getElementById("edit_entity_name").value.trim(),
      mobile: document.getElementById("edit_mobile").value.trim() || null,
      reason: document.getElementById("edit_reason").value.trim() || null,
      address: document.getElementById("edit_address").value.trim() || null,
      status: document.getElementById("edit_status").value,
      notes: document.getElementById("edit_notes").value.trim() || null,
    };

    try {
      const res = await fetch(`/api/visits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      closeModal(editModal);
      searchVisits();
    } catch (err) {
      alert(`Error updating visit: ${err.message}`);
    }
  });

  // Export CSV
  btnExportCsv.addEventListener("click", () => {
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
  });

  // Modal close helpers
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

  // Start initialization
  loadHierarchy();
});

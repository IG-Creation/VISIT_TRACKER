// Visit Tracker Web Application Logic

document.addEventListener("DOMContentLoaded", () => {
  let hostsList = [];
  let visitorsList = [];
  let locationsList = [];
  let searchTimeout = null;

  // DOM Elements
  const kpiActive = document.getElementById("kpi-active");
  const kpiTodayTotal = document.getElementById("kpi-today-total");
  const kpiTodayCheckins = document.getElementById("kpi-today-checkins");
  const kpiTodayScheduled = document.getElementById("kpi-today-scheduled");
  const visitsTableBody = document.getElementById("visits-table-body");
  const searchInput = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");
  const dateFilter = document.getElementById("date-filter");
  const btnRefresh = document.getElementById("btn-refresh");
  const btnExportCsv = document.getElementById("btn-export-csv");

  // Modals & Triggers
  const btnWalkin = document.getElementById("btn-walkin");
  const btnSchedule = document.getElementById("btn-schedule");
  const btnRollcall = document.getElementById("btn-rollcall");
  const btnHostsModal = document.getElementById("btn-hosts-modal");

  const walkinModal = document.getElementById("walkin-modal");
  const scheduleModal = document.getElementById("schedule-modal");
  const passModal = document.getElementById("pass-modal");
  const rollcallModal = document.getElementById("rollcall-modal");
  const hostsModal = document.getElementById("hosts-modal");

  // Forms
  const walkinForm = document.getElementById("walkin-form");
  const scheduleForm = document.getElementById("schedule-form");
  const addHostForm = document.getElementById("add-host-form");

  // Close modal buttons
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close");
      const target = document.getElementById(modalId);
      if (target) target.classList.remove("active");
    });
  });

  function openModal(modal) {
    if (modal) modal.classList.add("active");
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove("active");
  }

  // API Call Helpers
  async function apiFetch(endpoint, options = {}) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        ...options,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "An unexpected error occurred");
      }
      return data;
    } catch (err) {
      alert(`Error: ${err.message}`);
      throw err;
    }
  }

  // Load KPI Stats
  async function loadStats() {
    try {
      const stats = await apiFetch("/api/stats");
      kpiActive.textContent = stats.active_now ?? 0;
      kpiTodayTotal.textContent = stats.today_total ?? 0;
      kpiTodayCheckins.textContent = stats.today_checkins ?? 0;
      kpiTodayScheduled.textContent = stats.today_scheduled ?? 0;
    } catch (e) {
      console.error("Failed to load stats:", e);
    }
  }

  // Load Metadata (Hosts, Visitors, Locations)
  async function loadMetadata() {
    try {
      const [hosts, visitors, locations] = await Promise.all([
        apiFetch("/api/hosts"),
        apiFetch("/api/visitors"),
        apiFetch("/api/locations"),
      ]);
      hostsList = hosts;
      visitorsList = visitors;
      locationsList = locations;
      populateSelects();
    } catch (e) {
      console.error("Failed to load metadata:", e);
    }
  }

  function populateSelects() {
    // Walk-in Hosts
    const walkinHostSel = document.getElementById("walkin-host-select");
    walkinHostSel.innerHTML = '<option value="">Select Host...</option>' +
      hostsList.map(h => `<option value="${h.id}">${h.name} (${h.department || "General"})</option>`).join("");

    // Walk-in Locations
    const walkinLocSel = document.getElementById("walkin-loc-select");
    walkinLocSel.innerHTML = '<option value="">Select Location...</option>' +
      locationsList.map(l => `<option value="${l.id}">${l.name} (${l.building || ""})</option>`).join("");

    // Schedule Visitor
    const scheduleVisitorSel = document.getElementById("schedule-visitor-select");
    scheduleVisitorSel.innerHTML = '<option value="">Select Existing Visitor...</option>' +
      visitorsList.map(v => `<option value="${v.id}">${v.name} - ${v.company || "Individual"}</option>`).join("");

    // Schedule Host
    const scheduleHostSel = document.getElementById("schedule-host-select");
    scheduleHostSel.innerHTML = '<option value="">Select Host...</option>' +
      hostsList.map(h => `<option value="${h.id}">${h.name} (${h.department || "General"})</option>`).join("");

    // Schedule Location
    const scheduleLocSel = document.getElementById("schedule-loc-select");
    scheduleLocSel.innerHTML = '<option value="">Select Location...</option>' +
      locationsList.map(l => `<option value="${l.id}">${l.name}</option>`).join("");
  }

  // Load and Render Visits
  async function loadVisits() {
    const status = statusFilter.value;
    const query = searchInput.value.trim();
    const dateVal = dateFilter.value;

    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (query) params.append("query", query);
    if (dateVal) params.append("date", dateVal);

    try {
      const visits = await apiFetch(`/api/visits?${params.toString()}`);
      renderVisits(visits);
    } catch (e) {
      visitsTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: red;">Failed to load visits.</td></tr>`;
    }
  }

  function renderVisits(visits) {
    if (!visits || visits.length === 0) {
      visitsTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem;">No visits found.</td></tr>`;
      return;
    }

    visitsTableBody.innerHTML = visits.map(v => {
      let timeDisplay = "-";
      if (v.checkin_time) {
        timeDisplay = `In: ${v.checkin_time.slice(11, 16)}`;
        if (v.checkout_time) {
          timeDisplay += `<br>Out: ${v.checkout_time.slice(11, 16)}`;
        }
      } else if (v.expected_checkin) {
        timeDisplay = `Exp: ${v.expected_checkin.slice(11, 16)}`;
      }

      let actionButtons = "";
      if (v.status === "SCHEDULED") {
        actionButtons += `<button class="btn btn-success btn-sm btn-action-checkin" data-id="${v.id}">Check-in</button> `;
        actionButtons += `<button class="btn btn-secondary btn-sm btn-action-cancel" data-id="${v.id}">Cancel</button> `;
      } else if (v.status === "CHECKED_IN") {
        actionButtons += `<button class="btn btn-danger btn-sm btn-action-checkout" data-id="${v.id}">Check-out</button> `;
      }
      actionButtons += `<button class="btn btn-secondary btn-sm btn-action-pass" data-id="${v.id}">Pass</button>`;

      return `
        <tr>
          <td><strong>${v.visit_code}</strong><br><small style="color:var(--slate-400);">${v.badge_number || ""}</small></td>
          <td>
            <strong>${escapeHtml(v.visitor_name || "Unknown")}</strong>
            ${v.visitor_phone ? `<br><small style="color:var(--slate-600);">${escapeHtml(v.visitor_phone)}</small>` : ""}
          </td>
          <td>${escapeHtml(v.visitor_company || "-")}</td>
          <td>
            ${escapeHtml(v.host_name || "Unassigned")}
            ${v.host_department ? `<br><small style="color:var(--slate-400);">${escapeHtml(v.host_department)}</small>` : ""}
          </td>
          <td>${escapeHtml(v.purpose || "-")}</td>
          <td><span class="status-pill status-${v.status}">${v.status.replace("_", " ")}</span></td>
          <td>${timeDisplay}</td>
          <td>${actionButtons}</td>
        </tr>
      `;
    }).join("");

    attachTableActionListeners();
  }

  function attachTableActionListeners() {
    // Check-in
    document.querySelectorAll(".btn-action-checkin").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Confirm visitor check-in?")) {
          await apiFetch(`/api/visits/${id}/checkin`, { method: "POST" });
          refreshAll();
        }
      });
    });

    // Check-out
    document.querySelectorAll(".btn-action-checkout").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Confirm visitor check-out?")) {
          await apiFetch(`/api/visits/${id}/checkout`, { method: "POST" });
          refreshAll();
        }
      });
    });

    // Cancel
    document.querySelectorAll(".btn-action-cancel").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        const reason = prompt("Enter cancellation reason (optional):");
        if (reason !== null) {
          await apiFetch(`/api/visits/${id}/cancel`, {
            method: "POST",
            body: JSON.stringify({ reason })
          });
          refreshAll();
        }
      });
    });

    // View Pass
    document.querySelectorAll(".btn-action-pass").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        const visit = await apiFetch(`/api/visits/${id}`);
        renderVisitorPass(visit);
        openModal(passModal);
      });
    });
  }

  function renderVisitorPass(v) {
    const passBox = document.getElementById("pass-content");
    passBox.innerHTML = `
      <div class="visitor-badge-card">
        <div class="badge-header">OFFICIAL VISITOR PASS</div>
        <div class="badge-name">${escapeHtml(v.visitor_name || "Visitor")}</div>
        <div class="badge-company">${escapeHtml(v.visitor_company || "General Guest")}</div>
        
        <div class="badge-details">
          <div><strong>Pass Code:</strong> ${v.visit_code}</div>
          <div><strong>Badge #:</strong> ${v.badge_number || "N/A"}</div>
          <div><strong>Host:</strong> ${escapeHtml(v.host_name || "Unassigned")} (${escapeHtml(v.host_department || "General")})</div>
          <div><strong>Purpose:</strong> ${escapeHtml(v.purpose)}</div>
          <div><strong>Status:</strong> ${v.status}</div>
          <div><strong>Time:</strong> ${v.checkin_time || v.expected_checkin || "-"}</div>
        </div>

        <div class="badge-qr-box">
          [ ${v.visit_code} ]
        </div>
      </div>
    `;
  }

  // Walk-in form submit
  walkinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(walkinForm);
    const payload = {
      visitor_name: formData.get("visitor_name"),
      visitor_email: formData.get("visitor_email") || null,
      visitor_phone: formData.get("visitor_phone") || null,
      visitor_company: formData.get("visitor_company") || null,
      category: formData.get("category"),
      host_id: formData.get("host_id") ? parseInt(formData.get("host_id")) : null,
      location_id: formData.get("location_id") ? parseInt(formData.get("location_id")) : null,
      purpose: formData.get("purpose"),
      notes: formData.get("notes") || null,
    };

    try {
      const newVisit = await apiFetch("/api/visits/walkin", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      closeModal(walkinModal);
      walkinForm.reset();
      refreshAll();
      renderVisitorPass(newVisit);
      openModal(passModal);
    } catch (err) {
      // already alerted by apiFetch
    }
  });

  // Schedule form submit
  scheduleForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(scheduleForm);
    const payload = {
      visitor_id: parseInt(formData.get("visitor_id")),
      host_id: formData.get("host_id") ? parseInt(formData.get("host_id")) : null,
      location_id: formData.get("location_id") ? parseInt(formData.get("location_id")) : null,
      expected_checkin: formData.get("expected_checkin"),
      purpose: formData.get("purpose"),
      notes: formData.get("notes") || null,
    };

    try {
      await apiFetch("/api/visits", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      closeModal(scheduleModal);
      scheduleForm.reset();
      refreshAll();
    } catch (err) {
      // handled
    }
  });

  // Emergency Roll Call modal
  btnRollcall.addEventListener("click", async () => {
    try {
      const activeVisits = await apiFetch("/api/active");
      const tbody = document.getElementById("rollcall-table-body");
      if (activeVisits.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 1.5rem;">No active visitors currently on premises.</td></tr>`;
      } else {
        tbody.innerHTML = activeVisits.map(v => `
          <tr>
            <td><strong>${escapeHtml(v.visitor_name)}</strong><br><small>${escapeHtml(v.visitor_phone || "")}</small></td>
            <td>${escapeHtml(v.visitor_company || "-")}</td>
            <td>${escapeHtml(v.host_name || "Unassigned")}</td>
            <td>${v.checkin_time || "-"}</td>
            <td><code>${v.badge_number || "-"}</code></td>
          </tr>
        `).join("");
      }
      openModal(rollcallModal);
    } catch (e) {
      console.error(e);
    }
  });

  // Hosts Modal & Form
  btnHostsModal.addEventListener("click", async () => {
    renderHostsTable();
    openModal(hostsModal);
  });

  async function renderHostsTable() {
    const tbody = document.getElementById("hosts-table-body");
    tbody.innerHTML = hostsList.map(h => `
      <tr>
        <td><strong>${escapeHtml(h.name)}</strong></td>
        <td>${escapeHtml(h.department || "-")}</td>
        <td>${escapeHtml(h.email || "-")}</td>
        <td>${escapeHtml(h.phone || "-")}</td>
      </tr>
    `).join("");
  }

  addHostForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(addHostForm);
    const payload = {
      name: formData.get("name"),
      department: formData.get("department") || null,
      email: formData.get("email") || null,
      phone: formData.get("phone") || null,
    };
    try {
      await apiFetch("/api/hosts", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      addHostForm.reset();
      await loadMetadata();
      renderHostsTable();
    } catch (err) {
      // handled
    }
  });

  // CSV Export
  btnExportCsv.addEventListener("click", () => {
    window.location.href = "/api/export";
  });

  // Button triggers for modals
  btnWalkin.addEventListener("click", () => openModal(walkinModal));
  btnSchedule.addEventListener("click", () => openModal(scheduleModal));
  btnRefresh.addEventListener("click", refreshAll);

  // Search input debouncing
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(loadVisits, 300);
  });
  statusFilter.addEventListener("change", loadVisits);
  dateFilter.addEventListener("change", loadVisits);

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function refreshAll() {
    loadStats();
    loadVisits();
  }

  // Initial Load
  loadMetadata().then(() => {
    refreshAll();
  });

  // Periodic polling for active count every 20 seconds
  setInterval(loadStats, 20000);
});

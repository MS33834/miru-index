/* ============================================================
 * 漫藏 · MIRU INDEX — interactivity (ES Module)
 * ============================================================ */
import { CATEGORIES, PROJECTS, SITES, STATS } from "./data.js";

/* ---------- DOM Cache ---------- */
const dom = {
  grid: document.getElementById("grid"),
  empty: document.getElementById("empty"),
  filters: document.getElementById("filters"),
  search: document.getElementById("search"),
  loadMoreWrap: document.getElementById("load-more-wrap"),
  loadMoreBtn: document.getElementById("load-more"),
  statProjects: document.getElementById("stat-projects"),
  statSites: document.getElementById("stat-sites"),
  statCategories: document.getElementById("stat-categories"),
  statUpdated: document.getElementById("stat-updated"),
  panelProjects: document.getElementById("panel-projects"),
  panelSites: document.getElementById("panel-sites"),
};

/* ---------- State ---------- */
const PAGE_SIZE = 24;
const state = {
  tab: "projects",
  cat: "all",
  q: "",
  visibleCount: PAGE_SIZE,
};

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function catList() {
  return CATEGORIES.filter(c => c.section === state.tab);
}
function dataList() {
  return state.tab === "projects" ? PROJECTS : SITES;
}
function categoryName(id) {
  const c = CATEGORIES.find(c => c.id === id);
  return c ? c.name : id;
}
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}
function tagPill(t) { return `<span class="tag">${escapeHTML(t)}</span>`; }

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ---------- Stats ---------- */
function paintStats() {
  if (!STATS) return;
  animateNumber(dom.statProjects, 0, STATS.projects, 1100, "项");
  animateNumber(dom.statSites, 0, STATS.sites, 1300, "个");
  animateNumber(dom.statCategories, 0, STATS.categories, 900, "类");
  dom.statUpdated.textContent = STATS.updated;
}
function animateNumber(el, from, to, ms, suffix = "") {
  if (!el) return;
  const start = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - start) / ms);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.round(from + (to - from) * eased);
    el.textContent = val + (suffix ? " " + suffix : "");
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- Render chips ---------- */
function renderChips() {
  const cats = catList();
  dom.filters.innerHTML = `
    <button class="chip ${state.cat === "all" ? "is-active" : ""}" data-cat="all" aria-pressed="${state.cat === "all"}">
      <span class="chip-mark" aria-hidden="true">All</span>全部
    </button>
    ${cats.map(c => `
      <button class="chip ${state.cat === c.id ? "is-active" : ""}" data-cat="${c.id}" aria-pressed="${state.cat === c.id}">
        <span class="chip-mark" aria-hidden="true">${escapeHTML(c.emoji)}</span>${escapeHTML(c.name)}
      </button>
    `).join("")}
  `;
  dom.filters.dataset.section = state.tab;
}

/* ---------- Render grid (with pagination) ---------- */
let cardObserver = null;

function renderGrid() {
  const q = state.q.trim().toLowerCase();
  const items = dataList().filter(it => {
    if (state.cat !== "all" && it.cat !== state.cat) return false;
    if (!q) return true;
    const hay = [it.name, it.desc, categoryName(it.cat), ...(it.tags || [])]
      .join(" ").toLowerCase();
    return hay.includes(q);
  });

  if (items.length === 0) {
    dom.grid.innerHTML = "";
    dom.empty.hidden = false;
    dom.loadMoreWrap.hidden = true;
    return;
  }
  dom.empty.hidden = true;

  const visible = items.slice(0, state.visibleCount);
  const hasMore = items.length > state.visibleCount;

  dom.grid.innerHTML = visible.map(it => {
    const isSite = state.tab === "sites";
    const badge = isSite
      ? (it.proxy ? `<span class="card-badge proxy">◎ PROXY</span>` : `<span class="card-badge">OPEN</span>`)
      : (it.badge ? `<span class="card-badge">${escapeHTML(it.badge)}</span>` : "");
    const tags = (it.tags || []).slice(0, 4).map(tagPill).join("");
    return `
      <a class="card" href="${escapeHTML(it.url)}" target="_blank" rel="noopener" aria-label="${escapeHTML(it.name)}">
        <div class="card-head">
          <span class="card-cat">${escapeHTML(categoryName(it.cat))}</span>
          ${badge}
        </div>
        <div class="card-title">${escapeHTML(it.name)}<span class="card-arrow" aria-hidden="true">→</span></div>
        <p class="card-desc">${escapeHTML(it.desc)}</p>
        <div class="card-tags">${tags}</div>
      </a>
    `;
  }).join("");

  dom.loadMoreWrap.hidden = !hasMore;

  /* IntersectionObserver for card entrance animation */
  if (cardObserver) cardObserver.disconnect();
  cardObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("is-visible");
        cardObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.05 });

  $$(".card", dom.grid).forEach(card => cardObserver.observe(card));
}

/* ---------- Event Delegation ---------- */

// Tab switching — delegate on .tabs
function bindTabs() {
  $(".tabs").addEventListener("click", e => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    const t = btn.dataset.tab;
    if (t === state.tab) return;
    state.tab = t;
    state.cat = "all";
    state.visibleCount = PAGE_SIZE;
    $$(".tab").forEach(b => {
      const isActive = b === btn;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-selected", isActive);
    });
    // Toggle panels
    dom.panelProjects.hidden = t !== "projects";
    dom.panelSites.hidden = t !== "sites";
    renderChips();
    renderGrid();
  });
}

// Filter chips — delegate on #filters
function bindFilters() {
  dom.filters.addEventListener("click", e => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    state.cat = btn.dataset.cat;
    state.visibleCount = PAGE_SIZE;
    $$(".chip", dom.filters).forEach(c => {
      const isActive = c === btn;
      c.classList.toggle("is-active", isActive);
      c.setAttribute("aria-pressed", isActive);
    });
    renderGrid();
  });
}

// Search with debounce
function bindSearch() {
  const debouncedRender = debounce(() => {
    state.visibleCount = PAGE_SIZE;
    renderGrid();
  }, 300);

  dom.search.addEventListener("input", () => {
    state.q = dom.search.value;
    debouncedRender();
  });

  // "/" hotkey to focus, Escape to blur
  document.addEventListener("keydown", e => {
    if (e.key === "/" && document.activeElement !== dom.search) {
      e.preventDefault();
      dom.search.focus();
      dom.search.select();
    } else if (e.key === "Escape" && document.activeElement === dom.search) {
      dom.search.blur();
    }
  });
}

// Load more button
function bindLoadMore() {
  dom.loadMoreBtn.addEventListener("click", () => {
    state.visibleCount += PAGE_SIZE;
    renderGrid();
  });
}

/* ---------- Reveal on scroll ---------- */
function bindReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("is-in");
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });
  $$(".reveal").forEach(el => obs.observe(el));
}

/* ---------- Init ---------- */
function init() {
  paintStats();
  renderChips();
  renderGrid();
  bindTabs();
  bindFilters();
  bindSearch();
  bindLoadMore();
  bindReveal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

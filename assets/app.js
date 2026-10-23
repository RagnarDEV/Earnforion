const DATA_URL = "./data/opportunities.json";
const grid = document.querySelector("#opportunity-grid");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const sortFilter = document.querySelector("#sort-filter");
const statusMessage = document.querySelector("#status-message");
const emptyState = document.querySelector("#empty-state");
const resultsLabel = document.querySelector("#results-label");
let opportunities = [];

const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[char]));
const compactNumber = value => { const number = Number(value || 0); return number >= 1000 ? (number / 1000).toFixed(1) + "k" : String(number); };
const relativeDate = value => { if (!value) return "Not dated"; const date = new Date(value); if (Number.isNaN(date.getTime())) return "Not dated"; const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000)); return days === 0 ? "Checked today" : days === 1 ? "Checked yesterday" : `Checked ${days}d ago`; };
const icons = {
  "Research & surveys": '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4.5 4.5"/></svg>',
  "Testing & feedback": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
  "Game testing": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9h10a4 4 0 0 1 3.8 5.2l-1 3.1a2 2 0 0 1-3.5.6L14 15h-4l-2.3 2.9a2 2 0 0 1-3.5-.6l-1-3.1A4 4 0 0 1 7 9Z"/><path d="M8 11v4M6 13h4M16 13h.1M18 11h.1"/></svg>',
  "Microtasks": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h9"/></svg>',
  "AI & data projects": '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
  "Freelance services": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v12H4zM8 7V5h8v2M8 12h8M12 10v4"/></svg>',
  "Digital products": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/></svg>',
  "Local & field tasks": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  "Offers & rewards": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12v8H4v-8M2 8h20v4H2zM12 8v12M12 8H8.5A2.5 2.5 0 1 1 11 5.5V8ZM12 8h3.5A2.5 2.5 0 1 0 13 5.5V8Z"/></svg>'
};
const iconFor = category => icons[category] || '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>';

function renderCard(item) {
  const reward = item.reward || "Varies by task";
  const effort = item.effort || "Varies";
  const requirements = item.requirements || "Check platform requirements";
  return `<article class="op-card reveal is-visible">
    <div class="card-top"><span class="category-tag">${iconFor(item.category)}${escapeHTML(item.category || "Online work")}</span><span class="availability">${escapeHTML(item.availability || "Check availability")}</span></div>
    <h3>${escapeHTML(item.title || item.platform)}</h3>
    <div class="platform-name">${escapeHTML(item.platform || "External platform")}</div>
    <p class="op-description">${escapeHTML(item.description || "Review the official listing for current tasks and terms.")}</p>
    <div class="earning-details"><div><span>Typical reward</span><strong>${escapeHTML(reward)}</strong></div><div><span>Effort</span><strong>${escapeHTML(effort)}</strong></div></div>
    <div class="business-angle"><strong>Before you start</strong>${escapeHTML(requirements)}</div>
    <div class="card-meta"><span>Match score ${Math.round(Number(item.score || 0))}/100</span><span>${escapeHTML(relativeDate(item.lastVerifiedAt || item.publishedAt))}</span></div>
    <div class="card-links"><a href="${escapeHTML(item.url || "#")}" target="_blank" rel="noopener noreferrer">Open official platform <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M19 5l-8 8"/></svg></a></div>
  </article>`;
}
function filteredItems() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const list = opportunities.filter(item => {
    const text = [item.title, item.platform, item.description, item.category, item.reward, item.effort, item.requirements, ...(item.tags || [])].join(" ").toLowerCase();
    return (!term || text.includes(term)) && (category === "all" || item.category === category);
  });
  switch (sortFilter.value) {
    case "reward": list.sort((a,b) => (b.rewardScore || 0) - (a.rewardScore || 0)); break;
    case "easy": list.sort((a,b) => (b.easeScore || 0) - (a.easeScore || 0)); break;
    case "newest": list.sort((a,b) => new Date(b.lastVerifiedAt || b.publishedAt || 0) - new Date(a.lastVerifiedAt || a.publishedAt || 0)); break;
    default: list.sort((a,b) => (b.score || 0) - (a.score || 0));
  }
  return list;
}
function render() {
  const list = filteredItems();
  grid.innerHTML = list.map(renderCard).join("");
  emptyState.hidden = list.length !== 0;
  resultsLabel.textContent = `Showing ${list.length} of ${opportunities.length} opportunities`;
}
function initCategories() {
  const categories = [...new Set(opportunities.map(x => x.category).filter(Boolean))].sort();
  categoryFilter.innerHTML = '<option value="all">All work types</option>' + categories.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
}
function setupReveal() {
  const items = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!("IntersectionObserver" in window)) { items.forEach(item => item.classList.add("is-visible")); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .12 });
  items.forEach(item => observer.observe(item));
}
async function loadData() {
  try {
    const response = await fetch(`${DATA_URL}?v=stable`, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Could not load dataset (${response.status})`);
    const data = await response.json();
    opportunities = Array.isArray(data.opportunities) ? data.opportunities : [];
    document.querySelector("#total-count").textContent = compactNumber(opportunities.length);
    document.querySelector("#category-count").textContent = new Set(opportunities.map(x => x.category).filter(Boolean)).size;
    document.querySelector("#updated-at").textContent = data.updatedAt ? new Date(data.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "Awaiting first sync";
    statusMessage.innerHTML = `<span class="loading-dot"></span> ${opportunities.length ? `Curated feed ready · ${data.source || "Online opportunity sources"}` : "No opportunities are listed yet."}`;
    initCategories(); render(); setupReveal();
  } catch (error) {
    statusMessage.textContent = "Could not load opportunity data. Please try again later.";
    document.querySelector("#total-count").textContent = "—"; document.querySelector("#category-count").textContent = "—"; emptyState.hidden = false; console.error(error);
  }
}
[searchInput, categoryFilter, sortFilter].forEach(el => el.addEventListener("input", render));
document.querySelector("#reset-filters").addEventListener("click", () => { searchInput.value = ""; categoryFilter.value = "all"; sortFilter.value = "recommended"; render(); });
window.addEventListener("pointermove", event => { document.documentElement.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth) * 100}%`); document.documentElement.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight) * 100}%`); }, { passive: true });
setupReveal(); loadData();

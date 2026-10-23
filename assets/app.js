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
const relativeDate = value => { if (!value) return "Date unknown"; const date = new Date(value); if (Number.isNaN(date.getTime())) return "Date unknown"; const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000)); return days === 0 ? "Checked today" : days === 1 ? "Checked yesterday" : `Checked ${days}d ago`; };

function renderCard(item) {
  const reward = item.reward || "Varies by task";
  const effort = item.effort || "Varies";
  const requirements = item.requirements || "Check platform requirements";
  return `<article class="op-card">
    <div class="card-top"><span class="category-tag">${escapeHTML(item.category || "Online work")}</span><span class="availability">${escapeHTML(item.availability || "Check availability")}</span></div>
    <h3>${escapeHTML(item.title || item.platform)}</h3>
    <div class="platform-name">${escapeHTML(item.platform || "External platform")}</div>
    <p class="op-description">${escapeHTML(item.description || "Review the official listing for current tasks and terms.")}</p>
    <div class="earning-details"><div><span>Typical reward</span><strong>${escapeHTML(reward)}</strong></div><div><span>Effort</span><strong>${escapeHTML(effort)}</strong></div></div>
    <div class="business-angle"><strong>Before you start</strong>${escapeHTML(requirements)}</div>
    <div class="card-meta"><span>Match score ${Math.round(Number(item.score || 0))}/100</span><span>${escapeHTML(relativeDate(item.checkedAt))}</span></div>
    <div class="card-links"><a href="${escapeHTML(item.url || "#")}" target="_blank" rel="noopener noreferrer">Open official platform ↗</a></div>
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
    case "newest": list.sort((a,b) => new Date(b.checkedAt || 0) - new Date(a.checkedAt || 0)); break;
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
async function loadData() {
  try {
    const response = await fetch(`${DATA_URL}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load dataset (${response.status})`);
    const data = await response.json();
    opportunities = Array.isArray(data.opportunities) ? data.opportunities : [];
    document.querySelector("#total-count").textContent = compactNumber(opportunities.length);
    document.querySelector("#category-count").textContent = new Set(opportunities.map(x => x.category).filter(Boolean)).size;
    document.querySelector("#updated-at").textContent = data.updatedAt ? new Date(data.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "Awaiting first sync";
    statusMessage.textContent = opportunities.length ? `Catalog checked automatically · ${data.source || "Curated online opportunity sources"}` : "No opportunities are listed yet.";
    initCategories();
    render();
  } catch (error) {
    statusMessage.textContent = "Could not load opportunity data. Please try again later.";
    document.querySelector("#total-count").textContent = "—";
    document.querySelector("#category-count").textContent = "—";
    emptyState.hidden = false;
    console.error(error);
  }
}
[searchInput, categoryFilter, sortFilter].forEach(el => el.addEventListener("input", render));
document.querySelector("#reset-filters").addEventListener("click", () => { searchInput.value = ""; categoryFilter.value = "all"; sortFilter.value = "recommended"; render(); });
loadData();

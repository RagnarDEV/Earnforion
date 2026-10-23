const DATA_URL = "./data/opportunities.json";
const grid = document.querySelector("#opportunity-grid");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const sortFilter = document.querySelector("#sort-filter");
const statusMessage = document.querySelector("#status-message");
const emptyState = document.querySelector("#empty-state");
const resultsLabel = document.querySelector("#results-label");
let opportunities = [];

const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));
const compactNumber = value => {
  const number = Number(value || 0);
  return number >= 1e6 ? (number / 1e6).toFixed(1) + "m" : number >= 1e3 ? (number / 1e3).toFixed(1) + "k" : String(number);
};
const relativeDate = value => {
  if (!value) return "Date unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unknown";
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
  return days === 0 ? "Updated today" : days === 1 ? "Updated yesterday" : `Updated ${days}d ago`;
};
function renderCard(item) {
  const repo = `${item.owner || ""}/${item.name || ""}`;
  const description = item.description || "No description provided. Review the source repository to understand the project.";
  const angle = item.businessAngle || "Explore whether this project can support a niche service, customization, or a paid add-on.";
  const license = item.license || "Check license";
  return `<article class="op-card">
    <div class="card-top"><span class="category-tag">${escapeHTML(item.category || "Open source")}</span><span class="stars">★ ${compactNumber(item.stars)}</span></div>
    <h3>${escapeHTML(item.name || repo)}</h3>
    <div class="repo-name">${escapeHTML(repo)}</div>
    <p class="op-description">${escapeHTML(description)}</p>
    <div class="business-angle"><strong>Possible business angle</strong>${escapeHTML(angle)}</div>
    <div class="card-meta"><span>⑂ ${compactNumber(item.forks)} forks</span><span>${escapeHTML(relativeDate(item.updatedAt))}</span></div>
    <div class="card-meta"><span>${escapeHTML(license)}</span><span>Score ${Math.round(Number(item.score || 0))}/100</span></div>
    <div class="card-links"><a href="${escapeHTML(item.url || "#")}" target="_blank" rel="noopener noreferrer">View repository ↗</a><a href="${escapeHTML(item.url || "#")}#readme" target="_blank" rel="noopener noreferrer">Read README ↗</a></div>
  </article>`;
}
function filteredItems() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  let list = opportunities.filter(item => {
    const text = [item.name, item.owner, item.description, item.category, item.businessAngle, ...(item.topics || [])].join(" ").toLowerCase();
    return (!term || text.includes(term)) && (category === "all" || item.category === category);
  });
  switch (sortFilter.value) {
    case "stars": list.sort((a,b) => (b.stars || 0) - (a.stars || 0)); break;
    case "updated": list.sort((a,b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)); break;
    case "newest": list.sort((a,b) => new Date(b.discoveredAt || 0) - new Date(a.discoveredAt || 0)); break;
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
  categoryFilter.innerHTML = '<option value="all">All categories</option>' + categories.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
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
    statusMessage.textContent = opportunities.length ? `Updated automatically · ${data.source || "GitHub public repository data"}` : "The first automatic data collection has not run yet. Enable GitHub Actions and run the Update opportunities workflow.";
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
document.querySelector("#reset-filters").addEventListener("click", () => {
  searchInput.value = ""; categoryFilter.value = "all"; sortFilter.value = "recommended"; render();
});
loadData();

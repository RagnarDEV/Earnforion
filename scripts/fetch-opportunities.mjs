import fs from "node:fs/promises";

const TOKEN = process.env.GITHUB_TOKEN;
const OUTPUT = "data/opportunities.json";
const PER_QUERY = 30;
const QUERIES = [
  { category: "AI & Machine Learning", q: "AI OR LLM OR machine-learning stars:>100 archived:false fork:false" },
  { category: "Automation & Bots", q: "automation OR workflow OR bot stars:>80 archived:false fork:false" },
  { category: "SaaS & Web Apps", q: "SaaS OR self-hosted OR webapp stars:>100 archived:false fork:false" },
  { category: "Developer Tools", q: "developer-tools OR CLI OR API stars:>100 archived:false fork:false" },
  { category: "E-commerce", q: "ecommerce OR ecommerce-platform OR shop stars:>50 archived:false fork:false" },
  { category: "Digital Products", q: "template OR starter-kit OR boilerplate stars:>100 archived:false fork:false" },
  { category: "Data & Analytics", q: "analytics OR dashboard OR data-pipeline stars:>80 archived:false fork:false" },
  { category: "Paid Bounties", q: "bounty OR good-first-issue stars:>50 archived:false fork:false" }
];

const BUSINESS_ANGLES = {
  "AI & Machine Learning": "Adapt the project for a specific niche, offer setup/customization, or build a hosted tool. Validate hosting costs and model licenses first.",
  "Automation & Bots": "Offer workflow automation or managed integrations to a defined customer group. Confirm platform terms and ongoing maintenance costs.",
  "SaaS & Web Apps": "Investigate a focused hosted service, paid support, or customization. Review the license and security model before commercial use.",
  "Developer Tools": "Offer implementation, integrations, support, or a specialized developer workflow built around the project.",
  "E-commerce": "Build niche store integrations or offer store setup and automation services. Check all dependencies and commerce-platform terms.",
  "Digital Products": "Use as a starting point for a differentiated template or implementation service, subject to the repository license.",
  "Data & Analytics": "Offer dashboards, setup, data integration, or reporting for a specific industry.",
  "Paid Bounties": "Check the repository issues and linked bounty platform for explicit active payouts. Stars alone do not indicate a paid bounty."
};

function scoreRepo(repo) {
  const stars = repo.stargazers_count || 0;
  const forks = repo.forks_count || 0;
  const updatedDays = Math.max(0, (Date.now() - new Date(repo.pushed_at || repo.updated_at).getTime()) / 86400000);
  const activity = Math.max(0, 30 - Math.min(30, updatedDays)) / 30;
  const docs = repo.description ? 8 : 0;
  const license = repo.license ? 8 : 0;
  const starsScore = Math.min(35, Math.log10(stars + 1) * 10);
  const forksScore = Math.min(15, Math.log10(forks + 1) * 5);
  return Math.round(Math.min(100, starsScore + forksScore + activity * 30 + docs + license));
}
function pickCategory(repo, fallback) {
  const text = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
  if (/bounty|good-first-issue/.test(text)) return "Paid Bounties";
  if (/ecommerce|e-commerce|shopify|woocommerce|storefront/.test(text)) return "E-commerce";
  if (/analytics|dashboard|data-pipeline|data pipeline/.test(text)) return "Data & Analytics";
  if (/template|starter-kit|boilerplate|theme/.test(text)) return "Digital Products";
  if (/automation|workflow|bot\b|n8n/.test(text)) return "Automation & Bots";
  if (/\bsaas\b|self-hosted|webapp|web app/.test(text)) return "SaaS & Web Apps";
  if (/\bai\b|\bllm\b|machine-learning|machine learning|inference/.test(text)) return "AI & Machine Learning";
  if (/cli|developer-tool|sdk|api client/.test(text)) return "Developer Tools";
  return fallback;
}
async function fetchQuery(query) {
  const params = new URLSearchParams({
    q: query.q,
    sort: "updated",
    order: "desc",
    per_page: String(PER_QUERY)
  });
  const response = await fetch(`https://api.github.com/search/repositories?${params}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {})
    }
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body.slice(0, 250)}`);
  }
  const data = await response.json();
  return data.items || [];
}

const byId = new Map();
for (const entry of QUERIES) {
  console.log(`Searching: ${entry.category}`);
  const repos = await fetchQuery(entry);
  for (const repo of repos) {
    if (repo.archived || repo.disabled || !repo.html_url) continue;
    const category = pickCategory(repo, entry.category);
    const item = {
      id: repo.id,
      owner: repo.owner?.login || "",
      name: repo.name,
      url: repo.html_url,
      description: repo.description || "",
      category,
      topics: repo.topics || [],
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      license: repo.license?.spdx_id || repo.license?.name || "No license detected",
      createdAt: repo.created_at,
      updatedAt: repo.pushed_at || repo.updated_at,
      discoveredAt: new Date().toISOString(),
      score: scoreRepo(repo),
      businessAngle: BUSINESS_ANGLES[category] || BUSINESS_ANGLES["SaaS & Web Apps"]
    };
    const existing = byId.get(repo.id);
    if (!existing || item.score > existing.score) byId.set(repo.id, item);
  }
  // Avoid bursty calls and secondary limits.
  await new Promise(resolve => setTimeout(resolve, 1800));
}
const opportunities = [...byId.values()]
  .sort((a, b) => b.score - a.score || b.stars - a.stars)
  .slice(0, 180);

await fs.mkdir("data", { recursive: true });
const output = {
  updatedAt: new Date().toISOString(),
  source: "GitHub Search API",
  total: opportunities.length,
  methodology: "Heuristic discovery score based on stars, forks, recent activity, description and license presence. Score is not an earnings estimate.",
  opportunities
};
await fs.writeFile(OUTPUT, JSON.stringify(output, null, 2) + "\n");
console.log(`Saved ${opportunities.length} unique repositories to ${OUTPUT}`);

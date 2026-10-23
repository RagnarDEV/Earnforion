# EarnForion

EarnForion is an independent directory of practical online earning opportunities. It focuses on small paid tasks, user testing, research studies, microtasks, freelance services, and digital-product opportunities—not on finding ways to monetize GitHub repositories.

## Features

- Static, responsive website for mobile and desktop
- Curated links to official opportunity platforms
- Typical reward, effort, availability, requirements, and work type on every card
- Search, category filters, and sorting by reward or ease of starting
- Automatic catalog refresh through GitHub Actions
- No external database, server, or client-side API token

## Opportunity lifecycle

Every listing has a small lifecycle record in `data/opportunities.json`:

- `published`: visible in the website feed.
- `reviewAfter`: maintenance reminder after 30 days; the listing remains visible.
- `expiresAt`: automatic expiry after 90 days without verification.
- `archived`: expired or retired listings are moved to `data/opportunities-archive.json` and are not downloaded by visitors.

The browser loads only the active `data/opportunities.json` file. The archive is never requested by `assets/app.js`, so old records cannot slow the website. The scheduled workflow runs once per day and skips the commit and Pages deployment when the active catalog has not changed. This avoids repeated rebuilds caused only by a changing timestamp.

## Setup

1. Upload the project to a public repository.
2. Enable GitHub Pages with **GitHub Actions** as the source.
3. Run **Actions → Refresh online earning opportunities → Run workflow** for the first refresh.
4. The expected URL is `https://ragnardev.github.io/EarnForion/`.

## Catalog methodology and limitations

The catalog is a transparent set of opportunity leads linking to official platforms. It does not scrape GitHub repositories and does not use stars, forks, or repository licenses as an earnings signal. Rewards, task supply, eligibility, fees, and payment methods can change. Users must verify the current terms on the official platform and should never pay a fee to unlock work.

The refresh script (`scripts/fetch-opportunities.mjs`) updates the checked timestamp and rewrites the catalog. To add an opportunity, add a clearly sourced item with an official URL and realistic, non-guaranteed reward language.

## Project layout

```text
.
├── index.html
├── assets/
│   ├── app.js
│   └── style.css
├── data/
│   ├── opportunities.json
│   └── opportunities-archive.json
├── scripts/
│   └── fetch-opportunities.mjs
└── .github/workflows/
    ├── deploy-pages.yml
    └── update-opportunities.yml
```

## License

The website code is provided under the MIT License in `LICENSE`.

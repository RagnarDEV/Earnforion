# EarnForion

EarnForion is an independent directory of practical online earning opportunities. It focuses on small paid tasks, user testing, research studies, microtasks, freelance services, and digital-product opportunities—not on finding ways to monetize GitHub repositories.

## Features

- Static, responsive website for mobile and desktop
- Curated links to official opportunity platforms
- Typical reward, effort, availability, requirements, and work type on every card
- Search, category filters, and sorting by reward or ease of starting
- Automatic catalog refresh through GitHub Actions
- No external database, server, or client-side API token

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
│   └── opportunities.json
├── scripts/
│   └── fetch-opportunities.mjs
└── .github/workflows/
    ├── deploy-pages.yml
    └── update-opportunities.yml
```

## License

The website code is provided under the MIT License in `LICENSE`.

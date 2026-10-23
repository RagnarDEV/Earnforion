# EarnForion

EarnForion is a GitHub-only opportunity discovery website. It finds public GitHub repositories, ranks them using transparent repository signals, and presents possible business angles. It does **not** claim that a repository is earning money.

## Features

- Static, responsive website for mobile and desktop
- GitHub repository discovery through the official Search API
- Scheduled data refresh every six hours
- Duplicate removal and heuristic ranking
- Search, category filters, sorting, original source links, license and activity details
- No external database, server, or client-side API token

## Repository setup

1. Create a **public** repository named `EarnForion` under `RagnarDEV`.
2. Upload all files and folders from this project to the repository root, preserving the `.github/workflows/` directory.
3. Open **Settings → Actions → General**. Under Workflow permissions, allow read and write permissions if the repository setting blocks workflow pushes.
4. Open **Settings → Pages** and set the source to **GitHub Actions**.
5. Open **Actions → Update EarnForion opportunities → Run workflow** to perform the first data collection.
6. Wait for the data workflow to finish. The data commit triggers the Pages deployment workflow. The initial push also triggers a deployment.
7. The expected URL is `https://ragnardev.github.io/EarnForion/`.

## Automatic updates

The workflow runs every six hours at minute 17 (UTC) and can also be started manually from the Actions tab. GitHub may delay scheduled workflows during busy periods. The built-in `GITHUB_TOKEN` is used only inside Actions and is never sent to site visitors.

If the data workflow cannot push commits, check **Settings → Actions → General → Workflow permissions** and enable read/write access for `GITHUB_TOKEN`.

## Discovery methodology and limitations

- Searches public repositories in several broad categories.
- Removes duplicates and archived/disabled projects.
- Scores projects using stars, forks, activity, descriptions, and license metadata.
- Displays a general business angle based on category.
- A score is **not** a probability of success or an estimate of revenue.
- The Paid Bounties category is a discovery lead, not proof of an active bounty. Verify the actual issue or bounty page.
- Search results are not exhaustive. API limits, query syntax, and GitHub indexing affect coverage.
- Review each repository's license and dependency licenses before commercial use.

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
└── .github/
    └── workflows/
        ├── deploy-pages.yml
        └── update-opportunities.yml
```

## License

The website code is provided under the MIT License in `LICENSE`. Repository data is sourced from public GitHub metadata; original projects retain their own licenses and ownership.

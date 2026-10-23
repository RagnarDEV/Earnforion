import fs from "node:fs/promises";

const OUTPUT = "data/opportunities.json";
const ARCHIVE_OUTPUT = "data/opportunities-archive.json";
const checkedAt = new Date().toISOString();
const REVIEW_AFTER_DAYS = 30;
const EXPIRE_AFTER_DAYS = 90;
const addDays = (iso, days) => new Date(new Date(iso).getTime() + days * 86400000).toISOString();

// Curated opportunity leads. These are official platform links, not GitHub repositories.
// Reward and availability are deliberately described as indicative because they vary by
// country, profile, screening, task supply, client, and platform rules.
const seed = [
  ["prolific-research", "Paid research studies", "Prolific", "Research & surveys", "Take academic and product research studies matched to your profile.", "Usually a few dollars per study", "10–60 min", "Profile dependent", "Account approval and an honest demographic profile.", "https://www.prolific.com/participants", ["studies", "surveys", "research"], 91, 78, 78],
  ["respondent-studies", "Join paid interviews and studies", "Respondent", "Research & surveys", "Apply for research interviews and product studies looking for specific roles or experiences.", "Often higher than short surveys", "15–90 min", "Screener and demographic dependent", "Accurate profile and eligibility for each study.", "https://www.respondent.io/respondents", ["interviews", "research", "studies"], 87, 89, 58],
  ["dscout-participant", "Participate in mobile research missions", "dscout", "Research & surveys", "Share diary entries, videos, photos, and feedback in selected research missions.", "Mission dependent", "Days to weeks in short sessions", "Invitation and country dependent", "Mobile device, detailed applications, and mission completion.", "https://dscout.com/participate", ["mobile", "diary", "research"], 82, 80, 57],
  ["yougov-surveys", "Answer opinion surveys", "YouGov", "Research & surveys", "Share opinions in recurring surveys and build points toward available rewards.", "Points and rewards vary by country", "5–20 min", "Country and invitation dependent", "Verified account and a consistent profile.", "https://account.yougov.com/", ["surveys", "opinions", "rewards"], 75, 55, 84],
  ["attapoll-surveys", "Complete short mobile surveys", "AttaPoll", "Research & surveys", "Choose short surveys in a mobile app and receive the reward shown before starting.", "Small rewards per completed survey", "2–15 min", "Country and profile dependent", "Mobile app, screening answers, and supported payout method.", "https://attapoll.app/", ["mobile", "surveys", "quick tasks"], 73, 53, 87],
  ["usertesting-tests", "Test websites and apps", "UserTesting", "Testing & feedback", "Record your screen and voice while completing tasks on websites and apps.", "Often $4–$10 for short tests", "10–30 min", "Country and screener dependent", "Microphone, compatible device, and passing sample test.", "https://www.usertesting.com/get-paid-to-test", ["usability", "apps", "websites"], 94, 82, 74],
  ["trymata-tests", "Give feedback on digital products", "Trymata", "Testing & feedback", "Complete usability tests and share written or recorded feedback on websites and apps.", "Test-based; amount shown by platform", "15–30 min", "Test invitation dependent", "Device, clear feedback, and accepted test submission.", "https://trymata.com/", ["usability", "feedback", "apps"], 84, 76, 72],
  ["usercrowd-design", "Review designs and prototypes", "UserCrowd", "Testing & feedback", "Answer short questions about designs, interfaces, and user experience decisions.", "Small payments per accepted test", "1–10 min", "Profile and test supply dependent", "Fast, thoughtful answers and supported payout method.", "https://usercrowd.com/", ["design", "ux", "quick tasks"], 80, 54, 91],
  ["testio-bug-testing", "Find bugs in websites and apps", "Test IO", "Testing & feedback", "Join software testing projects and report reproducible bugs for review.", "Bug and project dependent", "30 min to several hours", "Project and device dependent", "Tester account, supported devices, and ability to write clear bug reports.", "https://test.io/", ["bugs", "qa", "apps"], 83, 81, 60],
  ["utest-testing", "Test software releases", "uTest", "Testing & feedback", "Participate in software testing cycles and report defects or test results.", "Cycle and approved bug dependent", "30 min to several days", "Project and country dependent", "Profile, testing skills, and compatible devices.", "https://www.utest.com/get-paid-to-test", ["qa", "bugs", "software"], 82, 80, 57],
  ["playtestcloud-games", "Playtest mobile games", "PlaytestCloud", "Game testing", "Play unreleased games and record feedback about the experience.", "Usually a small reward per accepted playtest", "10–30 min", "Country, device, and invitation dependent", "Compatible mobile device, microphone, and spoken feedback.", "https://www.playtestcloud.com/players", ["games", "mobile", "testing"], 86, 72, 76],
  ["testbirds-crowdtesting", "Crowdtest digital products", "Testbirds", "Testing & feedback", "Test websites, apps, and connected products in crowdtesting projects.", "Project and defect dependent", "20 min to several hours", "Country, device, and project dependent", "Registered tester profile and clear evidence for issues.", "https://nest.testbirds.com/", ["crowdtesting", "qa", "apps"], 79, 75, 63],
  ["clickworker-tasks", "Microtasks and data work", "Clickworker", "Microtasks", "Complete categorization, text, research, photo, and data-verification tasks.", "Small task-based payments", "5–45 min", "Country and project dependent", "Verified account; some projects require assessments.", "https://www.clickworker.com/clickworker-job/", ["data", "categorization", "research"], 88, 65, 83],
  ["toloka-tasks", "Online data-labeling tasks", "Toloka", "Microtasks", "Help evaluate search, content, images, and AI data through short tasks.", "Varies by task and region", "5–30 min", "Country and task supply dependent", "Identity and payment verification may be required.", "https://toloka.ai/tolokers", ["ai", "labeling", "search"], 86, 62, 80],
  ["mturk-human-intelligence", "Human Intelligence Tasks (HITs)", "Amazon Mechanical Turk", "Microtasks", "Complete short data, research, transcription, and moderation tasks posted by requesters.", "Often cents to a few dollars per HIT", "Minutes to hours", "Country and requester approval dependent", "Worker account, tax information, and requester qualifications.", "https://www.mturk.com/worker", ["hits", "data", "transcription"], 79, 58, 68],
  ["neevo-ai-tasks", "Language and AI data tasks", "Neevo", "AI & data projects", "Apply for language, audio, image, and text data projects used to improve AI systems.", "Project and task dependent", "Minutes to several hours", "Language, location, and project dependent", "Verified profile and completion of any project qualification.", "https://neevo.defined.ai/", ["ai", "audio", "language", "data"], 84, 77, 65],
  ["oneforma-projects", "Remote language and data projects", "OneForma", "AI & data projects", "Find transcription, translation, data collection, and AI evaluation projects.", "Project-based; varies by assignment", "Hours to weeks", "Language and location dependent", "Profile, screening, and sometimes identity verification.", "https://www.oneforma.com/", ["ai", "translation", "transcription"], 83, 86, 53],
  ["crowdgen-ai", "AI training and evaluation projects", "CrowdGen by Appen", "AI & data projects", "Apply for remote data-collection, transcription, evaluation, and AI-training projects.", "Project-based; varies widely", "Hours to weeks", "Project and language dependent", "Application, screening, and sometimes specialist skills.", "https://crowdgen.com/", ["ai", "transcription", "language", "data"], 84, 88, 55],
  ["outlier-ai-work", "Evaluate and improve AI responses", "Outlier", "AI & data projects", "Apply for projects that involve writing, evaluating, or improving AI-generated responses.", "Project and expertise dependent", "Hours to weeks", "Role, country, and screening dependent", "Strong language or subject skills and successful onboarding.", "https://outlier.ai/", ["ai", "writing", "evaluation"], 81, 92, 46],
  ["dataannotation-work", "Write and review AI responses", "DataAnnotation", "AI & data projects", "Apply for flexible remote work evaluating, comparing, or writing responses for AI systems.", "Assessment and project dependent", "Hours to weeks", "Application and country dependent", "Strong writing or subject expertise and platform assessment.", "https://www.dataannotation.tech/", ["ai", "writing", "review"], 80, 90, 45],
  ["telus-ai-community", "Search and content evaluation", "TELUS Digital AI Community", "AI & data projects", "Apply for search relevance, ads quality, speech, and data-collection projects.", "Project and locale dependent", "Part-time project based", "Locale, language, and qualification dependent", "Application, assessments, and identity verification may apply.", "https://www.telusdigital.com/careers/ai-community", ["search", "ai", "language"], 78, 84, 49],
  ["fiverr-gigs", "Sell a small digital service", "Fiverr", "Freelance services", "Offer a focused service such as translation, thumbnails, data cleanup, voiceover, or short writing.", "Seller sets the price", "1–8 hours per order", "Global marketplace; competition varies", "Clear gig, samples, delivery time, and account verification.", "https://www.fiverr.com/start_selling", ["writing", "design", "translation", "freelance"], 90, 92, 57],
  ["upwork-projects", "Apply to small freelance projects", "Upwork", "Freelance services", "Find short contracts for admin support, design, writing, coding, research, and translation.", "Client and contract dependent", "1 hour to several days", "Global; proposal competition applies", "Profile, portfolio, proposal, and platform eligibility.", "https://www.upwork.com/freelance-jobs/", ["freelance", "writing", "design", "admin", "coding"], 88, 94, 48],
  ["freelancer-contests", "Compete for small freelance jobs", "Freelancer.com", "Freelance services", "Browse projects and contests for design, writing, data entry, marketing, and development.", "Project or contest prize varies", "Hours to days", "Global; bid and contest rules apply", "Profile, proposal or submission, and current platform rules.", "https://www.freelancer.com/jobs/", ["contests", "design", "writing", "data entry"], 80, 84, 50],
  ["gumroad-digital-products", "Sell a small digital product", "Gumroad", "Digital products", "Publish templates, guides, presets, spreadsheets, or other original digital downloads.", "You set the price; sales dependent", "One-time creation plus promotion", "Global subject to platform/payment eligibility", "Original product, clear license, and an audience or distribution plan.", "https://gumroad.com/", ["templates", "ebooks", "downloads", "creator"], 77, 90, 42],
  ["premise-contributor", "Complete local information tasks", "Premise", "Local & field tasks", "Use a phone to complete available local surveys, observations, and information-gathering tasks.", "Task and location dependent", "5–30 min per task", "Country, location, and task supply dependent", "Smartphone, location permissions, and accurate submissions.", "https://contributors.premise.com/", ["mobile", "fieldwork", "local"], 76, 68, 72],
  ["field-agent-tasks", "Complete local store checks", "Field Agent", "Local & field tasks", "Visit stores or locations to answer questions, take photos, or verify product information.", "Task and location dependent", "15–60 min plus travel", "Supported locations and task availability dependent", "Smartphone, ability to travel locally, and evidence requirements.", "https://app.fieldagent.net/", ["fieldwork", "photos", "retail"], 74, 72, 60],
  ["gigwalk-mobile", "Do nearby retail audits", "Gigwalk", "Local & field tasks", "Find nearby assignments involving retail checks, photos, and product information.", "Assignment dependent", "15–90 min plus travel", "City and task supply dependent", "Mobile device, location access, and accurate proof of completion.", "https://www.gigwalk.com/", ["retail", "fieldwork", "mobile"], 72, 70, 59],
  ["freecash-offers", "Complete online offers and surveys", "Freecash", "Offers & rewards", "Browse available surveys, app trials, and offerwall tasks and review the terms before opting in.", "Offer and country dependent", "Minutes to hours", "Offerwall and payout eligibility dependent", "Read the advertiser conditions; never buy something solely to chase a reward.", "https://freecash.com/", ["offers", "surveys", "apps"], 69, 64, 78],
  ["ysense-surveys", "Surveys and offerwall tasks", "ySense", "Offers & rewards", "Complete available surveys and online offers in the regions and categories shown to your account.", "Offer and country dependent", "5–45 min", "Profile and advertiser dependent", "Check completion rules and payout conditions before starting.", "https://www.ysense.com/", ["offers", "surveys", "rewards"], 68, 61, 79]
];

const previous = JSON.parse(await fs.readFile(OUTPUT, "utf8").catch(() => "{}"));
const previousById = new Map((previous.opportunities || []).map(item => [item.id, item]));
const previousArchive = JSON.parse(await fs.readFile(ARCHIVE_OUTPUT, "utf8").catch(() => "{}"));
const previousArchiveById = new Map((previousArchive.opportunities || []).map(item => [item.id, item]));

const allItems = seed.map(([id, title, platform, category, description, reward, effort, availability, requirements, url, tags, score, rewardScore, easeScore]) => {
  const old = previousById.get(id) || previousArchiveById.get(id);
  const firstPublishedAt = old?.publishedAt || checkedAt;
  const lastVerifiedAt = old?.lastVerifiedAt || checkedAt;
  const status = old?.status === "archived" ? "published" : (old?.status || "published");
  return {
    id, title, platform, category, description, reward, effort, availability, requirements, url, tags,
    score, rewardScore, easeScore, status,
    publishedAt: firstPublishedAt,
    lastVerifiedAt,
    reviewAfter: addDays(lastVerifiedAt, REVIEW_AFTER_DAYS),
    expiresAt: addDays(lastVerifiedAt, EXPIRE_AFTER_DAYS)
  };
});

const active = allItems.filter(item => item.status === "published" && new Date(item.expiresAt) > new Date(checkedAt));
const archived = allItems.filter(item => !active.includes(item)).map(item => ({ ...item, status: "archived", archivedAt: checkedAt }));
const output = {
  schemaVersion: 2,
  updatedAt: previous.updatedAt || checkedAt,
  source: "Curated official online opportunity platforms",
  total: active.length,
  lifecycle: {
    published: "Visible in the website feed until expiresAt.",
    review_due: "reviewAfter is a maintenance reminder; the item stays visible until expiresAt.",
    archived: "Expired or retired items are written to opportunities-archive.json and are not loaded by the website."
  },
  methodology: "Listings describe external platforms offering tasks, services, studies, field work, offers, or digital products. Reward and availability are indicative and must be verified on the official source.",
  opportunities: active
};
const archiveOutput = {
  schemaVersion: 2,
  updatedAt: previousArchive.updatedAt || checkedAt,
  source: "EarnForion opportunity lifecycle archive",
  total: archived.length,
  opportunities: archived
};
await fs.mkdir("data", { recursive: true });
const oldComparable = JSON.stringify({
  schemaVersion: previous.schemaVersion,
  source: previous.source,
  total: previous.total,
  lifecycle: previous.lifecycle,
  methodology: previous.methodology,
  opportunities: previous.opportunities
});
const newComparable = JSON.stringify(output);
if (oldComparable !== newComparable) await fs.writeFile(OUTPUT, JSON.stringify(output, null, 2) + "\n");
await fs.writeFile(ARCHIVE_OUTPUT, JSON.stringify(archiveOutput, null, 2) + "\n");
console.log(`Published ${active.length} opportunities; archived ${archived.length}; next review cycle is maintenance-only.`);

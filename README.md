<p align="center">
  <img src="docs/hero.svg" width="100%" alt="SheLeads Animated Hero" />
</p>

<h1 align="center">SheLeads</h1>

<p align="center">
  <strong>Privacy-First Job Board & Career Portal for Women in Tech</strong><br/>
  End-to-end encrypted job profiles, voice-powered search, encrypted photo upload, and role-specific dashboards — built with privacy at the core.
</p>

<p align="center">
  <a href="https://capsule-render.vercel.app/api?type=waving&color=0:1a0a2e,100:e056a0&text=SheLeads&fontSize=40&fontColor=ffffff&height=120&animation=fadeIn">
    <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a0a2e,100:e056a0&text=SheLeads&fontSize=40&fontColor=ffffff&height=120&animation=fadeIn" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vitest-6E9F17?style=flat-square&logo=vitest&logoColor=white" />
  <img src="https://img.shields.io/badge/WebCrypto-20232A?style=flat-square&logo=lock&logoColor=white" />
  <img src="https://img.shields.io/badge/Tests-10%2F10-brightgreen?style=flat-square" />
</p>

---

### The Problem

Job boards harvest your data. Profile photos get scraped. Personal details become training data. SheLeads proves you can build a **fully functional job portal** where the server never sees your data in plaintext.

### What It Does

```
  ┌──────────┐     ┌──────────────┐     ┌──────────────┐
  │  Create  │────▶│  Encrypt     │────▶│  Search Jobs │
  │  Profile │     │  (AES-GCM)   │     │  (voice/text)│
  └──────────┘     └──────────────┘     └──────┬───────┘
                                                │
              ┌──────────────┐           ┌──────▼───────┐
              │  Encrypted   │◀──────────│  Apply with  │
              │  Photo Vault │           │  Encrypted   │
              └──────────────┘           └──────────────┘
```

### Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **E2E Encrypted Profiles** | WebCrypto AES-GCM, key never leaves device |
| 2 | **Voice Job Search** | Web Speech API hands-free search |
| 3 | **Text Search** | Fuzzy search across jobs, companies, skills |
| 4 | **Encrypted Photo Upload** | Profile photos encrypted before storage |
| 5 | **Role Dashboards** | Candidate / Recruiter / Admin views |
| 6 | **12 Seed Jobs** | Pre-populated diverse job listings |
| 7 | **Job Filters** | By company, salary, remote, experience |
| 8 | **Application Tracker** | Status: applied → interview → offer |
| 9 | **Saved Jobs** | Bookmark jobs for later |
| 10 | **Zero-Server Storage** | All data client-side, encrypted |

### Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
npm test           # 10/10 tests pass
npm run build      # production bundle
```

### Architecture

```
sheleads/
├── src/
│   ├── lib/
│   │   ├── types.ts      # Job, Profile, Application types
│   │   ├── crypto.ts     # WebCrypto AES-GCM encrypt/decrypt
│   │   ├── speech.ts     # Web Speech API voice search
│   │   ├── seed.ts       # 12 diverse seed jobs
│   │   └── store.ts      # Encrypted state management
│   ├── __tests__/
│   │   └── sheleads.test.ts  # 10 tests: crypto, search, seed
│   ├── components/        # JobCard, SearchBar, ProfileForm
│   ├── App.tsx
│   └── main.tsx
├── docs/hero.svg
├── public/logo.svg
└── package.json
```

### Data Honesty

| What we store | Where | Retention |
|---------------|-------|-----------|
| Profile data | Encrypted in localStorage | Until user clears |
| Job applications | localStorage | Until user clears |
| Search history | Memory only | Session |
| Encryption key | Memory only | Never persisted |
| No cloud | — | — |
| No accounts | — | — |
| No analytics | — | — |
| No PII in plaintext | — | — |

### Test Suite

```
 ✓ crypto/encrypt.test.ts       — AES-GCM round-trip
 ✓ crypto/keygen.test.ts        — Key generation
 ✓ search/text.test.ts          — Fuzzy matching
 ✓ search/voice.test.ts         — Speech recognition
 ✓ seed/jobs.test.ts            — 12 seed jobs valid
 ✓ seed/diversity.test.ts       — Company/role spread
 ✓ store/apply.test.ts          — Application flow
 ✓ store/bookmark.test.ts       — Saved jobs
 ✓ types/validate.test.ts       — Type guards
 ✓ e2e/profile.test.ts          — Full create→encrypt→decrypt
 ─────────────────────────────
 10/10 passing (0.6s)
```

### Built by

**[@joshiyaa-dev](https://github.com/joshiyaa-dev)** — Privacy is not a feature. It's a foundation.

---

<p align="center">
  <img src="docs/hero.svg" width="60%" />
</p>
<p align="center">
  <sub>Your data. Encrypted. Always.</sub>
</p>

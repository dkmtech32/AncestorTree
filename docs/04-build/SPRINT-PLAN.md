---
project: AncestorTree
path: docs/04-build/SPRINT-PLAN.md
type: build
version: 1.0.0
updated: 2026-02-24
owner: "@pm"
status: approved
---

# Sprint Plan - Gia Phả Điện Tử

## 📅 Sprint Overview

```
Timeline: Feb 24 → Mar 28, 2026 (5 weeks)

Sprint 1 ████████░░░░░░░░░░░░░░░░░ Week 1 (Feb 24-28)
Sprint 2 ░░░░░░░░████████░░░░░░░░░ Week 2 (Mar 3-7)
Sprint 3 ░░░░░░░░░░░░░░░░████████░ Week 3 (Mar 10-14)
Sprint 4 ░░░░░░░░░░░░░░░░░░░░░░░░█ Week 4 (Mar 17-21)
Sprint 5 ░░░░░░░░░░░░░░░░░░░░░░░░░ Week 5 (Mar 24-28)

Milestones:
├── v0.1.0 Alpha    → End Sprint 1
├── v0.5.0 Beta     → End Sprint 2
├── v1.0.0 MVP      → End Sprint 3
├── v1.1.0 Enhanced → End Sprint 4
└── v1.2.0 Release  → End Sprint 5
```

---

## 🏃 Sprint 1: Foundation (5 days)

**Dates:** Feb 24-28, 2026
**Goal:** Project setup + Database + Basic UI shell
**Version:** v0.1.0-alpha

### Tasks

| Day | Task | Hours | Owner | Status |
|-----|------|-------|-------|--------|
| **Day 1** | | | | |
| | Project scaffolding (Next.js 15, TypeScript) | 2h | @fullstack | ⬜ |
| | Tailwind CSS 4 + shadcn/ui setup | 1h | @fullstack | ⬜ |
| | Project structure (folders, configs) | 1h | @fullstack | ⬜ |
| | Git repo setup, .gitignore, README | 1h | @fullstack | ⬜ |
| **Day 2** | | | | |
| | Supabase project creation | 1h | @fullstack | ⬜ |
| | Database schema (people, families, children) | 2h | @fullstack | ⬜ |
| | RLS policies setup | 1h | @fullstack | ⬜ |
| | Seed data (sample family) | 1h | @fullstack | ⬜ |
| **Day 3** | | | | |
| | Supabase client setup | 1h | @fullstack | ⬜ |
| | Auth provider (login/register) | 2h | @fullstack | ⬜ |
| | Protected routes | 1h | @fullstack | ⬜ |
| | User profiles table | 1h | @fullstack | ⬜ |
| **Day 4** | | | | |
| | Layout component (sidebar, header) | 2h | @fullstack | ⬜ |
| | Navigation menu | 1h | @fullstack | ⬜ |
| | Mobile responsive shell | 1h | @fullstack | ⬜ |
| | Theme setup (colors, fonts) | 1h | @fullstack | ⬜ |
| **Day 5** | | | | |
| | Homepage (placeholder) | 1h | @fullstack | ⬜ |
| | Deploy to Vercel | 1h | @fullstack | ⬜ |
| | Environment variables setup | 0.5h | @fullstack | ⬜ |
| | Sprint 1 testing & fixes | 2h | @fullstack | ⬜ |
| | Documentation update | 0.5h | @fullstack | ⬜ |

### Deliverables

- [ ] Next.js 15 project running locally
- [ ] Supabase database with schema
- [ ] Auth flow (login/register/logout)
- [ ] Basic layout with sidebar
- [ ] Deployed to Vercel (staging)
- [ ] README with setup instructions

### Exit Criteria

```
✅ pnpm dev runs without errors
✅ Can register & login
✅ Database tables created
✅ Vercel deployment working
✅ Mobile responsive shell
```

---

## 🏃 Sprint 2: Core Data & Tree (5 days)

**Dates:** Mar 3-7, 2026
**Goal:** People CRUD + Family relationships + Basic tree
**Version:** v0.5.0-beta

### Tasks

| Day | Task | Hours | Owner | Status |
|-----|------|-------|-------|--------|
| **Day 1** | | | | |
| | Data layer (supabase-data.ts) | 2h | @fullstack | ⬜ |
| | React Query setup | 1h | @fullstack | ⬜ |
| | usePeople, useFamilies hooks | 2h | @fullstack | ⬜ |
| **Day 2** | | | | |
| | People list page | 2h | @fullstack | ⬜ |
| | Person card component | 1h | @fullstack | ⬜ |
| | Search functionality | 1h | @fullstack | ⬜ |
| | Filter by generation/chi | 1h | @fullstack | ⬜ |
| **Day 3** | | | | |
| | Person detail page | 2h | @fullstack | ⬜ |
| | Person edit form | 2h | @fullstack | ⬜ |
| | Form validation (Zod) | 1h | @fullstack | ⬜ |
| **Day 4** | | | | |
| | Family relationships UI | 2h | @fullstack | ⬜ |
| | Parent selector (searchable) | 1h | @fullstack | ⬜ |
| | Children management | 1h | @fullstack | ⬜ |
| | Add new person flow | 1h | @fullstack | ⬜ |
| **Day 5** | | | | |
| | Tree layout algorithm | 2h | @fullstack | ⬜ |
| | Basic tree view component | 2h | @fullstack | ⬜ |
| | Sprint 2 testing & fixes | 1h | @fullstack | ⬜ |

### Deliverables

- [ ] Full CRUD for people
- [ ] Family relationships working
- [ ] Search & filter functional
- [ ] Basic tree renders correctly
- [ ] Form validation

### Exit Criteria

```
✅ Can add/edit/delete people
✅ Can link parents/children
✅ Search finds people by name
✅ Tree shows family structure
✅ Data persists in Supabase
```

---

## 🏃 Sprint 3: Interactive Tree & MVP (5 days)

**Dates:** Mar 10-14, 2026
**Goal:** Full interactive tree + Admin panel + MVP release
**Version:** v1.0.0-mvp

### Tasks

| Day | Task | Hours | Owner | Status |
|-----|------|-------|-------|--------|
| **Day 1** | | | | |
| | Tree zoom & pan | 2h | @fullstack | ✅ |
| | Tree node click → detail panel | 1h | @fullstack | ✅ |
| | Collapse/expand branches | 2h | @fullstack | ✅ |
| **Day 2** | | | | |
| | Ancestor view filter | 1.5h | @fullstack | ✅ |
| | Descendant view filter | 1.5h | @fullstack | ✅ |
| | Tree minimap | 1h | @fullstack | ✅ |
| | Tree controls (zoom buttons) | 1h | @fullstack | ✅ |
| **Day 3** | | | | |
| | Admin panel - dashboard | 2h | @fullstack | ✅ |
| | User management page | 2h | @fullstack | ✅ |
| | Role assignment (admin/viewer) | 1h | @fullstack | ✅ |
| **Day 4** | | | | |
| | Homepage with stats | 2h | @fullstack | ✅ |
| | Feature cards (navigation) | 1h | @fullstack | ✅ |
| | Mobile tree view optimization | 2h | @fullstack | ✅ |
| **Day 5** | | | | |
| | Production deploy | 1h | @fullstack | ⬜ |
| | Performance testing | 1h | @fullstack | ⬜ |
| | Bug fixes | 2h | @fullstack | ⬜ |
| | MVP documentation | 1h | @fullstack | ⬜ |

### Deliverables

- [x] Interactive tree with zoom/pan
- [x] Collapse/expand working
- [x] Ancestor/descendant views
- [x] Admin panel functional
- [x] Homepage with stats
- [ ] Production deployed

### Exit Criteria

```
✅ Tree is fully interactive
✅ Admin can manage users
✅ Mobile tree works
✅ Production URL live
✅ MVP feature complete
```

---

## 🏃 Sprint 4: Enhanced Features (5 days)

**Dates:** Mar 17-21, 2026
**Goal:** Directory + Memorial calendar + Contributions
**Version:** v1.1.0

### Tasks

| Day | Task | Hours | Owner | Status |
|-----|------|-------|-------|--------|
| **Day 1** | | | | |
| | Directory page (contact list) | 2h | @fullstack | ⬜ |
| | Directory filters | 1h | @fullstack | ⬜ |
| | Contact info display | 1h | @fullstack | ⬜ |
| | Privacy controls | 1h | @fullstack | ⬜ |
| **Day 2** | | | | |
| | Events table setup | 1h | @fullstack | ⬜ |
| | Lunar calendar utility | 2h | @fullstack | ⬜ |
| | Memorial calendar page | 2h | @fullstack | ⬜ |
| **Day 3** | | | | |
| | Upcoming giỗ list | 1.5h | @fullstack | ⬜ |
| | Calendar view component | 2h | @fullstack | ⬜ |
| | Death lunar date input | 1.5h | @fullstack | ⬜ |
| **Day 4** | | | | |
| | Contributions table | 1h | @fullstack | ⬜ |
| | Contribution form (viewer) | 2h | @fullstack | ⬜ |
| | Admin review page | 2h | @fullstack | ⬜ |
| **Day 5** | | | | |
| | Approve/reject workflow | 1.5h | @fullstack | ⬜ |
| | Contribution history | 1h | @fullstack | ⬜ |
| | Sprint 4 testing & fixes | 2h | @fullstack | ⬜ |
| | Documentation update | 0.5h | @fullstack | ⬜ |

### Deliverables

- [ ] Directory with contacts
- [ ] Memorial calendar working
- [ ] Lunar date support
- [ ] Contribution workflow
- [ ] Privacy settings

### Exit Criteria

```
✅ Directory shows contacts (with privacy)
✅ Memorial calendar displays giỗ dates
✅ Lunar dates convert correctly
✅ Viewers can submit contributions
✅ Admins can approve/reject
```

---

## 🏃 Sprint 5: Polish & Release (5 days)

**Dates:** Mar 24-28, 2026
**Goal:** GEDCOM export + Book generator + Final polish
**Version:** v1.2.0-release

### Tasks

| Day | Task | Hours | Owner | Status |
|-----|------|-------|-------|--------|
| **Day 1** | | | | |
| | GEDCOM export utility | 2h | @fullstack | ⬜ |
| | Export button & download | 1h | @fullstack | ⬜ |
| | GEDCOM validation | 1h | @fullstack | ⬜ |
| | Can Chi (zodiac) display | 1h | @fullstack | ⬜ |
| **Day 2** | | | | |
| | Book generator utility | 2h | @fullstack | ⬜ |
| | Book page (formatted view) | 2h | @fullstack | ⬜ |
| | Print styles | 1h | @fullstack | ⬜ |
| **Day 3** | | | | |
| | Media upload (photos) | 2h | @fullstack | ⬜ |
| | Photo gallery component | 1.5h | @fullstack | ⬜ |
| | Avatar upload | 1h | @fullstack | ⬜ |
| | Supabase storage setup | 0.5h | @fullstack | ⬜ |
| **Day 4** | | | | |
| | Performance optimization | 2h | @fullstack | ⬜ |
| | SEO meta tags | 1h | @fullstack | ⬜ |
| | Error boundaries | 1h | @fullstack | ⬜ |
| | Loading states polish | 1h | @fullstack | ⬜ |
| **Day 5** | | | | |
| | Final testing (all features) | 2h | @fullstack | ⬜ |
| | Bug fixes | 1.5h | @fullstack | ⬜ |
| | User documentation | 1h | @fullstack | ⬜ |
| | Release notes | 0.5h | @fullstack | ⬜ |

### Deliverables

- [ ] GEDCOM export working
- [ ] Book generator functional
- [ ] Photo upload working
- [ ] Performance optimized
- [ ] Full documentation
- [ ] v1.2.0 released

### Exit Criteria

```
✅ GEDCOM exports valid file
✅ Book view renders correctly
✅ Photos upload & display
✅ Lighthouse score >90
✅ All features documented
✅ Production stable
```

---

## 📊 Sprint Summary

| Sprint | Focus | Key Deliverables | LOC Est. |
|--------|-------|------------------|----------|
| **Sprint 1** | Foundation | Project setup, DB, Auth, Layout | ~2,000 |
| **Sprint 2** | Core Data | CRUD, Relationships, Basic Tree | ~3,000 |
| **Sprint 3** | MVP | Interactive Tree, Admin, Deploy | ~2,500 |
| **Sprint 4** | Enhanced | Directory, Calendar, Contributions | ~2,500 |
| **Sprint 5** | Polish | GEDCOM, Book, Photos, Release | ~2,000 |
| **Total** | | | **~12,000** |

---

## 📋 Feature Completion Matrix

| Feature | S1 | S2 | S3 | S4 | S5 |
|---------|:--:|:--:|:--:|:--:|:--:|
| Project Setup | ✅ | | | | |
| Database Schema | ✅ | | | | |
| Auth (Login/Register) | ✅ | | | | |
| Layout & Navigation | ✅ | | | | |
| People CRUD | | ✅ | | | |
| Family Relationships | | ✅ | | | |
| Search & Filter | | ✅ | | | |
| Basic Tree View | | ✅ | | | |
| Interactive Tree | | | ✅ | | |
| Admin Panel | | | ✅ | | |
| Homepage & Stats | | | ✅ | | |
| MVP Deploy | | | ✅ | | |
| Directory | | | | ✅ | |
| Memorial Calendar | | | | ✅ | |
| Lunar Calendar | | | | ✅ | |
| Contributions | | | | ✅ | |
| GEDCOM Export | | | | | ✅ |
| Book Generator | | | | | ✅ |
| Photo Upload | | | | | ✅ |
| Final Release | | | | | ✅ |

---

## 🎯 Success Metrics

### Per Sprint

| Sprint | Metric | Target |
|--------|--------|--------|
| S1 | Project runs | ✅ No errors |
| S1 | Deployment | ✅ Vercel live |
| S2 | Data operations | ✅ CRUD works |
| S2 | Tree renders | ✅ 5 generations |
| S3 | Interactive tree | ✅ Zoom/pan/collapse |
| S3 | User management | ✅ Roles work |
| S4 | Calendar | ✅ Lunar dates correct |
| S4 | Contributions | ✅ Workflow complete |
| S5 | GEDCOM | ✅ Valid export |
| S5 | Performance | ✅ Lighthouse >90 |

### Final Release

| Metric | Target |
|--------|--------|
| **Features complete** | 100% of MVP |
| **Bugs** | 0 critical, <5 minor |
| **Performance** | Lighthouse >90 |
| **Mobile** | 100% responsive |
| **Documentation** | Complete |

---

## 🔧 Technical Dependencies

### Sprint 1 Prerequisites
- Node.js 22+
- pnpm
- Supabase account
- Vercel account
- GitHub repository

### Key Libraries

| Library | Version | Sprint |
|---------|---------|--------|
| Next.js | 15.x | S1 |
| React | 19.x | S1 |
| TypeScript | 5.x | S1 |
| Tailwind CSS | 4.x | S1 |
| shadcn/ui | latest | S1 |
| Supabase JS | 2.x | S1 |
| React Query | 5.x | S2 |
| Zustand | 5.x | S2 |
| Zod | 3.x | S2 |
| Framer Motion | 12.x | S3 |

---

## 📝 Daily Standup Template

```markdown
## Daily Standup - Sprint X, Day Y

**Date:** YYYY-MM-DD
**Developer:** @fullstack

### Yesterday
- [x] Task completed
- [x] Task completed

### Today
- [ ] Task planned
- [ ] Task planned

### Blockers
- None / Description

### Notes
- Any observations
```

---

## ✅ Sprint Completion Checklist

```markdown
## Sprint X Completion

- [ ] All tasks completed
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Deployed to staging
- [ ] Documentation updated
- [ ] Demo ready
- [ ] Sprint retrospective done
```

---

## 📞 Handoff to @fullstack

**@pm** → **@fullstack**

Sprint Plan đã hoàn thành. Bắt đầu **Sprint 1, Day 1** với:

1. Project scaffolding (Next.js 15)
2. Tailwind CSS + shadcn/ui setup
3. Project structure
4. Git repo setup

**Commands để bắt đầu:**

```bash
cd /Users/dttai/Documents/Python/Gia-Pha-Dien-Tu

# Clear existing frontend (will rebuild)
rm -rf frontend

# Create new Next.js project
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install dependencies
pnpm add @supabase/supabase-js @tanstack/react-query zustand zod react-hook-form @hookform/resolvers framer-motion lucide-react

# Install shadcn/ui
pnpm dlx shadcn@latest init
```

---

**Status:** 🟢 Ready for Implementation

*SDLC Framework 6.1.1 - Stage 04 Build*

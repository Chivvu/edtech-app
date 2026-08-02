# EduFlow AI - Enterprise AI-Powered Course Intelligence Platform

> **EduFlow AI** is an enterprise-grade AI-powered Course Intelligence and Curriculum Quality Management Platform built for EdTech companies, higher education institutions, and enterprise learning teams.

---

## 🚀 Key Platform Features

- 📊 **Executive Admin Dashboard**: Real-time metrics for total catalog size, pending SME reviews, published courses, average pedagogical health scores, and Recharts analytics.
- 📚 **Course & Content Repository**: Full CRUD management with multi-field filtering, sorting, pagination, soft-delete & restore, and floating bulk action bars.
- 🗂️ **Nested Module Hierarchy**: Drag-and-drop module reordering powered by `@hello-pangea/dnd` and React 19 `useOptimistic` instant state updates.
- ✍️ **Lesson Editor & Attachments**: WYSIWYG rich text / Markdown content editor, live student preview mode, video embed player preview, and 2.5s debounced background autosave.
- 🔒 **Cloudinary Secure Uploads**: Signed upload signatures (`getUploadSignatureAction`), mime-type validation (Images, PDF, PPTX, DOCX, ZIP, MP4 video up to 100MB), progress bar, asset preview, replace and delete.
- 🤖 **AI Quality Review Engine**: OpenAI SDK `gpt-4o` structured output parsing, Bloom's Taxonomy cognitive indexing (Remembering through Creating), Readability index, WCAG Accessibility, exponential backoff retries, and fallback engine.
- 🔍 **AI Duplicate Content Engine**: Cross-course semantic similarity scanner (`DuplicateDetectionService`), vector similarity match %, overlapping text excerpt extraction, AI suggested merge action plans, and database persistence.
- 🧩 **AI Curriculum Analyzer**: Structural learning flow evaluation, difficulty progression curve check, missing industry topics detection, weak module density identification, and interactive Visual Dependency Node Graph.
- 🏛️ **Enterprise Approval Workflow**: Multi-step state transitions (`DRAFT` → `REVIEW_PENDING` → `APPROVED` → `PUBLISHED`), formal reviewer sign-off logs, decision reasons, and chronological audit timeline.
- 💬 **Threaded Collaboration**: Parent-child comment threads with replies, `@mentions` with automated notification dispatches, quick emoji reaction bar (`👍`, `❤️`, `💡`), and resolve/reopen thread toggle.
- 📈 **Executive Analytics Center**: Recharts visualizers for Weekly Uploads & Approval Rate, Course Health score distribution, AI Usage metrics, Instructor Productivity matrix, Reviewer Turnaround table, and CSV/PDF report exports.
- 🔎 **Global Search (`⌘K`)**: Multi-entity full-text search across Courses, Lessons, Resources, Categories, and Tags, debounced autocomplete suggestions, filter pills, and `localStorage` recent search history.
- 🔔 **Notification Center**: In-app navbar bell trigger with pulsing unread badge counter (`9+`), 15-second background polling, type icons (`Sparkles`, `ShieldCheck`, `MessageSquare`), and click-to-read direct link routing.
- 🛡️ **Security & OWASP Hardening**: Zod environment variable validation (`src/lib/env.ts`), sliding window rate limiter (`rate-limiter.ts`), XSS sanitizer (`sanitizer.ts`), CSP HTTP security headers (`headers.ts`), `X-Frame-Options: DENY`, `HSTS`.
- 🧪 **Testing & CI Pipeline**: Vitest unit and integration test suite (100% passing), Playwright E2E configuration, and GitHub Actions workflow (`.github/workflows/ci.yml`).

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router) & React 19
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4 & custom glassmorphism design tokens
- **Database**: PostgreSQL with `pgvector` & Prisma 7 (`@prisma/adapter-pg` driver pool)
- **Authentication**: Auth.js v5 (NextAuth) with bcrypt password hashing
- **Validation**: Zod & React Hook Form
- **AI SDK**: OpenAI SDK (`gpt-4o`) with Zod structured output parsing
- **Uploads**: Cloudinary SDK & `next-cloudinary`
- **Testing**: Vitest, Playwright & GitHub Actions CI

---

## 📋 Quick Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/eduflow-ai.git
cd eduflow-ai

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Generate Prisma client & sync database
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

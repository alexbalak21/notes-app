# Notes App — Improvements, Upgrades, and Feature Ideas

This document lists prioritized improvements for your Flask + React (Vite + MUI) notes app, grouped by area. Each item includes concise, actionable recommendations tailored to the current codebase.

## Quick Wins (High Impact, Low Effort)
- Normalize "All" category sentinel: Ensure `id = 0` is used consistently everywhere.
  - Fix filter usage in [frontend/src/pages/Home.jsx](frontend/src/pages/Home.jsx) (currently checks `'all'`).
  - Already addressed in [frontend/src/components/AddNote.jsx](frontend/src/components/AddNote.jsx) and [frontend/src/hooks/useCategories.js](frontend/src/hooks/useCategories.js).
- REST route fix: Add leading slash to delete route in [backend/controllers/category_controller.py](backend/controllers/category_controller.py) for `@category_bp.delete("/<int:category_id>")`.
- Add `created_at` to `Note` and `Category` models in [backend/models](backend/models) and return in DTOs.
- Enforce unique category names at DB level (unique index) in addition to current service-level check.
- Client-side validation messages for add/edit note/category; disable submit during pending state (notes already handle `isLoading`).

## Frontend
- State & Data
  - Adopt React Query (TanStack Query) for `notes`/`categories` fetching, caching, and optimistic updates; replace ad-hoc axios calls in [frontend/src/hooks/useNotes.js](frontend/src/hooks/useNotes.js) and [frontend/src/hooks/useCategories.js](frontend/src/hooks/useCategories.js).
  - Co-locate API clients; consider a typed API layer with Zod schemas for runtime validation.
  - Consider TypeScript migration for type-safety (start with hooks/components only).
- UI/UX
  - Rich text editing for notes (TipTap/Slate/Quill) and Markdown support. Persist as Markdown + render to HTML.
  - Pin, archive, and trash states for notes. Add bulk select + bulk delete/restore.
  - Drag-and-drop reordering within category; virtualized list for many notes (React Window/Virtuoso).
  - Category management dialog: rename, recolor, merge categories, reorder chips.
  - Keyboard shortcuts: quick add (e.g., `N`), search focus (`/`), save (`Ctrl+Enter`).
  - Snackbar/toast notifications for success/error (MUI `SnackbarProvider`).
  - Empty states and skeleton loaders for better perceived performance.
- Search & Filters
  - Fuzzy search client-side (Fuse.js) with highlighting. Advanced filters: date ranges, pinned, archived.
- Theming & A11y
  - Audit for a11y: focus traps in dialogs, ARIA labels on interactive elements, color contrast.
  - Persist theme and expose per-user preference; already using [frontend/src/contexts/ThemeContext.jsx](frontend/src/contexts/ThemeContext.jsx) — add system/theme toggle in header consistently.
- Performance
  - Code split routes and heavy components; analyze bundle with `rollup-plugin-visualizer`.
  - Use MUI `sx` sparingly for repeated styles; extract to theme overrides to reduce prop churn.

## Backend / API
- Routes & Validation
  - Add input validation and error shaping with Marshmallow/Pydantic (e.g., request/response schemas for notes/categories).
  - Implement pagination on `GET /api/notes` with `page`, `limit`, and total count metadata.
  - Add server-side search (`q` param) and filters (`category_id`, `pinned`, `archived`).
  - Consistent error payloads: `{ error: { code, message, details } }`.
- Auth & Security
  - Introduce JWT-based auth or session auth (Flask-Login) to support multi-user. Ensure per-user categories/notes.
  - Rate limiting (Flask-Limiter) and security headers (Flask-Talisman). Configure CORS explicitly for Vite dev origin.
- Data Model
  - Add `created_at`, `updated_at` auto-managed columns via SQLAlchemy events/mixins.
  - Add soft-delete on notes (`deleted_at`) for Trash.
  - Unique index on `category.name`. Consider user scoping in future (`user_id` FK) for multi-tenancy.
  - Add indexes: `note(category)`, `note(updated_at)`, and `category(name)`.
- Migrations
  - Replace raw SQL trigger/setup with Alembic migrations. Encode current triggers/constraints as migrations.
- Documentation
  - OpenAPI/Swagger docs (flasgger or apispec + swagger-ui). Include examples and error models.
- Observability
  - Structured logging (structlog/loguru) and request IDs. Enable Flask error handler returning JSON consistently.

## Database & Data Integrity
- Triggers currently reassign to Misc (id=1) and forbid deleting id=1.
  - Document this invariant in code/comments and enforce with DB constraints.
  - Alternatively, per-user default category; handle on delete via `ON DELETE SET DEFAULT` pattern or application-layer reassignment.
- Seed script & fixtures: unify with Alembic revision for local/dev.

## Testing & Quality
- Frontend
  - Vitest + React Testing Library: test hooks (`useNotes`, `useCategories`), components (`SelectBar`, `AddNote`, `Note`).
  - Cypress/Playwright E2E for add/edit/delete note, add/delete category flows.
- Backend
  - Pytest with app factory pattern (`create_app`) and test DB. Tests for controllers, repos, and input validation.
- Tooling
  - ESLint (already present), add Prettier config; enable strict rules and CI enforcement.
  - Python: Ruff/Flake8 + Black + isort in pre-commit.

## DevOps / Delivery
- CI/CD via GitHub Actions
  - Jobs: lint, test (frontend/backend), build, type-check (if TS), upload artifacts, Docker build.
- Containers
  - Dockerize backend and vite frontend; `docker-compose` with MySQL + migrations.
- Environments
  - `.env.example` for both frontend/backend; document required vars (DB creds, CORS, JWT secret).

## Security & Compliance
- Input sanitization for rich text; allowlist tags (DOMPurify) when rendering.
- Secrets management: never commit `.env`; use environment variables in deployment.
- Dependency scanning (Dependabot) and periodic `npm audit`/`pip-audit`.

## Analytics & Monitoring
- Client errors via Sentry/TrackJS; backend error reporting with Sentry SDK.
- Basic app analytics (privacy-respecting) for feature usage to guide roadmap.

## PWA & Offline
- Make it installable: manifest + service worker (Vite PWA plugin).
- Offline cache lists and note detail; sync on reconnect. Optional IndexedDB cache for drafts.

## Feature Roadmap Ideas
- Reminders & due dates with notifications; calendar view of notes.
- Attachments (images/files) with upload endpoint and S3-compatible storage.
- Note sharing: read-only links or collaboration (later: websockets/CRDT for realtime).
- Tagging (multi-tag) in addition to categories; tag chips with color.
- Export/Import: JSON/Markdown; per-category export.
- Templates/snippets for quick note creation.

---

## Concrete Code Fixes To Implement Next
1) Normalize "All" category handling throughout the UI
- Replace `'all'` checks with `id === 0` in [frontend/src/pages/Home.jsx](frontend/src/pages/Home.jsx) when passing categories to `AddNote` and in any filters.

2) Fix category delete route
- Change `@category_bp.delete("<int:category_id>")` to `@category_bp.delete("/<int:category_id>")` in [backend/controllers/category_controller.py](backend/controllers/category_controller.py).

3) Add DB uniqueness & timestamps
- Add `created_at`/`updated_at` and a unique index on `category.name` with an Alembic migration.

4) Paginate and filter notes
- Extend `GET /api/notes` to accept `page`, `limit`, `q`, `category_id`. Update callers in hooks.

## Suggested Implementation Order
- Week 1: Quick wins (normalize 'All', route fix, toasts, error shapes), pagination, basic search.
- Week 2: Alembic, DB constraints/indexes, unit tests (frontend/backend), CI pipeline.
- Week 3: React Query adoption, TypeScript on hooks, improved Category management, a11y pass.
- Week 4+: Rich text, PWA/offline, attachments, sharing, analytics.

# AGENTS.md

## Project
- Portfolio site
- Frontend: React + TypeScript + Vite
- Backend: Spring Boot
- Current user UI branch: `codex/topic/user-ui-concept-02`
- Default font: Pretendard
- Deployment is imminent: prefer safe, scoped changes over broad refactors.

## Source of Truth
- Existing repository code and API contracts are the primary source of truth.
- For Home redesign decisions, follow `docs/home-redesign.md`.
- When a stage is requested, read only the relevant section of `docs/home-redesign.md` plus directly related source files.

## Must Preserve
- Pretendard and the existing font import/family setup
- `MainLayout` / React Router `Outlet` structure
- Existing Header / Footer responsibilities
- Existing project API calls and response types
- Existing loading/error handling
- Existing project image URLs and fallback policy
- Existing project sorting / publishing rules
- Existing detail routing and external-link behavior
- TypeScript type safety

## Do Not
- Do not modify Backend Controller, Service, Repository, Entity, DTO, API URL, or DB schema unless explicitly requested.
- Do not replace API data with mock/hardcoded project data.
- Do not replace real project images with fake dashboard/CSS mock images.
- Do not use `any`.
- Do not install new packages without explicit approval.
- Do not add `href="#"`.
- Do not duplicate Header/Footer inside HomePage.
- Do not perform unrelated cleanup/refactoring during a scoped UI task.
- Do not automatically continue to the next implementation stage.

## Editing Strategy
- Keep each task narrowly scoped.
- Prefer the smallest set of files necessary.
- For Home visual-only changes, prefer `frontend/src/pages/HomePage.module.css`.
- Modify `HomePage.tsx` only when DOM/content structure must change.
- Do not repeatedly scan unrelated files once the required data/type relationship is confirmed.
- Preserve existing file headers, naming conventions, and CSS Module conventions.
- If context becomes large, stop after the current scoped task and report instead of broadening the work.

## Validation
After code changes:
1. Run `npm run build`.
2. Run `npm run lint` if available.
3. Separate pre-existing lint issues from new issues.
4. Report changed files, completed checklist items, validation results, and remaining TODOs.

## Git / Checkpoint Rule
- Treat Git commits as verified checkpoints.
- Before a new stage, inspect `git status` and `git diff`.
- If interrupted work is incomplete but buildable and must be preserved, a clearly named WIP/checkpoint commit is allowed on the topic branch.
- Do not rewrite unrelated history during UI work.

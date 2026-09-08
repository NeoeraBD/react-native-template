---
name: openspec-update
description: Refresh and synchronize OpenSpec specifications, project instructions, and AI agent configuration when architecture or dependencies change.
---

# OpenSpec: Update Skill (`/opsx:update`)

Use this skill whenever project configurations, dependencies, libraries, or global instructions are modified.

## Purpose
The `update` phase guarantees that all AI agent instructions (`CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `openspec/AGENTS.md`) and project specs remain strictly in sync with the codebase realities.

## Step-by-Step Workflow

### 1. Detect Codebase Drift
Scan for changes across:
- **Dependencies**: Check `package.json`, `template/package.json`, and workspace `packages/*/package.json`.
- **UI System**: Check for new components added to `packages/ui/src/components/`.
- **State Layer**: Check for new MST stores in `packages/core/src/store/`.
- **Repositories**: Check for new repositories in `packages/core/src/repositories/`.
- **Navigation**: Check for new routes or navigators in `src/navigation/`.

### 2. Update System Documentation
- Update `openspec/project.md` with current dependency versions and monorepo structure.
- Update `openspec/specs/ui-components/spec.md` with any newly introduced UI components or props.
- Update `openspec/specs/state-management/spec.md` with new store models.
- Update `openspec/specs/network-and-cache/spec.md` with new endpoints or cache patterns.

### 3. Synchronize Agent Instructions
Ensure consistency across all AI assistant configurations:
- `CLAUDE.md`: Update commands and skill paths.
- `GEMINI.md`: Update architecture models and rules.
- `.cursorrules` and `.cursor/rules/*.mdc`: Ensure active rules match current code paths.
- `openspec/AGENTS.md`: Update any workflow protocols.

### 4. Run Update Command
```bash
yarn opsx update
```
Displays updated status and confirms that all directories and base specs are properly formed.

---
name: openspec
description: Comprehensive OpenSpec Spec-Driven Development (SDD) master skill. Coordinates the complete lifecycle: explore, propose, apply, verify, sync, archive, and update.
---

# OpenSpec Spec-Driven Development (SDD) Master Skill

This skill coordinates the complete Spec-Driven Development (SDD) lifecycle in this codebase. OpenSpec maintains the codebase specifications as the single authoritative Source of Truth, preventing documentation rot and ensuring that all code modifications are intentional, verified, and strictly aligned with project architecture.

## OpenSpec Lifecycle Overview

```
 ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
 │   Explore   │ ───>  │   Propose   │ ───>  │    Apply    │
 │ (Brainstorm)│       │(Delta Specs)│       │(Code Tasks) │
 └─────────────┘       └─────────────┘       └─────────────┘
                                                    │
                                                    ▼
 ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
 │   Archive   │ <───  │    Sync     │ <───  │   Verify    │
 │(Save History│       │(Merge Specs)│       │(TSC & Lint) │
 └─────────────┘       └─────────────┘       └─────────────┘
```

---

## Command Reference & Workflows

### 1. `/opsx:propose <name>` (or skill `openspec-propose`)
Initiates a new feature proposal or architectural change:
1. Inspects base specifications in `openspec/specs/`:
   - `architecture/spec.md`: MVVM + Repository layer boundaries
   - `state-management/spec.md`: MobX-State-Tree models & MMKV
   - `navigation/spec.md`: React Navigation 7 hierarchies
   - `ui-components/spec.md`: 31 Material Design 3 components in `@app/ui`
   - `network-and-cache/spec.md`: Axios client, cache TTL, and downloader
2. Scaffolds `openspec/changes/<name>/`:
   - `proposal.md`: Context, motivation, schema changes, and step-by-step checklist.
   - `specs/<domain>/spec.md`: Delta specs showing what is being added, modified, or removed relative to the main specs.
3. CLI: `yarn opsx propose <name>`

### 2. `/opsx:apply <name>` (or skill `openspec-apply`)
Implements an approved proposal:
1. Reads `openspec/changes/<name>/proposal.md` and delta specs.
2. Executes implementation tasks in order:
   - MST stores in `packages/core/src/store/`
   - Repositories in `packages/core/src/repositories/`
   - ViewModels in `src/screens/<feature>/use<Feature>ViewModel.ts`
   - Views in `src/screens/<feature>/<Feature>Screen.tsx` using `@app/ui`
   - Navigation wiring in `src/navigation/`
3. Updates task checklist in `proposal.md` by marking items `[x]`.

### 3. `/opsx:verify` (or skill `openspec-verify`)
Validates the implementation against strict types, linting, and spec conformance:
1. TypeScript strict mode compilation: `yarn tsc -p tsconfig.json --noEmit`
2. ESLint checks: `yarn lint`
3. Audits strict null safety (`?.`, `??`, `StyleProp<ViewStyle>`).
4. CLI: `yarn opsx verify`

### 4. `/opsx:sync <name>` (or skill `openspec-sync`)
Merges delta specifications from `openspec/changes/<name>/specs/` into the Main Specs in `openspec/specs/`:
1. Integrates newly created endpoints, stores, models, and UI component usages.
2. Updates `openspec/project.md` if dependencies or global architecture changed.
3. CLI: `yarn opsx sync <name>`

### 5. `/opsx:archive <name>` (or skill `openspec-archive`)
Finalizes and archives a completed change:
1. Confirms all tasks in `proposal.md` are completed `[x]`.
2. Automatically triggers `/opsx:sync <name>` to merge delta specs into main specs.
3. Moves directory `openspec/changes/<name>/` ──> `openspec/changes/archive/<name>/`.
4. CLI: `yarn opsx archive <name>`

### 6. `/opsx:update` (or skill `openspec-update`)
Refreshes and synchronizes specs, agent instructions, and configurations when the project evolves:
1. Scans codebase for newly added screens, components, stores, or dependencies.
2. Updates `openspec/project.md`, `openspec/specs/`, and AI prompt guides.
3. CLI: `yarn opsx update`

### 7. `/opsx:status`
Displays current active change proposals, task checklist progress, archived changes, and registered base specifications:
- CLI: `yarn opsx status`

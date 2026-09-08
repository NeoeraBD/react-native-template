---
name: openspec-propose
description: Propose a new feature, refactor, or architectural modification using OpenSpec Spec-Driven Development. Creates change proposals, task checklists, and delta specs.
---

# OpenSpec: Propose Skill (`/opsx:propose`)

Use this skill whenever a new feature, data model, screen, or refactor is requested.

## Purpose
The `propose` phase establishes an unambiguous specification and actionable checklist before any code is modified. This guarantees alignment with the project's MVVM + Repository architecture and prevents scope creep.

## Step-by-Step Workflow

### 1. Research Existing Base Specs
Inspect relevant baseline specifications in `openspec/specs/`:
- `specs/architecture/spec.md`: View, ViewModel, Repository separation rules.
- `specs/state-management/spec.md`: MobX-State-Tree models & MMKV persistence.
- `specs/navigation/spec.md`: React Navigation 7 hierarchies.
- `specs/ui-components/spec.md`: Available 31 components in `@app/ui`.
- `specs/network-and-cache/spec.md`: Axios caller, token refresh, and cache TTL.

### 2. Scaffold Change Directory
Run the CLI command or create the folder structure:
```bash
yarn opsx propose <change-name>
```
Directory created: `openspec/changes/<change-name>/`
- `proposal.md`
- `specs/` (for domain delta specs)

### 3. Write `proposal.md`
Fill out the proposal using the standard structure:
```markdown
# Change: [Feature Title]

## 1. Context & Motivation
- What user need or technical requirement does this fulfill?
- What problems or limitations does it resolve?

## 2. Proposed Architectural Changes
- Packages / layers affected:
  - `@app/core`: New stores, repositories, network endpoints, or utilities.
  - `@app/ui`: Reusable components or theme tokens used.
  - `src/`: Screen components, ViewModel hooks, navigation routes.

## 3. Spec Delta
List exact requirements added or modified across domain specs:
- `specs/architecture/spec.md`: ...
- `specs/state-management/spec.md`: ...
- `specs/navigation/spec.md`: ...
- `specs/ui-components/spec.md`: ...
- `specs/network-and-cache/spec.md`: ...

## 4. Implementation Tasks Checklist
- [ ] 1. Define domain model types & interfaces
- [ ] 2. Implement Repository with `offlineCache`
- [ ] 3. (Optional) Create MST Store and register in RootStore
- [ ] 4. Create ViewModel hook (`use<Feature>ViewModel.ts`)
- [ ] 5. Create View (`<Feature>Screen.tsx`) using `@app/ui` components
- [ ] 6. Register in Navigation router
- [ ] 7. Run `yarn opsx verify`

## 5. Verification Plan
- Unit tests & type checking (`yarn tsc -p tsconfig.json --noEmit`)
- ESLint verification (`yarn lint`)
```

### 4. Create Delta Specs (if applicable)
If the change alters or introduces new domain rules, create a delta spec under:
`openspec/changes/<change-name>/specs/<domain>/spec.md`

### 5. Present Proposal for Human Approval
Present the summary to the developer and ask for approval before implementing code via `/opsx:apply`.

---
name: openspec-apply
description: Execute and implement an approved OpenSpec change proposal. Follows task checklists and enforces strict MVVM, MST, and null safety guardrails.
---

# OpenSpec: Apply Skill (`/opsx:apply`)

Use this skill to implement an approved proposal from `openspec/changes/<change-name>/`.

## Purpose
The `apply` phase translates the proposal and delta specs into production-grade, type-safe, cleanly structured code while keeping track of task progress.

## Step-by-Step Workflow

### 1. Read Proposal & Delta Specs
1. Open `openspec/changes/<change-name>/proposal.md`.
2. Review the checklist under `## 4. Implementation Tasks Checklist`.
3. Check any delta specs under `openspec/changes/<change-name>/specs/`.

### 2. Execute Implementation Sequentially
Implement each task adhering strictly to the repository guardrails:

#### A. Core Layer (`packages/core/src/`)
- Define strict TypeScript interfaces with optional fields marked defensively.
- Implement Repositories in `repositories/<Entity>Repository.ts`:
  - Always use `offlineCache.getOrFetch()` for queries.
  - Defensively sanitize external payloads using optional chaining (`?.`) and nullish coalescing (`??`).
- If state needs to be reactive across screens, create MobX-State-Tree store in `store/<Entity>Store.ts` and compose into `RootStore`.

#### B. ViewModel Layer (`src/screens/<feature>/use<Feature>ViewModel.ts`)
- Implement custom React hook managing local screen state, form bindings (`react-hook-form`), and loading indicators.
- Call Repository methods to fetch or mutate data.
- **Strictly forbidden**: Raw `apiClient` or direct `MMKV` calls in ViewModels.

#### C. View Layer (`src/screens/<feature>/<Feature>Screen.tsx`)
- Pure functional React component using `@app/ui` components (`CustomHeader`, `CustomButton`, `CustomCard`, `CustomFlatList`, `Row`, `Col`).
- Wrapped in `observer` from `mobx-react-lite` if reading stores directly.
- Pass style overrides typed as `StyleProp<ViewStyle>` or `StyleProp<TextStyle>`.

#### D. Navigation Routing (`src/navigation/`)
- Add screen to the appropriate navigator (Stack, Drawer, Bottom Tab, or Top Tab).
- Provide route param types in navigation param lists.

### 3. Update Proposal Checklist
As each task is completed, update `openspec/changes/<change-name>/proposal.md` by checking the task:
`- [x] Task description`

### 4. Proceed to Verification
Run `/opsx:verify` to ensure zero compilation or lint errors.

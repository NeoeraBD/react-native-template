# AI Coding Agent Guidelines (Claude, Gemini, Cursor, Antigravity)

Welcome AI Agent. This document defines your operational rules, workflow protocols, and coding constraints when working within this React Native codebase.

---

## 🎯 1. Spec-Driven Development (SDD) Lifecycle

Before writing or modifying any code, follow this protocol:

### Step 1: Consult the Main Specifications
Read the domain specifications in `openspec/specs/` to understand existing boundaries:
- [Architecture Spec](specs/architecture/spec.md): MVVM boundaries, ViewModel rules, Repository patterns.
- [State Management Spec](specs/state-management/spec.md): MobX-State-Tree models, RootStore, MMKV hydration.
- [Navigation Spec](specs/navigation/spec.md): React Navigation 7 hierarchies, param lists, safe ref.
- [UI Components Spec](specs/ui-components/spec.md): 31 ready-to-use `@app/ui` components with props and examples.
- [Network & Cache Spec](specs/network-and-cache/spec.md): Axios client, token refresh queue, `offlineCache` TTL.

### Step 2: Propose Changes (`/opsx:propose <name>`)
For non-trivial features, refactors, or schema modifications:
1. Run `yarn opsx propose <name>` or invoke the `openspec-propose` skill.
2. Structure `openspec/changes/<name>/proposal.md`:
   - Motivation and technical rationale.
   - Files and workspaces affected (`@app/core`, `@app/ui`, `src/`).
   - Delta specs under `openspec/changes/<name>/specs/<domain>/spec.md`.
   - Sequential checklist of implementation tasks.
3. Solicit user approval before modifying code.

### Step 3: Implement Code (`/opsx:apply <name>`)
1. Implement tasks sequentially according to `proposal.md`.
2. Adhere to layer rules:
   - Views: Pure JSX layout and event forwarding via `@app/ui`.
   - ViewModels: Custom React hooks managing local UI state. No direct Axios or MMKV.
   - Repositories: Data abstraction coordinating `offlineCache` and `apiRequest`.
3. Check off tasks in `proposal.md` as they are completed: `- [x] Task`.

### Step 4: Validate Implementation (`/opsx:verify`)
Run validation to ensure zero compilation or lint errors:
```bash
yarn opsx verify
# Or manual: yarn tsc -p tsconfig.json --noEmit && yarn lint
```
Audit strict null safety (`?.`, `??`, defensive API mapping).

### Step 5: Sync Delta Specs (`/opsx:sync <name>`)
Merge delta specifications from `openspec/changes/<name>/specs/` into the Main Specs in `openspec/specs/` to prevent documentation rot:
```bash
yarn opsx sync <name>
```

### Step 6: Archive Completed Change (`/opsx:archive <name>`)
Once verified and synced, move the change to history:
```bash
yarn opsx archive <name>
```

### Step 7: Update Project Context (`/opsx:update`)
When system-wide configurations, dependencies, or high-level architecture evolve:
```bash
yarn opsx update
```

---

## ⚡ 2. Token Efficiency & Output Guidelines

1. **Keep Responses Concise**: Skip boilerplate greetings, polite intros, and post-implementation congratulations. Focus on concise explanations and precise code.
2. **Targeted Code Output**: Never dump entire files when modifying existing files. Provide targeted diffs or specific replacement functions.
3. **Reference Symbols**: Refer to existing types and interfaces by name rather than re-declaring them in code blocks.

---

## 🛡️ 3. Mandatory Coding Guardrails

### 3.1 Strict Null Safety
- **Mandatory Optional Chaining**: Access nested object properties using `?.` (e.g. `user?.profile?.avatarUrl`).
- **Nullish Coalescing Fallbacks**: Always use `??` (not `||`) when assigning fallback values to prevent 0 or empty string coercion bugs (e.g. `count ?? 0`).
- **Sanitize API Responses**: Always map API responses defensively before passing data into UI components or stores.

### 3.2 The Ponytail Rule (Senior Developer Simplicity)
- Never create a new helper if one already exists in `packages/core/src/utils/`:
  - Caching with TTL: `offlineCache.getOrFetch(...)`
  - File Downloads: `downloader.downloadFile(...)` or `useDownload()`
  - Document Viewing: `documentViewer.viewDocument(...)` or `useDocumentViewer()`
  - Encryption: `crypto.encrypt(...)` / `crypto.decrypt(...)`
  - Secure Key-Value Storage: `secureStorage.setItem(...)` / `secureStorage.getItem(...)`
- Never install external packages when standard template libraries can solve the requirement.

### 3.3 MVVM & Component Separation
- **Views**: Pure layout and UI event forwarding. No business logic, no direct storage or network requests.
- **ViewModels**: Custom hooks (`use<Feature>ViewModel`). Encapsulate reactive state, form handlers, and repository calls.
- **Repositories**: Encapsulate API and cache logic. ViewModels interact only with repositories.
- **UI Kit**: Always use `@app/ui` components (`CustomButton`, `CustomInput`, `CustomCard`, `CustomHeader`, etc.) before reaching for raw React Native primitives. Custom style props must use `StyleProp<ViewStyle>` or `StyleProp<TextStyle>`.

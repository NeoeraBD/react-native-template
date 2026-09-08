# AI Coding Agent Guidelines (Claude, Gemini, Cursor, Antigravity)

Welcome AI Agent. This document defines your operational rules, workflow protocols, and coding constraints when working within this React Native codebase.

---

## 🎯 1. Spec-Driven Development (SDD) Workflow

Before writing or modifying any code, follow this protocol:

### Step 1: Read the Base Specifications
Consult the domain specs in `openspec/specs/`:
- [Architecture Spec](specs/architecture/spec.md): MVVM boundaries, ViewModel rules, Repository patterns.
- [State Management Spec](specs/state-management/spec.md): MobX-State-Tree models, RootStore, MMKV hydration.
- [Navigation Spec](specs/navigation/spec.md): React Navigation 7 hierarchies, param lists, safe ref.
- [UI Components Spec](specs/ui-components/spec.md): 31 ready-to-use `@app/ui` components with props and examples.
- [Network & Cache Spec](specs/network-and-cache/spec.md): Axios client, token refresh queue, `offlineCache` TTL.

### Step 2: Propose Changes (OpenSpec Workflow)
For non-trivial features, refactors, or architectural modifications:
1. Create a change proposal directory: `openspec/changes/<change-id>/`
2. Add `proposal.md` specifying:
   - Motivation and context
   - Proposed changes & schema updates
   - Spec delta (what changes in `openspec/specs/`)
   - Step-by-step implementation checklist
3. Alternatively, invoke the OpenSpec CLI command: `yarn opsx propose <change-name>` or use the `/opsx:propose` skill.

### Step 3: Implement Targeted Diffs
- Implement code strictly following the approved change proposal.
- Preserve existing comments, docstrings, and non-target code.
- Avoid modifying code outside the scope of the change.

### Step 4: Validate
Always run validation checks before declaring a task complete:
```bash
# In template/ or project root
yarn tsc -p tsconfig.json --noEmit
yarn lint
```

### Step 5: Archive Change
Sync modified specs back to `openspec/specs/` and archive the proposal:
```bash
yarn opsx archive <change-id>
# Or use /opsx:archive skill
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

# Gemini & Antigravity Coding Guidelines - Neoera React Native Architecture

Welcome Gemini / Antigravity Agent. This document outlines the architectural standards, workflow processes, and tool integrations for working within this codebase.

---

## 🏗️ 1. Architectural Model (MVVM + Repository)

This project strictly enforces clean separation of concerns across layers:

- **View (`src/screens/<feature>/<Feature>Screen.tsx`)**:
  - Pure React component (wrapped in `observer` from `mobx-react-lite` if reading stores).
  - Contains layout JSX, theme styling, and forwards user interactions to the ViewModel.
  - **Strictly forbidden**: Direct `axios`, `fetch`, `MMKV`, or non-trivial business logic.
- **ViewModel (`src/screens/<feature>/use<Feature>ViewModel.ts`)**:
  - Custom React hook managing local UI states, form bindings (`react-hook-form`), and loading indicators.
  - Interacts exclusively with Repositories to fetch or mutate data.
  - **Strictly forbidden**: Direct `apiClient` or raw `MMKV` calls.
- **Repository (`packages/core/src/repositories/<Entity>Repository.ts`)**:
  - Single source of truth for domain data.
  - Manages offline caching via `offlineCache.getOrFetch()` and remote API calls via `apiRequest()`.
  - Sanitizes external JSON into strictly typed models.

---

## 📖 2. Spec-Driven Development with OpenSpec

Always review and follow specifications under `openspec/`:
- `openspec/project.md`: Tech stack, directory layout, core constraints.
- `openspec/AGENTS.md`: Detailed rules for AI coding assistants.
- `openspec/specs/`:
  - `specs/architecture/spec.md`: MVVM boundaries and repository conventions.
  - `specs/state-management/spec.md`: MobX-State-Tree models & MMKV persistence.
  - `specs/navigation/spec.md`: React Navigation 7 layout and typing.
  - `specs/ui-components/spec.md`: 31 Material Design 3 components in `@app/ui`.
  - `specs/network-and-cache/spec.md`: Network client and caching layer.

### OpenSpec Workflow
When adding non-trivial features or modifying existing architecture:
1. Create a proposal in `openspec/changes/<feature-name>/proposal.md` using `openspec/changes/template.md`.
2. Implement code adhering strictly to the spec.
3. Validate compilation: `yarn tsc -p tsconfig.json --noEmit && yarn lint`.
4. Archive change and update specs in `openspec/specs/`.

---

## 🧩 3. Available Skills & Agent Blueprints

Located in `.agents/skills/`:
- `openspec`: Proposal, application, verification, and archive lifecycle.
- `react-native-architect`: Generates MVVM screens, ViewModels, MST stores, and repositories.
- `ui-component-builder`: Composes mobile UIs and forms using `@app/ui` components.

Specialized agent configurations located in `.gemini/agents/`:
- `rn-architect`: Specialist in MVVM, MST, MMKV, and repository layers.
- `ui-designer`: Specialist in React Native Paper MD3 and `@app/ui` components.
- `qa-auditor`: Specialist in TypeScript strict mode and null-safety verification.

---

## 🛡️ 4. Mandatory Coding Guardrails

1. **The Ponytail Rule**: Pull the simplest, most direct lever. Before creating any helper or utility, inspect and reuse existing utilities in `packages/core/src/utils/` (`offlineCache`, `downloader`, `documentViewer`, `crypto`, `secureStorage`, `i18n`).
2. **Strict Null Safety**: Always use optional chaining (`?.`) and nullish coalescing (`??`). Never use loose `||` for default fallback values.
3. **Component StyleProp Safety**: Style overrides passed into components must use `StyleProp<ViewStyle>` or `StyleProp<TextStyle>`.
4. **Token Efficiency**: Return targeted code diffs or concise replacement functions. Avoid conversational filler or reprinting entire unmodified files.

---

## 🚀 5. Verification Commands

```bash
# Type checking
yarn tsc -p tsconfig.json --noEmit

# Linting
yarn lint

# OpenSpec CLI
yarn opsx status
```

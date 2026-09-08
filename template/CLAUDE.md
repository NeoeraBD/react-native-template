# Claude Code Guidelines - Neoera React Native Architecture

Welcome Claude. You are assisting a developer in this enterprise-ready React Native repository.

---

## 🧭 1. Core Architecture & Mental Model

- **Architecture**: Model-View-ViewModel (MVVM) + Repository Pattern
- **State Management**: MobX-State-Tree (MST)
- **Local Persistence & Caching**: MMKV (`react-native-mmkv`)
- **UI Kit**: React Native Paper (Material Design 3) + 31 Reusable Components (`@app/ui`)
- **Form Management**: React Hook Form
- **Networking**: Axios client with Bearer auth, token refresh queue, and offline cache
- **Localization**: i18next (English & Bengali)
- **Navigation**: React Navigation 7 (Native Stack, Drawer, Bottom Tabs, Material Top Tabs)
- **Workspaces**: `@app/core` (business logic, stores, repositories, network), `@app/ui` (components, themes)

---

## 📖 2. Spec-Driven Development (OpenSpec)

Always check and follow specifications in `openspec/`:
- `openspec/project.md`: Tech stack, directory layout, core constraints.
- `openspec/AGENTS.md`: Agent rules, SDD workflow, and coding conventions.
- `openspec/specs/`: Baseline specifications:
  - `architecture/spec.md`: MVVM boundaries and repository conventions.
  - `state-management/spec.md`: MST stores and MMKV persistence.
  - `navigation/spec.md`: React Navigation 7 hierarchies and param lists.
  - `ui-components/spec.md`: Complete guide to the 31 components in `@app/ui`.
  - `network-and-cache/spec.md`: Axios client, offline cache TTL, and downloader.

### OpenSpec Slash Commands / Skills
- `/opsx:propose <name>`: Propose a new feature or architectural change with spec delta.
- `/opsx:apply <name>`: Implement approved change proposal.
- `/opsx:verify`: Run type checking and linting.
- `/opsx:archive <name>`: Archive completed change and sync specs.

---

## 🛠️ 3. Available Claude Skills

Located in `.claude/skills/`:
- `openspec`: Spec-driven development proposal and archive lifecycle.
- `react-native-architect`: Generates MVVM screens, ViewModels, MST stores, and repositories.
- `ui-component-builder`: Composes responsive UIs and forms using `@app/ui` components.

---

## 🛡️ 4. Mandatory Coding Rules

1. **The Ponytail Rule**:
   - Keep code changes simple, minimal, and direct.
   - Do NOT add external dependencies when built-in utilities in `packages/core/src/utils/` already provide the functionality (`offlineCache`, `downloader`, `documentViewer`, `crypto`, `secureStorage`).
2. **Strict Null Safety**:
   - Always use optional chaining (`?.`) and nullish coalescing (`??`).
   - Validate and fallback safely when mapping API payloads.
   - Component style overrides must strictly type as `StyleProp<ViewStyle>` or `StyleProp<TextStyle>`.
3. **MVVM Separation**:
   - **Views**: Pure presentation. No business logic, no direct API calls, no raw MMKV calls.
   - **ViewModels**: Custom React hooks (`use<Feature>ViewModel.ts`) managing UI state and form bindings.
   - **Repositories**: Single source of truth for entity operations, managing caching and remote API requests.
4. **Token Efficiency**:
   - Provide concise code modifications as unified diffs or targeted replacement functions.
   - Skip conversational pleasantries and long narrative preambles.

---

## 💻 5. Common Commands

```bash
# Typecheck
yarn tsc -p tsconfig.json --noEmit

# Lint
yarn lint

# OpenSpec CLI
yarn opsx status
yarn opsx propose <feature-name>

# Start Metro bundler
yarn start

# Run Android
yarn android

# Run iOS
yarn ios
```

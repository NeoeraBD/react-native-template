# React Native Enterprise Architecture (MVVM + MST + MMKV + Paper)

This application was bootstrapped with the **Neoera React Native Enterprise Template**, featuring a scalable MVVM architecture, MobX-State-Tree (MST) state management, high-performance MMKV storage, localization with i18next, React Hook Form, 31+ reusable React Native Paper UI components, and built-in **Spec-Driven Development (OpenSpec)** with AI Pair-Programming support for **Claude**, **Gemini**, and **Cursor**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
yarn install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure your API endpoints:
```bash
cp .env.example .env
```

### 3. Native Dependencies Setup
For iOS:
```bash
cd ios && pod install && cd ..
```

For Asset Linking (Fonts & Icons):
```bash
npx react-native-asset
```

### 4. Run the Application
```bash
# Start Metro bundler
yarn start

# Run on Android
yarn android

# Run on iOS
yarn ios
```

---

## 🤖 AI Pair-Programming & Spec-Driven Development (OpenSpec)

This template is configured out of the box for Generative AI coding assistants (**Claude Code**, **Google Gemini / Antigravity**, and **Cursor / Windsurf**).

### 📖 OpenSpec SDD Workflow
Specifications live under `openspec/`:
- `openspec/project.md`: Tech stack, project structure, and global principles.
- `openspec/AGENTS.md`: Agent coding rules and protocols.
- `openspec/specs/`: Baseline specifications:
  - `specs/architecture/spec.md`: MVVM and Repository layer patterns.
  - `specs/state-management/spec.md`: MobX-State-Tree models & MMKV persistence.
  - `specs/navigation/spec.md`: React Navigation 7 setup and typing.
  - `specs/ui-components/spec.md`: 31 MD3 component API specifications.
  - `specs/network-and-cache/spec.md`: Axios client, offline cache TTL, and downloader.
- `openspec/changes/`: Active change proposals (`yarn opsx propose <name>`).

### 🧩 Available AI Skills & Subagents
- **`openspec`**: Propose, apply, verify, and archive feature specs via OpenSpec.
- **`auto-task` / `openspec-task-cycle`**: Multi-agent concurrent or sequential task execution from `openspec/context/tasks.md` with atomic claiming, user permission gate, and auto-pass execution.
- **`react-native-architect`**: Blueprint generator for MVVM screens, ViewModels, MST stores, and repositories.
- **`ui-component-builder`**: Layout and form builder using the 31 components in `@app/ui`.

### Assistant Configurations
- **Claude Code**: Configured via `CLAUDE.md`, `.claude/settings.json`, `.claude/skills/`, and `.claude/agents/`.
- **Gemini / Antigravity**: Configured via `GEMINI.md`, `.gemini/agents/`, and `.agents/skills/`.
- **Cursor / Windsurf**: Configured via `.cursorrules` and `.cursor/rules/*.mdc`.

---

## 📂 Project Architecture

```
├── App.tsx                   # Main entry point (Providers & Navigation container)
├── index.js                  # React Native Component Registry
├── package.json              # Monorepo configuration with Yarn Workspaces
├── tsconfig.json             # TypeScript path aliases mapped to local packages
├── babel.config.js           # Babel plugins (worklets, dotenv)
├── metro.config.js           # Metro bundler configuration with symlinks
├── CLAUDE.md                 # Claude Code project guidelines
├── GEMINI.md                 # Gemini & Antigravity guidelines
├── .cursorrules              # Cursor AI rules
├── openspec/                 # OpenSpec Spec-Driven Development directory
│   ├── project.md            # System context & tech stack
│   ├── AGENTS.md             # Agent guidelines
│   ├── specs/                # Base domain specifications
│   └── changes/              # Active feature proposals
├── src/                      # App Views and Navigation Layer
│   ├── navigation/           # Navigation setup (Stack, Drawer, Tabs, TopTabs)
│   └── screens/              # Screens & ViewModel Hooks
│       ├── login/            # Login view & useLoginViewModel
│       ├── home/             # Home view & useHomeViewModel
│       ├── dashboard/        # Interactive showcase of custom UI components
│       ├── profile/          # User profile view
│       └── settings/         # Theme & Language switchers
└── packages/                 # Modular Local Packages (Yarn Workspaces)
    ├── core/                 # @app/core
    │   ├── src/store/        # MobX-State-Tree models & MMKV persistence
    │   ├── src/network/      # Axios API client & error handling
    │   ├── src/repositories/ # Repositories abstraction layer
    │   └── src/utils/        # i18n, crypto, downloader, offlineCache
    └── ui/                   # @app/ui
        ├── src/components/   # 31+ custom reusable MD3 UI components
        ├── src/theme/        # Light / Dark theme configurations
        └── src/assets/       # Custom fonts (Inter)
```

---

## 🏛️ MVVM & Repository Flow

```
[View (React Screen)]
       │
       ▼
[ViewModel (Custom Hook)]
       │
       ▼
[Repository Layer] ──── Serves from cache or fetches from API
       │
   ┌───┴────────┐
   ▼            ▼
[API Client]  [Offline Cache (MMKV)]
```

- **Views:** Pure React functional components. No business logic or state mutations.
- **ViewModels:** Custom hooks managing form validation, UI state, and repository queries.
- **Repositories:** Single source of truth. Handles caching (`offlineCache`) and API fetches (`apiRequest`).
- **Stores:** MobX-State-Tree models with automatic MMKV persistence.

---

## 📜 Available Scripts

- `yarn start` - Start the Metro bundler
- `yarn android` - Build and launch the app on Android emulator/device
- `yarn ios` - Build and launch the app on iOS simulator
- `yarn typecheck` - Run TypeScript strict type verification
- `yarn lint` - Run ESLint across the project
- `yarn test` - Run unit tests with Jest
- `yarn opsx` - Run OpenSpec Spec-Driven Development CLI commands

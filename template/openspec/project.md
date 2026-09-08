# Project Context: Neoera React Native Architecture

## Overview
Enterprise-grade React Native application template designed for scalability, performance, offline resilience, and seamless AI agent pair programming. Built on React Native 0.85+ with New Architecture readiness, modular Yarn workspaces, and full Material Design 3 integration.

## Tech Stack
- **Framework**: React Native 0.85+ (New Architecture / TurboModules ready)
- **Runtime & UI**: React 19 / React Native
- **Language**: TypeScript 5.8+ (Strict mode & strict null safety)
- **Architecture**: Model-View-ViewModel (MVVM) + Repository Pattern
- **State Management**: MobX-State-Tree (MST)
- **Local Persistence & Caching**: MMKV (`react-native-mmkv`)
- **UI Kit**: React Native Paper 5.15 (Material Design 3) + 31 Reusable Components (`@app/ui`)
- **Form Management**: React Hook Form
- **Networking**: Axios client with Bearer auth, token refresh queue, and offline cache
- **Offline Caching**: MMKV-backed cache with configurable TTL and stale-while-revalidate
- **Localization**: i18next + react-i18next (English `en`, Bengali `bn` out of the box)
- **Navigation**: React Navigation 7 (Native Stack, Drawer, Bottom Tabs, Material Top Tabs)
- **File & Media**: Background downloader (`react-native-blob-util`), document viewer, document picker
- **Monorepo Structure**: Yarn Workspaces (`packages/core`, `packages/ui`, root `src/`)

## Workspace Organization
- `packages/core/src/`:
  - `store/`: MobX-State-Tree models (`AuthStore`, `ThemeStore`, `LanguageStore`, `ToastStore`, `RootStore`)
  - `repositories/`: Data access abstraction (`AuthRepository`, `PostRepository`)
  - `network/`: Axios instance (`apiClient`), generic caller (`apiRequest`), endpoint constants
  - `hooks/`: Reusable hooks (`useDownload`, `useDocumentViewer`)
  - `utils/`: Offline caching (`offlineCache`), crypto, downloader, secure storage, i18n
  - `assets/locales/`: Localization JSON files (`en.json`, `bn.json`)
- `packages/ui/src/`:
  - `components/`: 31 Material Design 3 components (Buttons, Inputs, Cards, Sheets, Togglers, Lists, Layout)
  - `theme/`: Light & dark themes, color tokens, elevation, spacing, typography
  - `assets/fonts/`: Inter font family (Regular, Medium, SemiBold, Bold)
- `src/`:
  - `navigation/`: `AppNavigator`, `AuthStackNavigator`, `DrawerNavigator`, `TabNavigator`, `TopTabNavigator`
  - `screens/`: Feature modules (`dashboard/`, `home/`, `login/`, `profile/`, `settings/`)
- `openspec/`:
  - `project.md`: System context, stack, directory layout, and core constraints
  - `AGENTS.md`: Agent rules, SDD workflow, and coding conventions
  - `specs/`: Baseline specifications (`architecture`, `state-management`, `navigation`, `ui-components`, `network-and-cache`)
  - `changes/`: Active change proposals, spec deltas, and task checklists

## Core Principles
1. **The Ponytail Rule (Minimalist Senior Developer Principle)**:
   - Always choose the simplest, most direct solution.
   - Do not create new helpers or dependencies when `packages/core/src/utils/` already provides them (e.g. `offlineCache`, `downloader`, `crypto`, `secureStorage`).
   - Zero tolerance for unnecessary boilerplate.
2. **Strict Null Safety & TypeScript Guardrails**:
   - Always use optional chaining (`?.`) and nullish coalescing (`??`).
   - Never trust backend API responses implicitly—always sanitize and fallback gracefully.
   - Component custom style overrides must strictly type as `StyleProp<ViewStyle>` or `StyleProp<TextStyle>`.
3. **MVVM + Repository Pattern**:
   - **Views**: Pure React functional components. UI layout and bindings only. No direct MMKV or API calls.
   - **ViewModels**: Custom React hooks (`use<Feature>ViewModel.ts`). Holds UI state, form bindings, and coordinates repository calls.
   - **Repositories**: Single source of truth for entity operations. Handles cache checks (`offlineCache`) and remote API queries (`apiRequest`).

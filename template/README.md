# React Native App (MVVM + MST + MMKV + Paper)

This application was bootstrapped with the **Neoera React Native Enterprise Template**, featuring a scalable MVVM architecture, MobX-State-Tree (MST) state management, high-performance MMKV storage, localization with i18next, React Hook Form, and 31+ reusable React Native Paper UI components.

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

## 📂 Project Architecture

```
├── App.tsx                   # Main entry point (Providers & Navigation container)
├── index.js                  # React Native Component Registry
├── package.json              # Monorepo configuration with Yarn Workspaces
├── tsconfig.json             # TypeScript path aliases mapped to local packages
├── babel.config.js           # Babel plugins (worklets, dotenv)
├── metro.config.js           # Metro bundler configuration with symlinks
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
- `yarn lint` - Run ESLint across the project
- `yarn test` - Run unit tests with Jest

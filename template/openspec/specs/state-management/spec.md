# Specification: State Management (MobX-State-Tree & MMKV)

## 1. Overview
The application uses **MobX-State-Tree (MST)** for predictable, strongly-typed reactive state management, paired with **MMKV** for ultra-fast local persistence and hydration.

## 2. Store Directory Structure (`packages/core/src/store/`)
- `index.tsx`: Defines `RootStore`, React Context provider (`RootStoreProvider`), and hook (`useRootStore`).
- `AuthStore.ts`: Authentication state, tokens, user profile, and session management.
- `ThemeStore.ts`: Dark/Light theme mode, system theme detection, and custom theme overrides.
- `LanguageStore.ts`: Language code (`en`, `bn`), RTL/LTR direction, and i18n synchronization.
- `ToastStore.ts`: Global toast notifications (`type`, `message`, `visible`, `show`, `hide`).

## 3. Store Architecture Patterns

### 3.1 Defining an MST Store
```typescript
import { types, Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree';

export const UserStore = types
  .model('UserStore', {
    id: types.optional(types.string, ''),
    name: types.optional(types.string, ''),
    email: types.optional(types.string, ''),
    isVerified: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get displayName() {
      return self.name || self.email || 'Guest';
    },
    get isAuthenticated() {
      return self.id.length > 0;
    },
  }))
  .actions((self) => ({
    setUser(user: { id: string; name: string; email: string; isVerified?: boolean }) {
      self.id = user.id;
      self.name = user.name;
      self.email = user.email;
      self.isVerified = user.isVerified ?? false;
    },
    clearUser() {
      self.id = '';
      self.name = '';
      self.email = '';
      self.isVerified = false;
    },
  }));

export interface IUserStore extends Instance<typeof UserStore> {}
export interface UserStoreSnapshotIn extends SnapshotIn<typeof UserStore> {}
export interface UserStoreSnapshotOut extends SnapshotOut<typeof UserStore> {}
```

### 3.2 Composing into RootStore
Stores must be attached to `RootStore` in `packages/core/src/store/index.tsx`:
```typescript
export const RootStore = types.model('RootStore', {
  authStore: types.optional(AuthStore, {}),
  themeStore: types.optional(ThemeStore, {}),
  languageStore: types.optional(LanguageStore, {}),
  toastStore: types.optional(ToastStore, {}),
  // userStore: types.optional(UserStore, {}),
});
```

### 3.3 MMKV Persistence Pattern
Persistent state is saved via `onSnapshot` and rehydrated on startup:
```typescript
import { onSnapshot, applySnapshot } from 'mobx-state-tree';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const STORAGE_KEY = 'ROOT_STORE_SNAPSHOT';

export const setupRootStore = (rootStore: IRootStore) => {
  // 1. Hydrate saved state
  const savedState = storage.getString(STORAGE_KEY);
  if (savedState) {
    try {
      applySnapshot(rootStore, JSON.parse(savedState));
    } catch (e) {
      console.warn('Failed to rehydrate store snapshot:', e);
    }
  }

  // 2. Persist state changes
  onSnapshot(rootStore, (snapshot) => {
    // Only persist persistent stores (exclude transient stores like toastStore)
    const { toastStore, ...persistentState } = snapshot;
    storage.set(STORAGE_KEY, JSON.stringify(persistentState));
  });
};
```

### 3.4 React Component Integration
To ensure components reactively re-render when MST properties change:
1. Wrap the component with MobX's `observer` HOC from `mobx-react-lite`.
2. Access the store via `useRootStore()`.

```typescript
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@app/core';
import { CustomHeader } from '@app/ui';

export const ProfileHeader: React.FC = observer(() => {
  const { authStore } = useRootStore();

  return (
    <CustomHeader
      title={`Welcome, ${authStore.user?.name ?? 'User'}`}
      subtitle={authStore.user?.email}
    />
  );
});
```

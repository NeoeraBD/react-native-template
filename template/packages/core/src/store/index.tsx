import React, { createContext, useContext } from 'react';
import { types, onSnapshot } from 'mobx-state-tree';
import { AuthStore } from './AuthStore';
import { ThemeStore } from './ThemeStore';
import { LanguageStore } from './LanguageStore';
import { ToastStore } from './ToastStore';
import { storage } from '../utils/secureStorage';
import i18next from '../utils/i18n';

const ROOT_STORAGE_KEY = 'root_store_state';

export const RootStore = types.model('RootStore', {
  authStore: types.optional(AuthStore, {}),
  themeStore: types.optional(ThemeStore, {}),
  languageStore: types.optional(LanguageStore, {}),
  toastStore: types.optional(ToastStore, {}),
});

// Load saved snapshot state from MMKV
let initialStoreState = {};
try {
  const savedState = storage.getString(ROOT_STORAGE_KEY);
  if (savedState) {
    initialStoreState = JSON.parse(savedState);
  }
} catch (e) {
  console.warn('[RootStore] Failed to load snapshot from MMKV:', e);
}

// Instantiate RootStore
export const rootStore = RootStore.create(initialStoreState);

// Sync loaded language with i18next on start
if (rootStore.languageStore.language) {
  i18next.changeLanguage(rootStore.languageStore.language);
}

// Sync updates to MMKV automatically
onSnapshot(rootStore, (snapshot) => {
  try {
    const { toastStore, ...persistentSnapshot } = snapshot;
    storage.set(ROOT_STORAGE_KEY, JSON.stringify(persistentSnapshot));
  } catch (e) {
    console.warn('[RootStore] Failed to save snapshot to MMKV:', e);
  }
});

const StoreContext = createContext(rootStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
};

export const useStores = () => useContext(StoreContext);

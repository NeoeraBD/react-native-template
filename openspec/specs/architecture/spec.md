# Specification: MVVM Architecture & Repository Pattern

## 1. Overview
This specification defines the architectural boundaries and responsibilities for all code within the application. The architecture follows a strict Model-View-ViewModel (MVVM) pattern combined with a Repository layer.

```
┌────────────────────────────────────────────────────────┐
│                        VIEW                            │
│  - React Functional Component                          │
│  - Observes ViewModel state / MobX store               │
│  - Forwards user events to ViewModel                   │
│  - Strictly NO business logic or API / MMKV calls      │
└───────────────────────────┬────────────────────────────┘
                            │ uses
                            ▼
┌────────────────────────────────────────────────────────┐
│                      VIEWMODEL                         │
│  - Custom React Hook (e.g. useLoginViewModel)          │
│  - Manages UI state, form bindings, loading states     │
│  - Coordinates calls to Repositories                   │
│  - Strictly NO direct Axios or direct MMKV calls       │
└───────────────────────────┬────────────────────────────┘
                            │ calls
                            ▼
┌────────────────────────────────────────────────────────┐
│                     REPOSITORY                         │
│  - Single source of truth for domain entity            │
│  - Coordinates offline cache (offlineCache) and API    │
│  - Formats / sanitizes remote payloads into models     │
└───────────────────────────┬────────────────────────────┘
                            │ coordinates
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│        NETWORK LAYER      │ │       CACHE LAYER        │
│  - apiClient (Axios)      │ │  - offlineCache (MMKV)   │
│  - apiRequest<T>()        │ │  - secureStorage         │
│  - Token refresh queue    │ │  - TTL management        │
└───────────────────────────┘ └──────────────────────────┘
```

## 2. Layer Definitions

### 2.1 View (Presentation Layer)
- Located in `src/screens/<feature>/<Feature>Screen.tsx`.
- Must be a pure React component (wrapped in `observer` if reading MobX state directly).
- Destructures state, data, and action handlers directly from its ViewModel hook.
- Contains only UI JSX layout, `@app/ui` components, styling, and navigation transitions.
- **Forbidden**: Direct `fetch()`, `axios`, `apiClient`, `MMKV`, or heavy business logic algorithms.

### 2.2 ViewModel Layer
- Located in `src/screens/<feature>/use<Feature>ViewModel.ts`.
- Implemented as a custom hook returning an object with reactive state and action callbacks.
- Integrates `react-hook-form` for form management.
- Handles UI alerts, toast notifications via `useToastStore()` or `RootStore`.
- Calls Repository methods to fetch or mutate data.
- **Forbidden**: Direct imports of `apiClient` or raw `MMKV` instance.

### 2.3 Repository Layer
- Located in `packages/core/src/repositories/<Entity>Repository.ts`.
- Implemented as a plain object or singleton class.
- Exposes async methods returning clean typed promises (e.g. `Promise<Post[]>`).
- Utilizes `offlineCache.getOrFetch()` for offline-first data fetching.
- Maps raw backend JSON into typed models with null safety defaults.

### 2.4 Monorepo Package Boundaries
- `@app/core` (`packages/core/`):
  - Domain models, MST stores, repositories, network clients, utilities, and translations.
  - Must NOT import from `@app/ui` or `src/`.
- `@app/ui` (`packages/ui/`):
  - Design system, themes, 31 MD3 components, fonts, typography.
  - Independent of business logic; does NOT import from `src/`.
- App Root (`src/`):
  - Screen views, ViewModels, navigation routers, and root application entry points.
  - Consumes both `@app/core` and `@app/ui`.

## 3. Example Implementation

### Repository (`packages/core/src/repositories/PostRepository.ts`)
```typescript
import { apiRequest } from '../network/apiRequest';
import { ENDPOINTS } from '../network/endpoints';
import { offlineCache } from '../utils/offlineCache';

export interface Post {
  id: string;
  title: string;
  body: string;
}

export const PostRepository = {
  getPosts: async (): Promise<Post[]> => {
    return offlineCache.getOrFetch<Post[]>(
      'posts_cache_key',
      async () => {
        const res = await apiRequest<Post[]>({ url: ENDPOINTS.POSTS });
        return (res?.data ?? []).map((item: any) => ({
          id: String(item?.id ?? ''),
          title: String(item?.title ?? 'Untitled'),
          body: String(item?.body ?? ''),
        }));
      },
      15 // Cache TTL: 15 minutes
    );
  },
};
```

### ViewModel (`src/screens/home/useHomeViewModel.ts`)
```typescript
import { useState, useEffect, useCallback } from 'react';
import { PostRepository, Post } from '@app/core';

export const useHomeViewModel = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await PostRepository.getPosts();
      setPosts(data ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const data = await PostRepository.getPosts();
      setPosts(data ?? []);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    isLoading,
    isRefreshing,
    handleRefresh,
  };
};
```

### View (`src/screens/home/HomeScreen.tsx`)
```typescript
import React from 'react';
import { CustomFlatList, CustomCard } from '@app/ui';
import { useHomeViewModel } from './useHomeViewModel';

export const HomeScreen: React.FC = () => {
  const { posts, isLoading, isRefreshing, handleRefresh } = useHomeViewModel();

  return (
    <CustomFlatList
      data={posts}
      keyExtractor={(item) => item.id}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      renderItem={({ item }) => (
        <CustomCard title={item.title} subtitle={item.body} />
      )}
    />
  );
};
```

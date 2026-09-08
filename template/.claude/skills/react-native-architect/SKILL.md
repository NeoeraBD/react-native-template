---
name: react-native-architect
description: Expert React Native architectural generator for MVVM screens, ViewModels, MobX-State-Tree (MST) stores, Repositories, and React Navigation 7.
---

# React Native Architect Skill

This skill provides specialized patterns and step-by-step blueprints for architecting features in this repository following the MVVM + Repository pattern and MobX-State-Tree.

## Architectural Boundaries

```
[View: src/screens/<feature>/<Feature>Screen.tsx]
       │ calls
       ▼
[ViewModel: src/screens/<feature>/use<Feature>ViewModel.ts]
       │ calls
       ▼
[Repository: packages/core/src/repositories/<Entity>Repository.ts]
       │ calls
       ├──> [Network: packages/core/src/network/apiRequest.ts]
       └──> [Cache: packages/core/src/utils/offlineCache.ts]
```

## Step-by-Step Blueprint for Creating a New Feature

### 1. Create the Repository Layer (`packages/core/src/repositories/<Entity>Repository.ts`)
- Use `offlineCache.getOrFetch` to provide offline-first caching.
- Enforce strict null safety (`?.`, `??`) when mapping response payloads.
- Re-export from `packages/core/src/index.ts`.

```typescript
import { apiRequest } from '../network/apiRequest';
import { ENDPOINTS } from '../network/endpoints';
import { offlineCache } from '../utils/offlineCache';

export interface Product {
  id: string;
  name: string;
  price: number;
}

export const ProductRepository = {
  getProducts: async (): Promise<Product[]> => {
    return offlineCache.getOrFetch<Product[]>(
      'products_cache_key',
      async () => {
        const response = await apiRequest<Product[]>({ url: '/products' });
        return (response?.data ?? []).map((item: any) => ({
          id: String(item?.id ?? ''),
          name: String(item?.name ?? 'Unknown'),
          price: Number(item?.price ?? 0),
        }));
      },
      10 // TTL: 10 minutes
    );
  },
};
```

### 2. (Optional) Create MST Store (`packages/core/src/store/<Entity>Store.ts`)
If the feature requires persistent or cross-screen shared state:
- Define `types.model` with views and actions.
- Register in `RootStore` in `packages/core/src/store/index.tsx`.

### 3. Create the ViewModel (`src/screens/<feature>/use<Feature>ViewModel.ts`)
- Custom React hook managing local UI state, loading flags, error handling, and form state.
- Strictly NO direct Axios or MMKV calls.

```typescript
import { useState, useEffect, useCallback } from 'react';
import { ProductRepository, Product, useRootStore } from '@app/core';

export const useProductViewModel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toastStore } = useRootStore();

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ProductRepository.getProducts();
      setProducts(data ?? []);
    } catch (error: any) {
      toastStore.showToast({
        type: 'error',
        message: error?.message ?? 'Failed to load products',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toastStore]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    refresh: fetchProducts,
  };
};
```

### 4. Create the View (`src/screens/<feature>/<Feature>Screen.tsx`)
- Pure functional React component utilizing `@app/ui` components (`CustomFlatList`, `CustomCard`, `CustomHeader`, `Col`).
- Wrapped in `observer` if reading MobX observable store directly.
- Uses `StyleProp<ViewStyle>` / `StyleProp<TextStyle>` for styling.

### 5. Wire Navigation (`src/navigation/`)
- Add screen to the appropriate navigator:
  - Unauthenticated: `AuthStackNavigator.tsx`
  - Authenticated Tab: `TabNavigator.tsx`
  - Drawer menu: `DrawerNavigator.tsx`
  - Top Tabs: `TopTabNavigator.tsx`
- Ensure route params are properly typed in param lists.

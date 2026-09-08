# Specification: Network & Cache Layer

## 1. Overview
The network and cache layer in `@app/core` provides resilient, offline-first data operations with automatic JWT authentication, token refresh queuing, and fast MMKV-based TTL caching.

## 2. Network Client (`packages/core/src/network/`)

### 2.1 `apiClient.ts`
- Axios instance configured with `API_URL` from `.env`.
- **Request Interceptor**: Automatically attaches `Authorization: Bearer <token>` when `authStore.token` exists.
- **Response Interceptor**:
  - Handles successful responses and formats standardized API payloads.
  - On `401 Unauthorized`: Triggers automatic token refresh using a promise queue (`isRefreshing`, `failedQueue`) to prevent duplicate refresh requests when multiple concurrent calls fail.
  - If token refresh fails: Clears user session via `authStore.clearAuth()` and redirects to login.

### 2.2 `apiRequest.ts`
Generic type-safe helper function for performing HTTP calls:
```typescript
import { AxiosRequestConfig } from 'axios';
import apiClient from './apiClient';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export async function apiRequest<T = any>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const response = await apiClient(config);
  return {
    data: response?.data,
    status: response?.status,
    message: response?.data?.message,
  };
}
```

### 2.3 `endpoints.ts`
Central repository for API routes to avoid hardcoded URL strings:
```typescript
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    PROFILE: '/auth/me',
  },
  POSTS: '/posts',
} as const;
```

## 3. Offline Cache System (`packages/core/src/utils/offlineCache.ts`)

The `offlineCache` utility provides cache-aside and stale-while-revalidate capabilities backed by `MMKV`:
- **Methods**:
  - `getOrFetch<T>(key: string, fetcher: () => Promise<T>, ttlMinutes?: number): Promise<T>`
    1. Checks if unexpired cache data exists in MMKV.
    2. If valid, returns cached data immediately.
    3. If expired or missing, calls `fetcher()`, updates cache with expiration timestamp, and returns data.
    4. If network fails and stale cache exists, returns stale cache to preserve offline usability.
  - `set(key: string, data: any, ttlMinutes?: number): void`
  - `get<T>(key: string): T | null`
  - `remove(key: string): void`
  - `clearAll(): void`

## 4. File Downloader & Document Viewer (`packages/core/src/utils/`)

- `downloader.ts`: Background download manager utilizing `react-native-blob-util`.
  - Supports tracking download progress (`received / total`).
  - Saves files to the device document or download directory.
- `documentViewer.ts`: Launches native file preview via `@react-native-documents/viewer` (PDFs, images, docs).
- `crypto.ts`: AES symmetric encryption and decryption helpers for sensitive payloads.

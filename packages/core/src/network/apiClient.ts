import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '@env';
import { rootStore } from '../store';
import { encryptData, decryptData } from '../utils/crypto';

// Module augmentation to support custom configuration properties on Axios requests
declare module 'axios' {
  export interface AxiosRequestConfig {
    encrypt?: boolean;
    decrypt?: boolean;
  }
}

const API_TIMEOUT = 10000;

// Global encryption configuration toggles (developer can toggle these on/off)
export const IS_API_ENCRYPTION_ENABLED = false; // Set to true to encrypt all requests by default
export const IS_API_DECRYPTION_ENABLED = false; // Set to true to decrypt all responses by default

export const apiClient = axios.create({
  baseURL: API_URL || 'https://jsonplaceholder.typicode.com',
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Inject auth token from MobX store
    const token = rootStore.authStore.authToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Encrypt request body if globally enabled or explicitly requested on this call
    const shouldEncrypt = config.encrypt ?? IS_API_ENCRYPTION_ENABLED;
    if (shouldEncrypt && config.data) {
      if (__DEV__) {
        console.log(`[API Request - Encrypting] Original data:`, config.data);
      }
      const encryptedPayload = encryptData(config.data);
      config.data = {
        payload: encryptedPayload,
      };
      if (config.headers) {
        config.headers['X-Encrypted'] = 'true';
      }
    }

    if (__DEV__) {
      console.log(`[API Request] [${config.method?.toUpperCase()}] ${config.url}`, config.data || '');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const shouldDecrypt = response.config.decrypt ?? IS_API_DECRYPTION_ENABLED;
    const isEncryptedHeader = response.headers?.['x-encrypted'] === 'true' || response.headers?.['X-Encrypted'] === 'true';

    // Decrypt if requested, globally enabled, or indicated by the server response header
    if ((shouldDecrypt || isEncryptedHeader) && response.data && response.data.payload) {
      if (__DEV__) {
        console.log(`[API Response - Decrypting] Ciphertext:`, response.data.payload);
      }
      const decryptedData = decryptData(response.data.payload);
      response.data = decryptedData;
    }

    if (__DEV__) {
      console.log(`[API Response] [${response.status}] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.warn(`[API Error]`, error.response?.status, error.message, error.response?.data || '');
    }

    let errorMessage = 'Something went wrong';
    if (error.response) {
      const data = error.response.data as any;
      errorMessage = data?.message || `Error: ${error.response.status}`;
      
      // Auto logout on 401 Unauthorized
      if (error.response.status === 401) {
        rootStore.authStore.logout();
      }
    } else if (error.request) {
      errorMessage = 'Network error: No response from server. Please check your internet connection.';
    } else {
      errorMessage = error.message;
    }

    const customError = new Error(errorMessage);
    (customError as any).status = error.response?.status;
    (customError as any).originalError = error;

    return Promise.reject(customError);
  }
);

export default apiClient;

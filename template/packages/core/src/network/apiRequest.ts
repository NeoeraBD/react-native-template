import { AxiosRequestConfig, Method } from 'axios';
import { apiClient } from './apiClient';

export interface ApiRequestOptions<TData = any> {
  url: string;
  method?: Method;
  data?: TData;
  params?: any;
  baseUrl?: string;
  headers?: any;
  encrypt?: boolean;
  decrypt?: boolean;
}

export async function apiRequest<TResponse = any, TData = any>({
  url,
  method = 'GET',
  data,
  params,
  baseUrl,
  headers,
  encrypt,
  decrypt,
}: ApiRequestOptions<TData>): Promise<TResponse> {
  const config: AxiosRequestConfig = {
    url,
    method,
    data,
    params,
    headers,
    encrypt,
    decrypt,
  };

  if (baseUrl) {
    config.baseURL = baseUrl;
  }

  const response = await apiClient.request<TResponse>(config);
  return response?.data;
}

export default apiRequest;

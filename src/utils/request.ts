import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { cookies } from '@/utils';

export const REQUEST_TIMEOUT = 30000;

export const axiosClient = axios.create({
  // host api được cấu hình trong vite.config.ts -> thay đổi theo env
  baseURL: '/api/v1',
  timeout: REQUEST_TIMEOUT,
});

const InterceptorsRequest = async (config: AxiosRequestConfig) => {
  // lấy token từ cookie và gắn vào header trước khi gửi request
  const token = cookies.get('token');
  const username = cookies.get('username');

  if (token === undefined || username === undefined) {
    return config;
  }

  const interceptorHeaders = {
    username: username,
    token: `Bearer ${token}`,
  };

  const headers = {
    ...config.headers,
    ...interceptorHeaders,
  };

  config.headers = headers;
  return config;
};

const InterceptorsError = (error: AxiosError) => {
  // thông báo lỗi khi không gửi hay nhận được request
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error('Lỗi: ', error);
  }
  return Promise.reject(error);
};

const InterceptorResponse = (response: AxiosResponse) => {
  if (response && response.data) {
    return response.data;
  }
  return response;
};

axiosClient.interceptors.request.use(InterceptorsRequest as any, InterceptorsError);
axiosClient.interceptors.response.use(InterceptorResponse, InterceptorsError);

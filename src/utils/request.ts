import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';
import { jwtDecode } from 'jwt-decode';
import { PATHS } from '@/config';
import { notifications } from '@mantine/notifications';

export const REQUEST_TIMEOUT = 30000;

export const axiosClient = axios.create({
  // host api được cấu hình trong vite.config.ts -> thay đổi theo env
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: REQUEST_TIMEOUT,
});

const InterceptorsRequest = async (config: AxiosRequestConfig) => {
  // lấy token từ cookie và gắn vào header trước khi gửi request
  const token = cookies.get(COOKIE_KEY.TOKEN)?.toString();

  if (token === undefined) {
    return config;
  }

  const interceptorHeaders = {
    token: `Bearer ${token}`,
    authorization: `Bearer ${token}`,
    device: 'desktop',
    platform: 'web',
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

  if (
    error.response &&
    error.response.data &&
    (error.response.data as { message?: string }).message === 'Token has expired'
  ) {
    // console.log('error', error.response?.data?.message); // eslint-disable-line
    cookies.remove(COOKIE_KEY.TOKEN);
    // cookies.remove(COOKIE_KEY.CURRENT_CLINIC_ID);
    cookies.remove(COOKIE_KEY.DEVICE_TOKEN);
    cookies.remove(COOKIE_KEY.USER_INFO);

    notifications.show({
      id: 'token-expired',
      title: 'Phiên đăng nhập hết hạn',
      message: 'Vui lòng đăng nhập lại',
      color: 'red.5',
      autoClose: 5000,
    });
    window.location.href = PATHS.LOGIN;
  }

  return Promise.reject(error);
};

const InterceptorResponse = (response: AxiosResponse) => {
  // if (response.data.message === 'Token has expired') {
  //   cookies.remove(COOKIE_KEY.TOKEN);
  //   cookies.remove(COOKIE_KEY.USER_INFO);
  //   window.location.href = PATHS.LOGIN;
  // }

  if (response && response.data) {
    return response.data;
  }
  return response;
};

axiosClient.interceptors.request.use(InterceptorsRequest as any, InterceptorsError);
axiosClient.interceptors.response.use(InterceptorResponse, InterceptorsError);

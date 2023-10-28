import {
  IApiResponse,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
} from '@/types';
import { axiosClient } from '@/utils';

export const authApi = {
  login(data: ILoginRequest): Promise<IApiResponse<ILoginResponse>> {
    return axiosClient.post('/auth/login', data);
  },

  register(data: IRegisterRequest): Promise<IApiResponse<IRegisterResponse>> {
    return axiosClient.post('/auth/register', data);
  },

  loginByGoogle(): Promise<any> {
    return axiosClient.get('/auth');
  },
};

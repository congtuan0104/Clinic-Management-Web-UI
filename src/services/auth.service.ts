import {
  IApiResponse,
  IGoogleLoginRequest,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
  ILinkAccountRequest,
} from '@/types';
import { axiosClient } from '@/utils';

export const authApi = {
  login(data: ILoginRequest): Promise<IApiResponse<ILoginResponse>> {
    return axiosClient.post('/auth/login', data);
  },

  register(data: IRegisterRequest): Promise<IApiResponse<IRegisterResponse>> {
    return axiosClient.post('/auth/register', data);
  },

  linkAccount(data: ILinkAccountRequest): Promise<any> {
    return axiosClient.post('/auth/link-account', data);
  },

  loginGoogle(data: IGoogleLoginRequest): Promise<IApiResponse<ILoginResponse>> {
    return axiosClient.post('/auth/account', data);
  },

  confirmEmail(email: string): Promise<IApiResponse<any>> {
    return axiosClient.post('/auth/confirm', { email, role: 'user' });
  },
  geLinkAccount(userId: string): Promise<any> {
    return axiosClient.get(`/auth/${userId}/accounts`);
  },

  disConnectLinkAccount(userId: string, accountId: string): Promise<any> {
    return axiosClient.delete(`/auth/${userId}/accounts/${accountId}`);
  }
};

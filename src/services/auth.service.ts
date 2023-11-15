import { IApiResponse, ILoginRequest, ILoginResponse, IRegisterRequest, ILinkAccountRequest } from '@/types';
import { axiosClient } from '@/utils';

export const authApi = {
  login(data: ILoginRequest): Promise<IApiResponse<ILoginResponse>> {
    return axiosClient.post('/auth/login', data);
  },

  register(data: IRegisterRequest): Promise<any> {
    return axiosClient.post('/auth/register', data);
  },

  linkAccount(data: ILinkAccountRequest): Promise<any> {
    return axiosClient.post('/auth/link-account', data);
  },

  geLinkAccount(userId: string): Promise<any> {
    return axiosClient.get(`/auth/${userId}/accounts`);
  },

  disConnectLinkAccount(userId: string, accountId: string): Promise<any> {
    return axiosClient.delete(`/auth/${userId}/accounts/${accountId}`);
  }
};

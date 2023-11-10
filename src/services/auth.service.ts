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
  }
};

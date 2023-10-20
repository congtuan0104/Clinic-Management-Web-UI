import { IApiResponse, ILoginRequest, ILoginResponse } from '@/types';
import { axiosClient } from '@/utils';

export const authApi = {
  login(data: ILoginRequest): Promise<IApiResponse<ILoginResponse>> {
    return axiosClient.post('/auth/login', data);
  },

  // register(id: number): Promise<any> {
  //   return axiosClient.get(`/products/${id}`);
  // },
};

import { IApiResponse, ISupplies, ISuppliesQueryParams } from '@/types';
import { axiosClient } from '@/utils';

export const suppliesApi = {
  getSupplies: (params: ISuppliesQueryParams): Promise<IApiResponse<ISupplies[]>> => {
    return axiosClient.get(`/medical-supplies`, {
      params,
    });
  },

  getSupplyDetail: (id: number): Promise<IApiResponse<ISupplies>> => {
    return axiosClient.get(`/medical-supplies/${id}`);
  },
};

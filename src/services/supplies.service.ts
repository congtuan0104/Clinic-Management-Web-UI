import {
  IApiResponse,
  ICreateSuppliesPayload,
  IMedicalSupplies,
  ISuppliesQueryParams,
  IUpdateSuppliesPayload,
} from '@/types';
import { axiosClient } from '@/utils';

export const suppliesApi = {
  getSupplies: (params: ISuppliesQueryParams): Promise<IApiResponse<IMedicalSupplies[]>> => {
    return axiosClient.get(`/medical-supplies`, {
      params,
    });
  },

  getSupplyDetail: (suppliesId: number): Promise<IApiResponse<IMedicalSupplies>> => {
    return axiosClient.get(`/medical-supplies/${suppliesId}`);
  },

  createSupplies: (payload: ICreateSuppliesPayload): Promise<IApiResponse<IMedicalSupplies>> => {
    return axiosClient.post(`/medical-supplies`, payload);
  },

  updateSupplies: (
    suppliesId: number,
    payload: IUpdateSuppliesPayload,
  ): Promise<IApiResponse<IMedicalSupplies>> => {
    return axiosClient.put(`/medical-supplies/${suppliesId}`, payload);
  },

  deleteSupplies: (suppliesId: number): Promise<IApiResponse<any>> => {
    return axiosClient.delete(`/medical-supplies/${suppliesId}`);
  },
};

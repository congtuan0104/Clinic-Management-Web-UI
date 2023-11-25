import { IServicePlan } from '@/types';
import { IApiResponse } from './../types/common.types';
import { axiosClient } from '@/utils';

export const planApi = {
  /**
   * @returns Danh sách các gói dịch vụ
   */
  getAllPlans(): Promise<IApiResponse<IServicePlan[]>> {
    return axiosClient.get('/plans/all-plans');
  },

  getPlanById(planId: number) {
    return axiosClient.get(`/plans/get-plan/${planId}`);
  },
};

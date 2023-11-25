import { IAddPlanRequest, IPlanOption, IServicePlan } from '@/types';
import { IApiResponse } from './../types/common.types';
import { axiosClient } from '@/utils';

export const planApi = {
  /**
   * @returns Danh sách các gói dịch vụ
   */
  getAllPlans(): Promise<IApiResponse<IServicePlan[]>> {
    return axiosClient.get('/plans/all-plans');
  },

  /**
   * @returns Lấy thông tin chi tiết gói dịch vụ và các chức năng
   */
  getPlanById(planId: number): Promise<IApiResponse<IServicePlan>> {
    return axiosClient.get(`/plans/get-plan/${planId}`);
  },

  /**
   * @returns Danh sách các chức năng
   */
  getAllOptionFeatures(): Promise<IApiResponse<IPlanOption[]>> {
    return axiosClient.get('/plans/all-active-options');
  },

  /**
   * @returns Tạo mới gói dịch vụ
   */
  createNewPlan(data: IAddPlanRequest): Promise<IApiResponse<IServicePlan>> {
    return axiosClient.post('/plans', data);
  },

  /**
   * @returns Cập nhật gói dịch vụ
   */
  updatePlan(planId: number, data: IAddPlanRequest): Promise<IApiResponse<IServicePlan>> {
    return axiosClient.put(`/plans/${planId}`, data);
  },
};

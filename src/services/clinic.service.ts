import { IAddClinicRequest, IServicePlan } from '@/types';
import { IApiResponse } from './../types/common.types';
import { axiosClient } from '@/utils';

export const clinicApi = {  
  /**
   * @returns Tạo mới phòng khám kèm gói dịch vụ
   */
  createClinic(data: IAddClinicRequest): Promise<IApiResponse<IServicePlan>> {
    return axiosClient.post(`/clinics`, data);
  },
};

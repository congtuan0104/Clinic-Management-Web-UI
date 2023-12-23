import { IAddClinicRequest, IClinicWithSubscription } from '@/types';
import { IApiResponse } from './../types/common.types';
import { axiosClient } from '@/utils';

export const clinicApi = {
  /**
   * @returns Tạo mới phòng khám kèm gói dịch vụ
   */
  createClinic(data: IAddClinicRequest): Promise<IApiResponse<IClinicWithSubscription>> {
    return axiosClient.post(`/clinics`, data);
  },
};

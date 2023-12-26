import {
  IApiResponse,
  IAddClinicRequest,
  IClinic,
  IClinicWithSubscription,
  IUserInfo,
} from '@/types';
import { axiosClient } from '@/utils';

export const clinicApi = {
  /**
   * @returns Lấy danh sách phòng khám (không truyền ownerId)
   * @returns Lấy danh sách phòng khám theo chủ sở hữu (nếu truyền ownerId)
   */
  getClinicsByOwner(ownerId?: string): Promise<IApiResponse<IClinic[]>> {
    return axiosClient.get(`/clinics`, { params: { id: ownerId } });
  },

  /**
   * @returns Tạo mới phòng khám kèm gói dịch vụ
   */
  createClinic(data: IAddClinicRequest): Promise<IApiResponse<IClinicWithSubscription>> {
    return axiosClient.post(`/clinics`, data);
  },

  /**
   * @returns Lấy danh sách thành viên trong phòng khám
   */
  getClinicMembers(clinicId: string): Promise<IApiResponse<IUserInfo[]>> {
    return axiosClient.get(`/clinics/${clinicId}/users`);
  },
};

import { IApiResponse, IClinicStaffDetail, ICreateStaffPayload, IUpdateStaffInfoRequest } from '@/types';
import { IClinicStaff, IStaffQueryParams } from '@/types';
import { axiosClient } from '@/utils';

export const staffApi = {
  getStaffs(params: IStaffQueryParams): Promise<IApiResponse<IClinicStaff[]>> {
    return axiosClient.get('/staffs', { params: params });
  },

  getStaff(staffId: string): Promise<IApiResponse<IClinicStaff>> {
    return axiosClient.get(`/staffs/${staffId}`);
  },

  updateStaffInfo(staffId: string, data: IUpdateStaffInfoRequest): Promise<any> {
    return axiosClient.put(`/staffs/${staffId}`, data);
  },

  createStaff(data: ICreateStaffPayload): Promise<any> {
    return axiosClient.post('/staffs', data);
  },

  deleteStaff(staffId: string): Promise<any> {
    return axiosClient.delete(`/staffs/${staffId}`);
  },
};

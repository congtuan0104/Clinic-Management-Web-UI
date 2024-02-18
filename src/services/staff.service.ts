import { IApiResponse, IClinicStaffDetail, ICreateStaffPayload, ISchedule, IUpdateStaffInfoRequest } from '@/types';
import { IClinicStaff, IStaffQueryParams } from '@/types';
import { axiosClient } from '@/utils';

export const staffApi = {
  getStaffs(params: IStaffQueryParams): Promise<IApiResponse<IClinicStaff[]>> {
    return axiosClient.get('/staffs', { params: params });
  },

  getStaff(staffId: string): Promise<IApiResponse<IClinicStaff>> {
    return axiosClient.get(`/staffs/${staffId}`);
  },

  getSchedule(staffId: string): Promise<IApiResponse<ISchedule[]>> {
    return axiosClient.get(`/staffs/${staffId}/schedule`);
  },

  updateSchedule(staffId: string, data: ISchedule[]): Promise<IApiResponse<ISchedule[]>> {
    return axiosClient.put(`/staffs/${staffId}/schedule`, {schedules: data});
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

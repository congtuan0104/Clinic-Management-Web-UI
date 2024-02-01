import { IApiResponse, IClinicStaffDetail } from '@/types';
import { IClinicStaff, IStaffQueryParams } from '@/types';
import { axiosClient } from '@/utils';

export const staffApi = {
  getClinicStaffs(params: IStaffQueryParams): Promise<IApiResponse<IClinicStaff[]>> {
    return axiosClient.get(`/staffs`, { params: params });
  },

  getClinicStaff(staffId: string): Promise<IApiResponse<IClinicStaffDetail>> {
    return axiosClient.get(`/staffs/${staffId}`);
  },
};

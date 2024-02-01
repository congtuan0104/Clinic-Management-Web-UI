import { IApiResponse } from '@/types';
import { IClinicStaff, IStaffQueryParams } from '@/types';
import { axiosClient } from '@/utils';

export const staffApi = {
  getStaffs(params: IStaffQueryParams): Promise<IApiResponse<IClinicStaff[]>> {
    return axiosClient.get('/staffs', { params: params });
  },
};

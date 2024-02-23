import {
  IApiResponse,
  IAddClinicRequest,
  IClinic,
  IClinicWithSubscription,
  IUserGroupRole,
  IRolePermission,
  IAddUserGroupRoleRequest,
  IUpdateClinic,
  IUpdateRequest,
  IClinicMember,
  IClinicStaffDetail,
  IClinicQueryParams,
  IClinicStaff,
} from '@/types';
import { axiosClient } from '@/utils';

export const clinicApi = {
  /**
   * @returns Lấy danh sách phòng khám (không truyền ownerId)
   * @returns Lấy danh sách phòng khám theo chủ sở hữu (nếu truyền ownerId)
   */
  getClinics(params: IClinicQueryParams): Promise<IApiResponse<IClinic[]>> {
    return axiosClient.get(`/clinics`, { params: params });
  },

  getClinicDetail(clinicId: string): Promise<IApiResponse<IClinic>> {
    return axiosClient.get(`/clinics/${clinicId}`);
  },

  /**
   * @returns Tạo mới phòng khám kèm gói dịch vụ
   */
  createClinic(data: IAddClinicRequest): Promise<IApiResponse<IClinicWithSubscription>> {
    return axiosClient.post(`/clinics`, data);
  },


  getClinicRoles(clinicId: string): Promise<IApiResponse<IUserGroupRole[]>> {
    return axiosClient.get(`/clinics/${clinicId}/user-group-role`);
  },

  getListPermissions(): Promise<IApiResponse<IRolePermission[]>> {
    return axiosClient.get('/clinics/permissions');
  },

  createClinicRole(data: IAddUserGroupRoleRequest, clinicId: string): Promise<any> {
    return axiosClient.post(`/clinics/${clinicId}/create-user-group-role`, data);
  },

  deleteUserGroupRole(Id?: string, userGroupRoleId?: number): Promise<any> {
    return axiosClient.delete(`/clinics/${Id}/delete-user-group-role/${userGroupRoleId}`);
  },

  updateUserGroupRole(
    data: IAddUserGroupRoleRequest,
    Id?: string,
    userGroupRoleId?: number,
  ): Promise<any> {
    return axiosClient.put(`/clinics/${Id}/update-user-group-role/${userGroupRoleId}`, data);
  },

  /**
   * @returns Cập nhật thông tin phòng khám
   */
  updateClinicInfo(
    clinicId: string,
    updateInfo: IUpdateRequest,
  ): Promise<IApiResponse<IUpdateClinic>> {
    return axiosClient.put(`/clinics/${clinicId}`, updateInfo);
  },
};

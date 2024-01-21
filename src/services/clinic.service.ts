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
  getClinicMembers(clinicId: string): Promise<IApiResponse<IClinicMember[]>> {
    return axiosClient.get(`/clinics/${clinicId}/users`);
  },

  getClinicMember(memberId: string): Promise<IApiResponse<IClinicStaffDetail>>{
    return axiosClient.get(`/staffs/${memberId}`);
  },

  getListUserGroupRole(Id?: string): Promise<IApiResponse<IUserGroupRole[]>> {
    return axiosClient.get(`/clinics/${Id}/user-group-role`);
  },

  getListPermissions(): Promise<IApiResponse<IRolePermission[]>> {
    return axiosClient.get('/clinics/permissions');
  },

  addUserGroupRole(data: IAddUserGroupRoleRequest, Id?: string): Promise<any> {
    return axiosClient.post(`/clinics/${Id}/create-user-group-role`, data);
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

  getAllClinicService(clinicId: string): Promise<IApiResponse<any>> {
    return axiosClient.get(`/clinics/${clinicId}/services`);
  },
};

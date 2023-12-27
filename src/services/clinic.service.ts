import {
  IApiResponse,
  IAddClinicRequest,
  IClinic,
  IClinicWithSubscription,
  IUserInfo,
  IUserGroupRole,
  IRolePermission,
  IAddUserGroupRoleRequest,
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

  getListUserGroupRole(Id?: string): Promise<IApiResponse<IUserGroupRole[]>> {
    return axiosClient.get(`/clinics/${Id}/user-group-role`, { params: { id: Id } });
  },

  getListPermissions():Promise<IApiResponse<IRolePermission[]>>{
    return axiosClient.get('/clinics/permissions');
  },

  addUserGroupRole(data: IAddUserGroupRoleRequest, Id?: string): Promise<any>{
    return axiosClient.post(`/clinics/${Id}/create-user-group-role`, data);
  },

  deleteUserGroupRole(Id?: string, userGroupRoleId?: number ): Promise<any>{
    return axiosClient.delete(`/clinics/${Id}/delete-user-group-role/${userGroupRoleId}`);
  },

};

import { IApiResponse, IAddClinicRequest, IClinic, IClinicWithSubscription } from '@/types';
import { axiosClient } from '@/utils';

export const notificationApi = {
  /**
   * @description Lưu device token (token nhận thông báo) của user lên server
   */
  registerDeviceToken(userId: string, token: string): Promise<IApiResponse<any>> {
    return axiosClient.post('/notification/create-user-token', {
      userId,
      token,
    });
  },

  /**
   * @description Xóa device token (token nhận thông báo) của user trên server
   */
  deleteDeviceToken(userId: string, token: string): Promise<IApiResponse<any>> {
    return axiosClient.delete('/notification/delete-user-token', {
      data: {
        userId,
        token,
      },
    });
  },
};

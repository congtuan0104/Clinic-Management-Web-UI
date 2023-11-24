import {
  IApiResponse,
  IGoogleLoginRequest,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
  ILinkAccountRequest,
  IChangePasswordRequest,
} from '@/types';
import { axiosClient } from '@/utils';

export const authApi = {
  /**
   * API đăng nhập bằng email và mật khẩu
   */
  login(data: ILoginRequest): Promise<IApiResponse<ILoginResponse>> {
    return axiosClient.post('/auth/login', data);
  },

  /**
   * API đăng ký tài khoản
   */
  register(data: IRegisterRequest): Promise<IApiResponse<IRegisterResponse>> {
    return axiosClient.post('/auth/register', data);
  },

  /**
   * API xác thực tài khoản từ email
   */
  confirmEmail(email: string): Promise<IApiResponse<any>> {
    return axiosClient.post('/auth/confirm', { email, role: 'user' });
  },

  /**
   * API lấy danh sách tất cả tài khoản bên thứ 3 của một user
   */
  getAccountByUser(userId: string): Promise<any> {
    return axiosClient.get(`/auth/${userId}/accounts`);
  },

  /**
   * API lấy thông tin user dựa trên accountId (uid của tài khoản bên thứ 3)
   */
  getUserByAccountId(accountId: string, provider: string): Promise<any> {
    return axiosClient.get(`/auth/account?key=${accountId}&provider=${provider}`);
  },

  /**
   * API hủy liên kết tài khoản bên thứ 3
   */
  unlinkAccount(userId: string, accountId: string): Promise<any> {
    return axiosClient.delete(`/auth/${userId}/accounts/${accountId}`);
  },

  /**
   * API gửi email xác thực tài khoản
   */
  sendEmailVerifyUser(data: { email: string; key: string; provider: string }): Promise<any> {
    return axiosClient.get('/auth/user/send-email-verify-user', { params: data });
  },

  /**
   * API liên kết tài khoản bên thứ 3 với tài khoản mặc định (email)
   */
  linkAccountWithEmail(data: { email: string; key: string; provider: string }): Promise<any> {
    return axiosClient.post('/auth/link-account-email', data);
  },

  /**
   * API đổi mật khẩu
   */
  changePassword(data: IChangePasswordRequest): Promise<any> {
    return axiosClient.post('/auth/change-password', data);
  },
};

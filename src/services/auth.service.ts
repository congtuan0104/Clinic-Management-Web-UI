import { IUserInfo } from '@/types';
import {
  IApiResponse,
  IGoogleLoginRequest,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
  ILinkAccountRequest,
  IChangePasswordRequest,
  IForgotPasswordRequest,
  IInviteClinicMemberRequest,
  IChangeProfileRequest,
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
   * API lấy danh sách tất cả tài khoản bên thứ 3 của một user
   */
  getAccountByUser(userId: string): Promise<any> {
    return axiosClient.get(`/auth/${userId}/accounts`);
  },

  /**
   * API lấy thông tin user dựa trên accountId (uid của tài khoản bên thứ 3)
   */
  getUserByAccountId(accountId: string, provider: string): Promise<IApiResponse<ILoginResponse>> {
    return axiosClient.get(`/auth/account?key=${accountId}&provider=${provider}`);
  },

  /**
   * API liên kết tài khoản bên thứ 3
   */
  linkAccount(data: ILinkAccountRequest): Promise<any> {
    return axiosClient.post('/auth/link-account', data);
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
    return axiosClient.post(`/auth/${data.userId}/change-password`, data);
  },

  /**
   * API gửi mail yêu cầu reset password
   */
  forgotPassword(email: string): Promise<any> {
    return axiosClient.post('/auth/reset-password', { email });
  },

  initPassword(email: string, password: string): Promise<IApiResponse<IUserInfo>> {
    return axiosClient.put('/auth/add-new-password', { email, password });
  },

  inviteClinicMember(data: IInviteClinicMemberRequest): Promise<any> {
    return axiosClient.post('/auth/invite', data);
  },

  acceptInviteAccount(token: string): Promise<any> {
    return axiosClient.get(`/auth/verify-account?token=${token}`);
  },

  sendVerifyEmail(email: string): Promise<IApiResponse<IUserInfo | undefined | null>> {
    return axiosClient.post('/auth/resend-verify-email', { params: { email } });
  },

  findUserByEmail(email: string, emailVerified?: string): Promise<IApiResponse<IUserInfo>> {
    return axiosClient.get('/auth/find-user-by-email', { params: { email, emailVerified } });
  },

  changeProfile(userId: string, data: IChangeProfileRequest): Promise<any> {
    return axiosClient.put(`/auth/user/${userId}`, data);
  },
};

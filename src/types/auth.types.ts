import { AuthModule } from '@/enums';

export interface IUserInfo {
  id: string;
  email: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  moduleId: AuthModule;
  isInputPassword: boolean;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  moduleId: AuthModule;
  emailVerified: boolean;
}

export interface ILinkAccountRequest {
  key: string | null;
  userId: string | null | undefined;
  firstName: string | null;
  lastName: string | null;
  picture: string | null;
  provider: string | null;
}

export interface IGoogleLoginRequest {
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
}

export interface IChangePasswordRequest {
  userId?: string;
  currentPassword?: string;
  newPassword: string;
  isReset?: boolean;
}

export interface ILoginResponse {
  user: IUserInfo;
  token: string;
}

export interface IRegisterResponse {
  user: IUserInfo;
  token: string;
}

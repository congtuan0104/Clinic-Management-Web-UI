export interface IUserInfo {
  id: string;
  email: string;
  password: string;
  emailVerified: boolean;
  role: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUserInfo;
  token: string;
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
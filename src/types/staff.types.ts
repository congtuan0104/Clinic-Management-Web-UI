import { Gender } from '@/enums';
import { IUserGroupRole, IUserInfo } from '.';


export interface IStaffQueryParams{
  userId?: string;
  roleId?: string;
  clinicId?: string;
  gender?: number;
  phoneNumber?: string;
  email?: string;
  name?: string;
}

export interface IClinicStaff{
  id: number;
  experience?: number;
  description?: string;
  specialize?: string;
  users: IClinicStaffDetail;
  role: IUserGroupRole;
}

export interface IClinicStaffDetail {
  id?: number;
  memberId?: number;
  specialize?: string;
  experience?: number;
  phoneNumber?: string;
  address?: string;
  gender?: number;
  createdAt?: string;
  updatedAt?: string;
  isDisabled?: boolean;
  avatar?: string;
  disabledAt?: string;
  userId?: string;
  clinicId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

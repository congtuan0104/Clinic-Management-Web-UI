import { Gender } from '@/enums';
import { IUserInfo } from '.';

export interface IPatient {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  address?: string;
  gender?: Gender;
  birthday?: Date;
  avatar?: string;
  emailVerified: boolean;
  clinicId: string;
  userId: string;
  bloodGroup?: string;
  anamnesis?: string;
  idCard?: string;
  healthInsuranceCode?: string;
}

export interface IPatientQueryParams {
  userId?: string;
  clinicId?: string;
  gender?: number;
  phone?: string;
  email?: string;
  name?: string;
}

export interface ICreatePatientPayload extends IUpdatePatientPayload {
  userInfo?: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    gender?: Gender;
    birthday?: Date;
  };
  userId?: string;
  clinicId: string;
}

export interface IUpdatePatientPayload {
  bloodGroup?: string;
  anamnesis?: string;
  idCard?: string;
  healthInsuranceCode?: string;
}

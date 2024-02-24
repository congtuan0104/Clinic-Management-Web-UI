import { APPOINTMENT_STATUS, Gender } from '@/enums';
import { IClinicService } from '@/types';

export interface IAppointment {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  status: APPOINTMENT_STATUS;
  clinicId: string;
  clinics: {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
  };
  doctorId: number;
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address?: string;
    phone?: string;
    avatar?: string;
    gender?: Gender;
  };
  patientId: number;
  patient: {
    id: number; // staffId
    userId: string;
    firstName: string;
    lastName: string;
    bloodGroup: string;
    anamnesis: string;
    healthInsuranceCode: string;
    email: string;
    address?: string;
    phone?: string;
    avatar?: string;
    gender?: Gender;
    birthday?: Date;
  };
  serviceId: number;
  clinicServices: IClinicService;
  description?: string;
}

export interface IAppointmentQueryParams {
  clinicId?: string;
  doctorId?: number;
  patientId?: number;
  date?: string;
  status?: string;
  puid?: string;
}

export interface INewAppointmentPayload {
  clinicId: string;
  doctorId: number;
  serviceId: number;
  patientId?: number;
  userId?: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  status: APPOINTMENT_STATUS;
}

export interface IUpdateAppointmentPayload extends INewAppointmentPayload {}

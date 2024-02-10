import { APPOINTMENT_STATUS, Gender } from '@/enums';

export interface IAppointment {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  status: APPOINTMENT_STATUS;
  clinicId: string;
  clinic: {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
  };
  doctorId: string;
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
  patientId: string;
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
  };
  description?: string;
}

export interface IAppointmentQueryParams {
  clinicId?: string;
  doctorId?: number;
  patientId?: number;
  date?: string;
  status?: string;
}

export interface INewAppointmentPayload {
  clinicId: string;
  doctorId: number;
  patientId: number;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
}

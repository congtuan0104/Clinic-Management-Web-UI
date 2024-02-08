import { APPOINTMENT_STATUS } from '@/enums';

export interface IAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  startTime: Date;
  endTime: Date;
  note: string;
  status: APPOINTMENT_STATUS;
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

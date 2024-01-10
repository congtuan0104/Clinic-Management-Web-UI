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

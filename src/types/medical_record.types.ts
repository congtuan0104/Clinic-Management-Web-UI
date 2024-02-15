import { IClinic, IClinicStaff, IPatient } from '.';

export interface IMedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  clinicId: string;
  dateCreated: Date;
  height?: number;
  weight?: number;
  bloodPressure?: string;
  temperature?: number;
  diagnosis?: string;
  result?: string;
  examinationStatus: number;
  paymentStatus: number;
  note?: string;
  doctor: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
  };
  patient: IPatient;
  clinic: IClinic;
  prescription: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface INewMedicalRecordPayload {
  patientId: number;
  clinicId: string;
  doctorId: number;
  note: string;
  services: INewRecordService[];
}

export interface INewRecordService {
  clinicServiceId?: number;
  clinicId?: string;
  doctorId?: number;
  serviceName?: string;
  amount?: number;
}

export interface IMedicalRecordQueryParams {
  clinicId?: string;
  doctorId?: number;
  patientId?: number;
  examinationStatus?: number;
  paymentStatus?: number;
}

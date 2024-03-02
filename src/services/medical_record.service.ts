import { MEDICO_PAYMENT_STATUS } from '@/enums';
import {
  IApiResponse,
  IDeclareUsingSuppliesPayload,
  IMedicalInvoice,
  IMedicalRecord,
  IMedicalRecordQueryParams,
  INewMedicalRecordPayload,
  INewPrescription,
  IUpdateMedicalRecordPayload,
} from '@/types';
import { axiosClient } from '@/utils';

export const medicalRecordApi = {
  getMedicalRecords: (
    params: IMedicalRecordQueryParams,
  ): Promise<IApiResponse<IMedicalRecord[]>> => {
    return axiosClient.get('/medical-records', {
      params,
    });
  },

  getMedicalRecordDetail: (id: number): Promise<IApiResponse<IMedicalRecord>> => {
    return axiosClient.get(`/medical-records/${id}`);
  },

  createMedicalRecord: (data: INewMedicalRecordPayload): Promise<IApiResponse<any>> => {
    return axiosClient.post('/medical-records-2', data);
  },

  updateMedicalRecord: (
    id: number,
    data: IUpdateMedicalRecordPayload,
  ): Promise<IApiResponse<any>> => {
    return axiosClient.put(`/medical-records/${id}`, data);
  },

  deleteMedicalRecord: (id: number): Promise<IApiResponse<any>> => {
    return axiosClient.delete(`/medical-records/${id}`);
  },

  updatePrescription: (id: number, payload: INewPrescription[]): Promise<IApiResponse<any>> => {
    return axiosClient.put(`/medical-records/${id}/prescription`, { prescriptions: payload });
  },

  exportInvoice: (id: number): Promise<IApiResponse<IMedicalInvoice>> => {
    return axiosClient.post(`/medical-records/${id}/export-invoice`);
  },

  confirmPayment: (
    invoiceId: number,
    status: MEDICO_PAYMENT_STATUS,
    cashierId?: number,
  ): Promise<IApiResponse<any>> => {
    return axiosClient.put(`/medical-records/export-invoice/${invoiceId}`, { status, cashierId });
  },

  declareUsingSupplies: (medicalRecordId: string, data: IDeclareUsingSuppliesPayload): Promise<IApiResponse<any>> => {
    return axiosClient.post(`/medical-records/${medicalRecordId}/using-supplies`, data);
  },
};

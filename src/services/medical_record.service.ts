import {
  IApiResponse,
  IMedicalRecord,
  IMedicalRecordQueryParams,
  INewMedicalRecordPayload,
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

  createMedicalRecord: (data: INewMedicalRecordPayload): Promise<any> => {
    return axiosClient.post('/medical-records-2', data);
  },

  // updateMedicalRecord: (id: number, data: any): Promise<any> => {
  //   return axiosClient.put(`/medical-records/${id}`, data);
  // },

  deleteMedicalRecord: (id: number): Promise<any> => {
    return axiosClient.delete(`/medical-records/${id}`);
  },
};

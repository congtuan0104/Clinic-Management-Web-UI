import {
  IApiResponse,
  IAppointment,
  IAppointmentQueryParams,
  INewAppointmentPayload,
  IUpdateAppointmentPayload,
} from '@/types';
import { axiosClient } from '@/utils';

export const appointmentApi = {
  getAppointmentList: (params: IAppointmentQueryParams): Promise<IApiResponse<IAppointment[]>> => {
    return axiosClient.get('/appointments', { params });
  },

  createAppointment: (payload: INewAppointmentPayload): Promise<IApiResponse<IAppointment>> => {
    return axiosClient.post('/appointments', payload);
  },

  updateAppointment: (
    appointmentId: number,
    payload: IUpdateAppointmentPayload,
  ): Promise<IApiResponse<any>> => {
    return axiosClient.put(`/appointments/${appointmentId}`, payload);
  },

  reception: (appointmentId: number): Promise<IApiResponse<any>> => {
    return axiosClient.post(`/medical-records`, { appointmentId });
  },
};

import {
  IApiResponse,
  IAppointment,
  IAppointmentQueryParams,
  INewAppointmentPayload,
} from '@/types';
import { axiosClient } from '@/utils';

export const appointmentApi = {
  getAppointmentList: (params: IAppointmentQueryParams): Promise<IApiResponse<IAppointment[]>> => {
    return axiosClient.get('/appointments', { params });
  },

  createAppointment: (payload: INewAppointmentPayload): Promise<IApiResponse<IAppointment>> => {
    return axiosClient.post('/appointments', payload);
  },
};

import { IApiResponse, INewAppointmentPayload } from '@/types';
import { axiosClient } from '@/utils';

export const appointmentApi = {
  createAppointment: (payload: INewAppointmentPayload): Promise<IApiResponse<any>> => {
    return axiosClient.post('/appointments', payload);
  },
};

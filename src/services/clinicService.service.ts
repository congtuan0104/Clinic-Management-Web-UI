import { IApiResponse, IClinicService, IPostClinicServiceParams } from '@/types';
import { axiosClient } from '@/utils';

export const clinicServiceApi = {
  getClinicServices(clinicId: string): Promise<IApiResponse<IClinicService[]>> {
    return axiosClient.get(`/clinics/${clinicId}.services`);
  },

  getClinicServiceDetail(serviceId: string): Promise<IApiResponse<IClinicService>> {
    return axiosClient.get(`/clinics/services/${serviceId}`);
  },

  createClinicService(
    clinicId: string,
    data: IPostClinicServiceParams,
  ): Promise<IApiResponse<IClinicService>> {
    return axiosClient.post(`/clinics/${clinicId}/services`, data);
  },

  updateClinicService(
    serviceId: string,
    data: IPostClinicServiceParams,
  ): Promise<IApiResponse<IClinicService>> {
    return axiosClient.put(`/clinics/services/${serviceId}`, data);
  },

  deleteClinicService(serviceId: string): Promise<IApiResponse<null>> {
    return axiosClient.delete(`/clinics/services/${serviceId}`);
  },
};

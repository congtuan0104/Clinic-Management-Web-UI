import {
  IAdminStatisticDate,
  IApiResponse,
  IGetAdminStatisticDateParams,
  IGetStatisticDateParams,
  IGetStatisticParams,
  IStatistic,
  IStatisticDate,
} from '@/types';
import { axiosClient } from '@/utils';

export const statisticApi = {
  getStatistic: (params: IGetStatisticParams): Promise<IApiResponse<IStatistic>> => {
    return axiosClient.get('/statitics', { params });
  },

  getStatisticByDate: (
    params: IGetStatisticDateParams,
  ): Promise<IApiResponse<IStatisticDate[]>> => {
    return axiosClient.get('/statitics/by-date', { params });
  },

  getAdminStatisticByDate: (
    params: IGetAdminStatisticDateParams,
  ): Promise<IApiResponse<IAdminStatisticDate>> => {
    return axiosClient.get('/statitics/admin', { params });
  },
};

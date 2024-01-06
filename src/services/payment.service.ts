import { PaymentProvider } from '@/enums';
import { IApiResponse } from '@/types';
import { axiosClient } from '@/utils';

export const paymentApi = {
  /**
   * @returns Danh sách các gói dịch vụ
   */
  createPaymentRequest(data: {
    totalCost: number;
    provider: PaymentProvider;
    subscribePlanId: string;
  }): Promise<IApiResponse<string>> {
    return axiosClient.post('/payment', data);
  },
};

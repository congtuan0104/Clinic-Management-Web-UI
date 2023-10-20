import { IProductListDataResponse } from '@/types';
import { axiosClient } from '@/utils';

export const productApi = {
  getProducts(): Promise<IProductListDataResponse> {
    return axiosClient.get('/products');
  },

  getProductById(id: number): Promise<any> {
    return axiosClient.get(`/products/${id}`);
  },
};

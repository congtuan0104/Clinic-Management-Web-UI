import { IListDataResponse } from '@/types';

export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// kiểu dữ liệu trả về từ api khi gọi api get list product 'https://dummyjson.com/products'
export interface IProductListDataResponse extends IListDataResponse {
  products: IProduct[];
}

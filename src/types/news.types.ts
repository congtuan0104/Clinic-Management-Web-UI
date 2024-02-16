export interface INewsQueryParams {
  clinicId?: string;
  title?: string;
  isShow?: boolean;
  pageSize?: number;
  pageIndex?: number;
}

export interface INews {
  id: number;
  title?: string;
  content?: string;
  logo?: string;
  clinicId: string;
  clinicName: string;
  isShow: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface INewsQueryParams{
    clinicId?: string;
    title?: string;
    isShow?: boolean;
    pageSize?: string;
    pageIndex?: string;
  }

export interface INews {
    id: number;
    title?: string;
    content?: string;
    logo?: string;
    clinicId: string;
    isShow: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
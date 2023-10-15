import { AxiosHeaders } from 'axios';

export interface IApiResponse<T> {
  config: any;
  header?: AxiosHeaders;
  request: XMLHttpRequest;
  data?: T;
  status: number;
  statusText?: string;
}

export interface IListDataResponse {
  total: number;
  skip: number;
  limit: number;
}

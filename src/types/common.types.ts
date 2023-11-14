export interface IApiResponse<T> {
  // config: any;
  // header?: AxiosHeaders;
  // request: XMLHttpRequest;
  data?: T;
  message?: string;
  status?: boolean;
  errors?: boolean;
  // status: number;
  // statusText?: string;
}

export interface IListDataResponse {
  total: number;
  skip: number;
  limit: number;
}

import { Event as BigCalendarEvent } from 'react-big-calendar';

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

export interface CalendarEvent<T> extends Omit<BigCalendarEvent, 'resource'> {
  resource?: T;
}

// export type CalendarEvent<T> = {
//   allDay?: boolean | undefined;
//   title?: React.ReactNode | undefined;
//   start?: Date | undefined;
//   end?: Date | undefined;
//   resource?: T;
// };

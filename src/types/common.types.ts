import { Event as BigCalendarEvent } from 'react-big-calendar';

export interface IApiResponse<T> {
  data?: T;
  message?: string;
  status?: boolean;
  errors?: boolean;
}

export interface IPagination<T> {
  total: number;
  pageSize: number;
  currentPage: number;
  data: T[];
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

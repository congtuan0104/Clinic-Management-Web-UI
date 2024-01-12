import {
  Calendar as BigCalendar,
  CalendarProps,
  DateLocalizer,
  dayjsLocalizer,
} from 'react-big-calendar';

import dayjs from 'dayjs'
import { useMemo } from 'react';
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(timezone)
dayjs.locale('vi')

const localizer = dayjsLocalizer(dayjs)

const Calendar: React.FC<Omit<CalendarProps, 'localizer'>> = (props) => {

  const { messages, formats } = useMemo(
    () => ({
      messages: {
        date: 'Ngày',
        time: 'Thời gian',
        week: 'Tuần',
        work_week: 'Ngày làm việc',
        day: 'Ngày',
        month: 'Tháng',
        previous: 'Ngày trước',
        next: 'Ngày tiếp theo',
        today: 'Hôm nay',
        agenda: 'Lịch biểu',
        showMore: (total: number) => `+Xem thêm ${total} lịch hẹn`,
        event: 'Sự kiện'
      },
      formats: {
        weekdayFormat: (date: Date, culture: any, localizer: any) =>
          localizer.format(date, 'dddd', culture),
        monthHeaderFormat: (date: Date, culture: any, localizer: any) =>
          localizer.format(date, `MM/YYYY`, culture),
        dayFormat: (date: Date, culture: any, localizer: any) =>
          localizer.format(date, 'DD', culture),
        dayRangeHeaderFormat: ({ start, end }: any, culture: any, localizer: any) =>
          `${localizer.format(start, 'DD/MM/YYYY', culture)} - ${localizer.format(end, 'DD/MM/YYYY', culture)}`,
        dayHeaderFormat: (date: Date, culture: any, localizer: any) =>
          localizer.format(date, 'dddd', culture),
      },
    }),
    []
  )

  return (
    <BigCalendar
      {...props}
      localizer={localizer}
      // defaultDate={defaultDate}
      // startAccessor="start"
      // endAccessor="end"
      messages={messages}
      formats={formats}
    />
  );
};

export default Calendar;
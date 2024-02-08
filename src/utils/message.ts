import dayjs from 'dayjs';

export const renderSendingTime = (sendingTime: Date) => {
  const diff = dayjs(dayjs()).diff(sendingTime, 'second');
  if (diff < 60) return `${diff} giây trước`;
  else if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  else if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  else return `${Math.floor(diff / 86400)} ngày trước`;
};

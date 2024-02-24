import dayjs from 'dayjs';
import { DateInputProps } from '@mantine/dates';

export const renderSendingTime = (sendingTime: Date) => {
  const diff = dayjs(dayjs()).diff(sendingTime, 'second');
  if (diff < 60) return `${diff} giây trước`;
  else if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  else if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  else return `${Math.floor(diff / 86400)} ngày trước`;
};

export const numberToWords = (number: number) => {
  const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];
  const words = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const digits = ['', 'mươi', 'trăm'];

  function readThreeDigits(num: number) {
    const hundred = Math.floor(num / 100);
    const ten = Math.floor((num % 100) / 10);
    const one = num % 10;

    let result = '';
    if (hundred > 0) {
      result += words[hundred] + ' ' + digits[2] + ' ';
    }
    if (ten > 1) {
      result += words[ten] + ' ' + digits[1] + ' ';
    } else if (ten === 1) {
      result += 'mười ';
    }
    if (one > 0) {
      if (ten !== 1 && one === 5) {
        result += 'lăm ';
      } else {
        result += words[one] + ' ';
      }
    }

    return result.trim();
  }

  const numberString = String(number);
  const chunks = [];
  for (let i = numberString.length; i > 0; i -= 3) {
    chunks.unshift(numberString.substring(Math.max(0, i - 3), i));
  }

  let result = '';
  for (let i = 0; i < chunks.length; i++) {
    const chunk = Number(chunks[i]);
    if (chunk !== 0) {
      result += readThreeDigits(chunk) + ' ' + units[chunks.length - i - 1] + ' ';
    }
  }

  return result.trim();
};

export const dateParser: DateInputProps['dateParser'] = input => {
  return dayjs(input, 'DD/MM/YYYY').toDate();
};

import { CLINIC_SUBSCRIPTION_STATUS } from '@/enums';

export const renderSubscriptionStatus = (status: CLINIC_SUBSCRIPTION_STATUS) => {
  switch (status) {
    case CLINIC_SUBSCRIPTION_STATUS.INPAYMENT:
      return 'Đang thanh toán';
    case CLINIC_SUBSCRIPTION_STATUS.EXPIRED:
      return 'Đã hết hạn';
    case CLINIC_SUBSCRIPTION_STATUS.ACTIVE:
      return 'Đang hoạt động';
    case CLINIC_SUBSCRIPTION_STATUS.NOT_ACTIVE:
      return 'Chưa kích hoạt';
    case CLINIC_SUBSCRIPTION_STATUS.PENDING:
      return 'Chờ duyệt';
    default:
      return 'Không xác định';
  }
};

import { Gender } from '@/enums';
import { IUserInfo } from '.';

export interface IStaffQueryParams {
  userId?: string;
  roleId?: number;
  clinicId?: string;
  gender?: Gender;
  phoneNumber?: string;
  email?: string;
}

export interface IClinicStaff {
  id: number;
  specialize?: string;
  experience?: number;
  users: IUserInfo;
  // userInfo: IUser; // --> thông tin user lấy từ userId
  // role?: IClinicRole; // --> thông tin vai trò lấy từ roleId
  // clinic?: IClinic; // --> thông tin phòng khám lấy từ clinicId
  // services?: IStaffService[]; // --> danh sách dịch vụ mà nhân viên có thể thực hiện lấy từ bảng staff_service
  // schedule?: IStaffSchedule[]; // --> lịch làm việc của nhân viên lấy từ bảng staff_schedule
}

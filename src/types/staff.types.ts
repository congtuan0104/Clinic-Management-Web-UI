import { Gender } from '@/enums';

interface IClinicRole {
  id: number;
  role_name: string;
  permission: {};
}
interface IClinic {}
interface IStaffService {}
interface IStaffSchedule {}
interface IUser {}

export interface IClinicStaff {
  id: number;
  specialize: string;
  experience: number;
  phone_number: string;
  address: string;
  gender: Gender;
  birthday: Date;
  description: string;
  userInfo: IUser; // --> thông tin user lấy từ userId
  role?: IClinicRole; // --> thông tin vai trò lấy từ roleId
  clinic?: IClinic; // --> thông tin phòng khám lấy từ clinicId
  services?: IStaffService[]; // --> danh sách dịch vụ mà nhân viên có thể thực hiện lấy từ bảng staff_service
  schedule?: IStaffSchedule[]; // --> lịch làm việc của nhân viên lấy từ bảng staff_schedule
}

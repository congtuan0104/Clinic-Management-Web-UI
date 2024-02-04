import { AdminLayout, DefaultLayout, ClinicLayout, NoLayout } from '@/layouts';
import {
  HomePage,
  LoginPage,
  VerifyAccountPage,
  RegisterPage,
  RegisterByInvitation,
  DashboardAdmin,
  UserProfile,
  VerifyUserLinkAccountPage,
  PricingPlanAdminPage,
  Message,
  DashboardClinic,
  VideoCall,
  PlanManagement,
  PaymentResult,
  NotFoundPage,
  RoleManagement,
  ClinicDetail,
  StaffManagementPage,
  AcceptInviteAccountPage,
  StaffDetailPage,
  AppointmentPage,
  ServicePricePage,
  ResetPasswordPage,
  ClinicsPage,
  ClinicDetailPage,
} from '@/pages';
import { NewsPage } from '@/pages/Guest/News';
import { NewsDetailPage } from '@/pages/Guest/NewsDetail';

export const PATHS = {
  HOME: '/',
  CLINICS: '/phong-kham',
  CLINIC_DETAIL: '/phong-kham/:id',
  NEWS: '/tin-tuc',
  NEWS_DETAIL: '/tin-tuc/:id',
  LOGIN: '/dang-nhap',
  REGISTER: '/dang-ky',
  PROFILE: '/tai-khoan',
  FORGET_PASSWORD: '/quen-mat-khau',
  RESET_PASSWORD: '/cai-lai-mat-khau',
  VERIFY: '/verify-account',
  VERIFY_LINK_ACCOUNT: '/verify-user', // xác nhận liên kết tài khoản
  REGISTER_BY_INVITATION: '/verify-account',
  ACCEPT_INVITE_ACCOUNT: '/invite-account',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRICING_PLAN: '/admin/bang-gia',
  CLINIC_CHAT: '/clinic/messages',
  CLINIC_DASHBOARD: '/clinic/tong-quan',
  VIDEO_CALL: '/clinic/video-call',
  PLAN_MANAGEMENT: '/clinic/quan-ly-goi',
  PAYMENT_RESULT: '/thanh-toan/thong-tin-thanh-toan',
  ROLE_MANAGEMENT: '/clinic/quan-ly-role',
  CLINIC_INFO_MANAGEMENT: '/clinic/thong-tin-phong-kham',
  CLINIC_STAFF_MANAGEMENT: '/clinic/nhan-vien',
  STAFF_DETAIL: '/clinic/nhan-vien/:id',
  STAFF_SCHEDULE: '/clinic/lich-lam-viec',
  CLINIC_APPOINTMENT: '/clinic/lich-hen-kham',
  CLINIC_SERVICE: '/clinic/bang-gia-dich-vu',
  CLINIC_NEWS: '/clinic/quan-ly-tin-tuc',
  CLINIC_PATIENT_MANAGEMENT: '/clinic/benh-nhan',
  CLINIC_RECEPTION: '/clinic/tiep-nhan-benh-nhan',
  CLINIC_EXAMINATION: '/clinic/kham-benh',
  CLINIC_SERVICE_EXECUTION: '/clinic/thuc-hien-dich-vu',
  EXAMINATION_INVOICE: '/clinic/hoa-don-kham-benh',
  CLINIC_REPORT: '/clinic/bao-cao',
  CLINIC_CATEGORY: '/clinic/danh-muc',
};

export const DEEPLINK = {
  PLAN_MANAGEMENT: 'https://clinus.page.link?link=https%3A%2F%2Fclinus.page.link%2Fpayment',
};

export const ROUTES = [
  {
    path: PATHS.HOME,
    title: 'Trang chủ',
    layout: DefaultLayout,
    element: HomePage,
    isProtected: false,
    children: [],
  },
  {
    path: PATHS.NEWS,
    title: 'Tin tức',
    layout: DefaultLayout,
    element: NewsPage,
    isProtected: false,
    children: [],
  },
  {
    path: PATHS.NEWS_DETAIL,
    title: 'Chi tiết tin tức',
    layout: DefaultLayout,
    element: NewsDetailPage,
    isProtected: false,
    children: [],
  },
  {
    path: PATHS.CLINICS,
    title: 'Phòng khám',
    layout: DefaultLayout,
    element: ClinicsPage,
    isProtected: false,
    children: [],
  },
  {
    path: PATHS.CLINIC_DETAIL,
    title: 'Chi tiết phòng khám',
    layout: DefaultLayout,
    element: ClinicDetailPage,
    isProtected: false,
    children: [],
  },
  {
    path: PATHS.VERIFY,
    title: 'Xác minh tài khoản',
    layout: NoLayout,
    element: VerifyAccountPage,
    isProtected: false,
    children: [],
  },
  {
    path: PATHS.VERIFY_LINK_ACCOUNT,
    title: 'Xác nhận liên kết tài khoản',
    layout: DefaultLayout,
    element: VerifyUserLinkAccountPage,
    isProtected: false,
    children: [],
  },
  {
    path: PATHS.ACCEPT_INVITE_ACCOUNT,
    title: 'Xác nhận lời mời',
    layout: NoLayout,
    element: AcceptInviteAccountPage,
    // isProtected: false,
    children: [],
  },
  {
    path: PATHS.LOGIN,
    title: 'Đăng nhập',
    layout: DefaultLayout,
    element: LoginPage,
    isProtected: false,
    children: [],
  },
  {
    path: PATHS.REGISTER,
    title: 'Đăng ký',
    layout: DefaultLayout,
    element: RegisterPage,
    isProtected: false,
    children: [],
  },
  {
    path: PATHS.REGISTER_BY_INVITATION,
    title: 'Đăng ký',
    layout: DefaultLayout,
    element: RegisterByInvitation,
    isProtected: false,
    children: [],
  },
  {
    path: PATHS.RESET_PASSWORD,
    title: 'Đặt lại mật khẩu',
    layout: DefaultLayout,
    element: ResetPasswordPage,
    isProtected: false,
    children: [],
  },
  {
    path: PATHS.ADMIN_DASHBOARD,
    title: 'Dashboard',
    layout: AdminLayout,
    element: DashboardAdmin,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.PROFILE,
    title: 'Thông tin cá nhân',
    layout: DefaultLayout,
    element: UserProfile,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.ADMIN_PRICING_PLAN,
    title: 'Quản lý bảng giá',
    layout: AdminLayout,
    element: PricingPlanAdminPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_CHAT,
    title: 'Nhắn tin',
    layout: ClinicLayout,
    element: Message,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_DASHBOARD,
    title: 'Dashboard',
    layout: ClinicLayout,
    element: DashboardClinic,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.VIDEO_CALL,
    title: 'Video Call',
    element: VideoCall,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.PLAN_MANAGEMENT,
    title: 'Plan management',
    layout: ClinicLayout,
    element: PlanManagement,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_INFO_MANAGEMENT,
    title: 'Thông tin phòng khám',
    layout: ClinicLayout,
    element: ClinicDetail,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.PAYMENT_RESULT,
    title: 'Kết quả thanh toán',
    layout: NoLayout,
    element: PaymentResult,
    children: [],
  },
  {
    path: PATHS.ROLE_MANAGEMENT,
    title: 'Quản lý Role',
    layout: ClinicLayout,
    element: RoleManagement,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_STAFF_MANAGEMENT,
    title: 'Quản lý nhân viên',
    layout: ClinicLayout,
    element: StaffManagementPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.STAFF_DETAIL,
    title: 'Thông tin nhân viên',
    layout: ClinicLayout,
    element: StaffDetailPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_APPOINTMENT,
    title: 'Lịch hẹn khám',
    layout: ClinicLayout,
    element: AppointmentPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_SERVICE,
    title: 'Bảng giá dịch vụ',
    layout: ClinicLayout,
    element: ServicePricePage,
    isProtected: true,
    children: [],
  },
  {
    path: '*',
    title: 'Không tìm thấy trang',
    layout: NoLayout,
    element: NotFoundPage,
    children: [],
  },
];

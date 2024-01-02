import { AdminLayout, DefaultLayout, ClinicLayout, NoLayout } from '@/layouts';
import {
  HomePage,
  PricingPlanPage,
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
} from '@/pages';

export const PATHS = {
  HOME: '/',
  PRICING_PLAN: '/bang-gia',
  LOGIN: '/dang-nhap',
  REGISTER: '/dang-ky',
  PROFILE: '/thong-tin-ca-nhan',
  VERIFY: '/verify-account',
  VERIFY_LINK_ACCOUNT: '/verify-user',
  REGISTER_BY_INVITATION: '/verify-account',
  ACCEPT_INVITE_ACCOUNT: '/invite-account',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRICING_PLAN: '/admin/bang-gia',
  CLINIC_CHAT: '/clinic/messages',
  CLINIC_DASHBOARD: '/clinic/dashboard',
  VIDEO_CALL: '/clinic/video-call',
  PLAN_MANAGEMENT: '/clinic/quan-ly-goi',
  PAYMENT_RESULT: '/thanh-toan/thong-tin-thanh-toan',
  ROLE_MANAGEMENT: '/clinic/quan-ly-role',
  CLINIC_INFO_MANAGEMENT: '/clinic/thong-tin-phong-kham',
  CLINIC_STAFF_MANAGEMENT: '/clinic/nhan-vien',
  USER_CALENDAR: '/lich-lam-viec',
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
    path: PATHS.PRICING_PLAN,
    title: 'Bảng giá',
    layout: DefaultLayout,
    element: PricingPlanPage,
    isProtected: false,
    children: [],
  },
  {
    path: PATHS.VERIFY,
    title: 'Xác minh tài khoản',
    layout: DefaultLayout,
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
    path: '*',
    title: 'Không tìm thấy trang',
    layout: NoLayout,
    element: NotFoundPage,
    children: [],
  },
];

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
  ClinicCategoryPage,
  ClinicSuppliesPage,
  PatientListPage,
  MakeAppointment,
  Guest_StaffDetail,
  ReceptionPatientPage,
  ExaminationPage,
  VisitPatientPage,
  PaymentInvoicePage,
  PatientDetail,
  ClinicReportPage,
  MedicalProfilePage,
  PatientOverviewPage,
} from '@/pages';
import { NewsManagementPage } from '@/pages/Clinic/NewsManagement';
import { NewsPage } from '@/pages/Guest/News';
import { NewsDetailPage } from '@/pages/Guest/NewsDetail';

export const PATHS = {
  HOME: '/',
  CLINICS: '/phong-kham',
  CLINIC_DETAIL: '/phong-kham/:id',
  STAFF_DETAIL: '/phong-kham/:id/:id',
  NEWS: '/tin-tuc',
  MAKE_APPOINTMENT: '/dat-lich-hen',
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
  PATIENT_CHAT: '/messages',
  CLINIC_DASHBOARD: '/clinic/tong-quan',
  VIDEO_CALL: '/video-call',
  PLAN_MANAGEMENT: '/clinic/quan-ly-goi',
  PAYMENT_RESULT: '/thanh-toan/thong-tin-thanh-toan',
  ROLE_MANAGEMENT: '/clinic/quan-ly-role',
  CLINIC_INFO_MANAGEMENT: '/clinic/thong-tin-phong-kham',
  CLINIC_STAFF_MANAGEMENT: '/clinic/nhan-vien',
  CLINIC_STAFF_DETAIL: '/clinic/nhan-vien/:id',
  STAFF_SCHEDULE: '/clinic/lich-lam-viec',
  CLINIC_APPOINTMENT: '/clinic/lich-hen-kham',
  CLINIC_SERVICE: '/clinic/bang-gia-dich-vu',
  CLINIC_NEWS: '/clinic/quan-ly-tin-tuc',
  CLINIC_PATIENT_MANAGEMENT: '/clinic/benh-nhan',
  CLINIC_PATIENT_DETAIL: '/clinic/benh-nhan/:id',
  CLINIC_RECEPTION: '/clinic/tiep-nhan-benh-nhan',
  CLINIC_EXAMINATION: '/clinic/kham-benh',
  CLINIC_VISITS: '/clinic/kham-benh/:id',
  CLINIC_SERVICE_EXECUTION: '/clinic/thuc-hien-dich-vu',
  EXAMINATION_INVOICE: '/clinic/hoa-don',
  CLINIC_REPORT: '/clinic/bao-cao',
  CLINIC_CATEGORY: '/clinic/danh-muc',
  CLINIC_SUPPLIES: '/clinic/vat-tu',
  MEDICAL_RECORDS: '/ho-so-kham-benh',
  MEDICAL_RECORD: '/ho-so-kham-benh/:id',
  PATIENT_OVERVIEW: '/patient/tong-quan',
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
    children: [],
  },
  {
    path: PATHS.CLINIC_DETAIL,
    title: 'Chi tiết phòng khám',
    layout: DefaultLayout,
    element: ClinicDetailPage,
    children: [],
  },
  {
    path: PATHS.MAKE_APPOINTMENT,
    title: 'Đặt lịch khám',
    layout: DefaultLayout,
    element: MakeAppointment,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.STAFF_DETAIL,
    title: 'Chi tiết nhân viên',
    layout: DefaultLayout,
    element: Guest_StaffDetail,
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
    layout: NoLayout,
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
    path: PATHS.CLINIC_STAFF_DETAIL,
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
    path: PATHS.CLINIC_CATEGORY,
    title: 'Danh mục',
    layout: ClinicLayout,
    element: ClinicCategoryPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_SUPPLIES,
    title: 'Danh sách vật tư',
    layout: ClinicLayout,
    element: ClinicSuppliesPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_PATIENT_MANAGEMENT,
    title: 'Danh sách bệnh nhân',
    layout: ClinicLayout,
    element: PatientListPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_PATIENT_DETAIL,
    title: 'Chi tiết bệnh nhân',
    layout: ClinicLayout,
    element: PatientDetail,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_RECEPTION,
    title: 'Tiếp nhận bệnh nhân',
    layout: ClinicLayout,
    element: ReceptionPatientPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_EXAMINATION,
    title: 'Ca khám bệnh',
    layout: ClinicLayout,
    element: ExaminationPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.EXAMINATION_INVOICE,
    title: 'Thanh toán hóa đơn',
    layout: ClinicLayout,
    element: PaymentInvoicePage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_VISITS,
    title: 'Thực hiện khám bệnh',
    layout: ClinicLayout,
    element: VisitPatientPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_NEWS,
    title: 'Quản lý tin tức',
    layout: ClinicLayout,
    element: NewsManagementPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.CLINIC_REPORT,
    title: 'Thống kê, báo cáo',
    layout: ClinicLayout,
    element: ClinicReportPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.PATIENT_CHAT,
    title: 'Nhắn tin',
    layout: DefaultLayout,
    element: Message,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.MEDICAL_RECORD,
    title: 'Hồ sơ khám bệnh',
    layout: DefaultLayout,
    element: MedicalProfilePage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.PATIENT_OVERVIEW,
    title: 'Tổng quan bệnh nhân',
    layout: DefaultLayout,
    element: PatientOverviewPage,
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

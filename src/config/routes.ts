import { AdminLayout, DefaultLayout } from '@/layouts';
import {
  HomePage,
  LoginPage,
  VerifyAccountPage,
  RegisterPage,
  RegisterByInvitation,
  DashboardAdmin,
} from '@/pages';

export const PATHS = {
  HOME: '/',
  LOGIN: '/dang-nhap',
  REGISTER: '/dang-ky',
  VERIFY: '/verify-account',
  REGISTER_BY_INVITATION: '/verify-account',
  ADMIN_DASHBOARD: '/admin/dashboard',
};

export const ROUTES = [
  {
    path: PATHS.HOME,
    title: 'Trang chủ',
    layout: DefaultLayout,
    element: HomePage,
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
    isProtected: true,
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
  // {
  //   path: '*',
  //   title: 'Không tìm thấy trang',
  //   layout: DefaultLayout,
  //   element: () => NotFoundPage,
  //   children: [],
  // },
];

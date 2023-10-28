import { DefaultLayout } from '@/layouts';
import { HomePage, LoginPage, VerifyAccountPage, RegisterPage } from '@/pages';

export const PATHS = {
  HOME: '/',
  LOGIN: '/dang-nhap',
  REGISTER: '/dang-ky',
  VERIFY: '/xac-minh-tai-khoan',
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
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.LOGIN,
    title: 'Đăng nhập',
    layout: DefaultLayout,
    element: LoginPage,
    isProtected: true,
    children: [],
  },
  {
    path: PATHS.REGISTER,
    title: 'Đăng ký',
    layout: DefaultLayout,
    element: RegisterPage,
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

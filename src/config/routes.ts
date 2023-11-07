import { DefaultLayout } from '@/layouts';
import { HomePage, LoginPage, ProductPage, RegisterPage, UserProfile } from '@/pages';

export const PATHS = {
  HOME: '/',
  PRODUCT: '/products',
  LOGIN: '/dang-nhap',
  REGISTER: '/dang-ky',
  PROFILE: '/thong-tin-ca-nhan',
};

const ROUTES = [
  {
    path: PATHS.HOME,
    title: 'Trang chủ',
    layout: DefaultLayout,
    element: HomePage,
    children: [],
  },
  {
    path: PATHS.PRODUCT,
    title: 'Trang sản phẩm',
    layout: DefaultLayout,
    element: ProductPage,
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
  {
    path: PATHS.PROFILE,
    title: 'Thông tin cá nhân',
    layout: DefaultLayout,
    element: UserProfile,
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

export default ROUTES;

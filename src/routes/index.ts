import { DefaultLayout } from '@/layouts';
import { HomePage, ProductPage } from '@/pages';
import { LoginPage } from '@/pages/Login';

export const PATHS = {
  HOME: '/',
  TODO: '/todos',
  USER: '/users',
  COMMENT: '/comments',
  POST: '/posts',
  IMAGE: '/images',
  PRODUCT: '/products',
  PRODUCT_DETAIL: '/products/:id',
  LOGIN: '/login',
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
    title: 'Trang đăng nhập',
    layout: DefaultLayout,
    element: LoginPage,
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

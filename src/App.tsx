import { Fragment } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { PATHS, ROUTES } from '@/config';
import { checkIsLogin } from '@/utils';
import { useAuth } from './hooks';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const { isLogin } = useAuth();
  if (!isLogin) {
    navigate(PATHS.LOGIN);
  }
  return (
    <>{children}</>
  );
};

function App() {
  const isLogin = checkIsLogin(); // trạng thái user đã đăng nhập hay chưa
  // const { isLogin } = useAuth();
  // const isLogin = false;

  return (
    <BrowserRouter>
      <Routes>
        {ROUTES.map((route, index) => {
          const Layout = route.layout || Fragment;
          const Page = route.element;
          const isProtected = route.isProtected || false; // kiểm tra trang có yêu cầu đăng nhập không   

          // nếu trang yêu cầu đăng nhập nhưng người dùng chưa đăng nhập thì chuyển hướng về trang đăng nhập
          if (isProtected)
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Page />
                    </Layout>
                  </ProtectedRoute>
                }
              />)

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Fragment } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PATHS, ROUTES } from '@/config';
import { checkIsLogin } from '@/utils';

function App() {
  const isLogin = checkIsLogin(); // trạng thái user đã đăng nhập hay chưa

  return (
    <BrowserRouter>
      <Routes>
        {ROUTES.map((route, index) => {
          const Layout = route.layout || Fragment;
          const Page = route.element;
          const isProtected = route.isProtected || false; // kiểm tra trang có yêu cầu đăng nhập không     

          // nếu trang yêu cầu đăng nhập nhưng người dùng chưa đăng nhập thì chuyển hướng về trang đăng nhập
          if (isProtected && !isLogin)
            return <Route key={index} path={route.path} element={<Navigate to={PATHS.LOGIN} />} />;

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

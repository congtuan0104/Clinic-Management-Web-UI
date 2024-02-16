import { Fragment, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ROUTES } from '@/config';
import { CustomRoutes, ProtectedRoute, PublicRoute } from '@/components';
import { useDocumentTitle } from '@mantine/hooks';


const App = () => {
  return (
    <BrowserRouter>
      <CustomRoutes>
        {ROUTES.map((route, index) => {
          const Layout = route.layout || Fragment;
          const Page = route.element;
          const isProtected = route.isProtected// kiểm tra trang có yêu cầu đăng nhập không   

          return (
            <Route
              key={index}
              path={route.path}
              element={
                isProtected === true
                  ? <ProtectedRoute><Layout><Page /></Layout></ProtectedRoute>
                  : (isProtected === false ? <PublicRoute><Layout><Page /></Layout></PublicRoute>
                    : <Layout><Page /></Layout>
                  )
              }
            />
          );
        })}
      </CustomRoutes>
    </BrowserRouter>
  );
}

export default App;
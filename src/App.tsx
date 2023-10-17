import { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ROUTES from '@/routes';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {ROUTES.map((route, index) => {
          const Layout = route.layout || Fragment;
          const Page = route.element;

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

import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

import { PATHS } from '@/routes';

const { Header, Content, Footer } = Layout;

const DefaultLayout = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 40,
          lineHeight: '40px',
          backgroundColor: '#fff',
        }}>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['/']}
          items={[
            {
              key: '/',
              label: 'Trang chủ',
              onClick: () => {
                navigate(PATHS.HOME);
              },
            },
            {
              key: '/login',
              label: 'Đăng nhập',
              onClick: () => {
                navigate(PATHS.LOGIN);
              },
            },
            {
              key: '/products',
              label: 'Products',
              onClick: () => {
                navigate(PATHS.PRODUCT);
              },
            },
            
            {
              key: '/posts',
              label: 'Post',
              onClick: () => {
                navigate(PATHS.POST);
              },
            },
          ]}
        />
      </Header>
      <Content style={{ marginTop: 20 }}>
        <div>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#fff', marginTop: '30px' }}>Footer</Footer>
    </Layout>
  );
};

export default DefaultLayout;

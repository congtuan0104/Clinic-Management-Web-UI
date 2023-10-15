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
              label: 'Home',
              onClick: () => {
                navigate(PATHS.HOME);
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
        <div className="site-layout-content" style={{ padding: '0 20px', margin: '0 15px' }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#fff' }}>Footer</Footer>
    </Layout>
  );
};

export default DefaultLayout;

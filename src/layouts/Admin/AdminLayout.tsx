import { useNavigate } from 'react-router-dom';

import { AdminHeader, DefaultHeader } from '@/components';
import { Box } from '@mantine/core';

const AdminLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <Box mih='100%'>
      <AdminHeader />
      <main className="max-w-screen-xxl mx-auto min-h-[calc(100vh_-_60px)]">{children}</main>
    </Box>
  );
};

export default AdminLayout;

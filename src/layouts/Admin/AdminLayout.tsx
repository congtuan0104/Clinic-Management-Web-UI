import { useNavigate } from 'react-router-dom';

import { AdminHeader, DefaultHeader } from '@/components';

const AdminLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div>
      <AdminHeader />
      <main className="max-w-screen-xxl mx-auto min-h-[calc(100vh_-_60px)]">{children}</main>
    </div>
  );
};

export default AdminLayout;

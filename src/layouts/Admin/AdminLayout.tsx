import { useNavigate } from 'react-router-dom';

import { DefaultHeader } from '@/components';

const AdminLayout = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  return (
    <div>
      <DefaultHeader />
      <main className="max-w-screen-xxl mx-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;

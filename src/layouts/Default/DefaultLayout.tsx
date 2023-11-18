import { useNavigate } from 'react-router-dom';

import { DefaultHeader } from '@/components';
import { Box } from '@mantine/core';

const DefaultLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <Box bg='primary.0' mih='100vh'>
      <DefaultHeader />
      <main className="max-w-screen-xxl mx-auto">{children}</main>
    </Box>
  );
};

export default DefaultLayout;


import { DefaultHeader } from '@/components';
import { Box } from '@mantine/core';
import './index.css';

const MessageLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <Box bg='primary.0'>
      <main className="max-w-screen-2xl mx-auto">{children}</main>
    </Box>
  );
};

export default MessageLayout;

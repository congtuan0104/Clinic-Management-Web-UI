
import { DefaultHeader } from '@/components';
import { Box } from '@mantine/core';
import './index.css';

const MessageLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div>
      <main className="max-w-screen-2xl mx-auto">{children}</main>
    </div>
  );
};

export default MessageLayout;

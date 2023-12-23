import { Box } from '@mantine/core';

const NoLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <Box bg='primary.0' mih='100vh'>
      {children}
    </Box>
  );
};

export default NoLayout;

import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text } from '@mantine/core';

const DashboardAdmin = () => {
  const userInfo = useAppSelector(userInfoSelector);

  return (
    <Box>
      <Title ta="center">Dashboard - Admin</Title>
      {userInfo && (
        <>
          <Text c="dimmed" size="lg" ta="center" mt="10">
            Bạn đã đăng nhập bằng email: {userInfo.email}
          </Text>
          <Text c="teal" size="md" ta="center" mt="10">
            Bạn là: {userInfo.role}
          </Text>
        </>
      )}
    </Box>
  );
};

export default DashboardAdmin;

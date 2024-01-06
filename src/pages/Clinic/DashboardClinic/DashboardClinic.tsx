import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text } from '@mantine/core';

const DashboardAdmin = () => {
  const userInfo = useAppSelector(userInfoSelector);

  return (
    <Box>
      <Title ta="center">Dashboard - Clinic</Title>
      {userInfo && (
        <>
          <Text c="dimmed" size="lg" ta="center" mt="10">
            Bạn đã đăng nhập bằng email: {userInfo.email}
          </Text>
        </>
      )}
    </Box>
  );
};

export default DashboardAdmin;

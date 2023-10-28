// import { useQuery } from 'react-query';

import { PATHS, ROUTES } from '@/config';
import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Center, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

// import { productApi } from '@/services/product.service';

const VerifyAccountPage = () => {
  const userInfo = useAppSelector(userInfoSelector);

  const navigate = useNavigate();

  if (userInfo?.emailVerified) {
    notifications.show({
      message: 'Tài khoản của bạn đã được xác thực!',
      color: 'green',
    });

    navigate(PATHS.HOME);
  }

  return (
    <Stack h="90vh" align="center" justify="center">
      <Text size="xl">Chúng tôi đã gửi một đường link xác thực đến {userInfo?.email}</Text>
      <Text size="lg">Vui lòng xác thực để tiếp tục sử dụng ứng dụng</Text>
    </Stack>
  );
};

export default VerifyAccountPage;

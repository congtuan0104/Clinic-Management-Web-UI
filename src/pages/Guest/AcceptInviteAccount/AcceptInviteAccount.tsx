// import { useQuery } from 'react-query';

import { PATHS } from '@/config';
import { authApi } from '@/services';
import { Box, Center, Loader, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate, useSearchParams } from 'react-router-dom';


const AcceptInviteAccountPage = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  if (token) {
    console.log(token)
    authApi.acceptInviteAccount(token).then(res => {
      if (res.status) {
        notifications.show({
          message: 'Tham gia phòng khám thành công!',
          color: 'green',
        });
      }
      else {
        notifications.show({
          message: res.message,
          color: 'red',
        });
      }

      // navigate(PATHS.LOGIN);
    }).catch(error => {
      console.log(error.message);
      notifications.show({
        message: error.message,
        color: 'red',
      });

    })
      .finally(() => {
        navigate(PATHS.LOGIN);
      })
  }


  return (
    <Stack h="90vh" align="center" justify="center">
      <Loader size="xl" />
      <Text size="xl">Đang xác thực</Text>
    </Stack>
  );
};

export default AcceptInviteAccountPage;

// import { useQuery } from 'react-query';

import { PATHS } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { authApi } from '@/services';
import { setUserInfo, userInfoSelector } from '@/store';
import { cookies } from '@/utils';
import { Box, Center, Loader, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useSearchParams } from 'react-router-dom';


const VerifyUserLinkAccountPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const linkAccountWithEmail = async (email: string, key: string, provider: string) => {
    const res = await authApi.linkAccountWithEmail({ email, key, provider });
    if (res.data) {
      const userInfo = res.data?.user;
      const token = res.data?.token;

      // lưu vào token và thông tin user vào cookie
      cookies.set(COOKIE_KEY.TOKEN, token);
      cookies.set(COOKIE_KEY.USER_INFO, userInfo);

      // lưu thông tin user vào redux
      dispatch(setUserInfo(userInfo));

      // Hiển thị thông báo
      notifications.show({
        message: 'Đăng nhập thành công',
        color: 'green',
      });

    }
  }

  // get token from param and decode token to get email and role
  let [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  if (token) {
    const data: any = jwtDecode(token);

    linkAccountWithEmail(data.email, data.key, data.provider).then(() => {
      navigate(PATHS.PROFILE);
    });
  }


  // const navigate = useNavigate();

  // if (userInfo?.emailVerified) {
  //   notifications.show({
  //     message: 'Tài khoản của bạn đã được xác thực!',
  //     color: 'green',
  //   });

  //   navigate(PATHS.HOME);
  // }

  return (
    <Stack h="90vh" align="center" justify="center">
      <Loader size="xl" />
      <Text size="xl">Đang xác thực</Text>
    </Stack>
  );
};

export default VerifyUserLinkAccountPage;

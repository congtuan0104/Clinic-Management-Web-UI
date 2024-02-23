import { Text } from '@mantine/core';
import { DefaultHeader, PatientHeader } from '@/components';
import { Box } from '@mantine/core';
import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { AuthModule } from '@/enums';
import { useEffect } from 'react';
import { onMessageListener, requestForToken } from '@/config';
import { notificationApi } from '@/services';
import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';
import { notifications } from '@mantine/notifications';

const DefaultLayout = ({ children }: { children: JSX.Element }) => {
  const userInfo = useAppSelector(userInfoSelector);

  useEffect(() => {
    requestForToken()
      .then((deviceToken) => {
        if (userInfo?.id)
          notificationApi.registerDeviceToken(userInfo?.id, deviceToken);
        cookies.set(COOKIE_KEY.DEVICE_TOKEN, deviceToken);
      })
      .catch((err) => console.log(err));

    onMessageListener()
      .then((payload) => {
        notifications.show({
          title: payload?.notification?.title,
          message: <Text>{payload?.notification?.body}</Text>,
          color: 'blue',
        });
      })
      .catch((err) => console.log('Get firebase message failed: ', err));
  }, [userInfo?.id])

  return (
    <Box bg='primary.0' mih='100vh'>
      {userInfo && userInfo.moduleId === AuthModule.Patient
        ? <PatientHeader userInfo={userInfo} />
        : <DefaultHeader />}
      <main className="mx-auto pt-[60px]">{children}</main>

      <footer className="bg-primary-300 text-white text-center py-4 border-t-[1px] border-solid border-gray-300 shadow-md">
        <div className="flex flex-wrap items-center max-w-screen-xl mx-auto justify-center md:justify-between">
          <div className="w-full px-4">
            <div className="text-md font-semibold py-1">
              © 2024 <b>Clinus</b> - Phần mềm hỗ trợ đặt lịch hẹn và quản lý khám chữa bệnh
            </div>
            <div className="text-sm py-1">
              Đồ án tốt nghiệp (K19-K20) - Trường Đại học Khoa học Tự nhiên Tp.HCM
            </div>
          </div>
        </div>
      </footer>
    </Box>
  );
};

export default DefaultLayout;

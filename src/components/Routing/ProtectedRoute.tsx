import { PATHS, onMessageListener, requestForToken } from "@/config";
import { COOKIE_KEY } from "@/constants";
import { useAppSelector } from "@/hooks";
import { notificationApi } from "@/services";
import { userInfoSelector } from "@/store";
import { cookies } from "@/utils";
import { notifications } from "@mantine/notifications";
import { Navigate } from "react-router-dom";
import { Text } from "@mantine/core";
/**
 * Kiểm tra trạng thái user đã đăng nhập hay chưa
 * @param page Trang cần bảo vệ
 * Nếu chưa đăng nhập thì redirect về trang đăng nhập
 * Nếu đã đăng nhập thì hiển thị trang cần bảo vệ (children)
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userInfo = useAppSelector(userInfoSelector);
  const isLogin = !!userInfo;

  if (isLogin) {
    requestForToken()
      .then((token) => {
        if (userInfo?.id)
          notificationApi.registerDeviceToken(userInfo?.id, token);
        cookies.set(COOKIE_KEY.DEVICE_TOKEN, token);
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

    return <>{children}</>
  }
  return <Navigate to={PATHS.LOGIN} replace />
};

export default ProtectedRoute;
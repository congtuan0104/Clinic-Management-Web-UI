import { PATHS, onMessageListener, requestForToken } from "@/config";
import { COOKIE_KEY } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { notificationApi } from "@/services";
import { setUserInfo, userInfoSelector } from "@/store";
import { cookies } from "@/utils";
import { notifications } from "@mantine/notifications";
import { Navigate } from "react-router-dom";
import { Text } from "@mantine/core";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { ModalInitPassword } from "..";
/**
 * Kiểm tra trạng thái user đã đăng nhập hay chưa
 * @param page Trang cần bảo vệ
 * Nếu chưa đăng nhập thì redirect về trang đăng nhập
 * Nếu đã đăng nhập thì hiển thị trang cần bảo vệ (children)
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userInfo = useAppSelector(userInfoSelector);
  const dispatch = useAppDispatch();
  const isLogin = !!userInfo;
  const token = cookies.get(COOKIE_KEY.TOKEN)?.toString();

  if (token) {
    const decodeToken = jwtDecode(token);
    console.log(decodeToken);

    const exp = decodeToken.exp ? decodeToken.exp * 1000 : 0;
    const expDate = new Date(exp);
    const currentDate = new Date();

    // kiểm tra token đã hết hạn
    if (expDate < currentDate) {
      cookies.remove(COOKIE_KEY.TOKEN);
      cookies.remove(COOKIE_KEY.CURRENT_CLINIC_ID);
      cookies.remove(COOKIE_KEY.DEVICE_TOKEN);
      cookies.remove(COOKIE_KEY.USER_INFO);

      notifications.show({
        id: 'token-expired',
        title: 'Phiên đăng nhập hết hạn',
        message: <Text>Vui lòng đăng nhập lại</Text>,
        color: 'red.5',
        autoClose: 5000,
      });

      dispatch(setUserInfo(null));
      return <Navigate to={PATHS.LOGIN} replace />
    }
  }

  if (isLogin && token) {
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

    // if (userInfo.isInputPassword === false) {
    //   return <h1>Chuwa ddawt mat khau</h1>
    // }
    return <>
      {children}
      {/* {!userInfo.isInputPassword && <ModalInitPassword email={userInfo.email} />} */}
    </>
  }
  return <Navigate to={PATHS.LOGIN} replace />
};

export default ProtectedRoute;
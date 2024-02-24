import { FirebaseAuthProvider, PATHS, firebaseAuth } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { setUserInfo, userInfoSelector } from '@/store';
import { cookies } from '@/utils';
import { notifications } from '@mantine/notifications';
import { AuthProvider, signInWithPopup } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { notificationApi } from '@/services';
import { AuthModule } from '@/enums';

// description: hook xử lý các tác vụ liên quan đến chức năng đăng nhập, đăng xuất

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useAppSelector(userInfoSelector);
  const [isLogin, setIsLogin] = useState(false);
  const [openedModalChooseEmail, { open, close }] = useDisclosure(false);

  // kiểm tra xem người dùng đã đăng nhập hay chưa
  useEffect(() => {
    if (userInfo) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [userInfo]);

  // lấy thông tin user từ bên thứ 3 (Google, Facebook, Microsoft)
  const getUserInfoByProvider = async (provider: AuthProvider) => {
    try {
      const providerData = await signInWithPopup(firebaseAuth, provider);
      return providerData.user;
    } catch {
      console.log('error');
      return undefined;
    }
  };

  // luồng đăng nhập tài khoản bằng bên thứ 3
  const loginByOAuth = async (provider: AuthProvider) => {
    // lấy thông tin user từ provider
    try {
      const userInfoFromProvider = await getUserInfoByProvider(provider);
      let providerStr;

      switch (provider) {
        case FirebaseAuthProvider.Google:
          providerStr = 'google';
          break;
        case FirebaseAuthProvider.Facebook:
          providerStr = 'facebook';
          break;
        case FirebaseAuthProvider.Microsoft:
          providerStr = 'microsoft';
          break;
        default:
          providerStr = 'google';
          break;
      }

      if (!userInfoFromProvider) {
        notifications.show({
          message: 'Đăng nhập không thành công',
          color: 'red',
        });
        return;
      }

      // gửi thông tin user lên server để lấy token (đang chờ api)
      console.log(`user info from ${providerStr}: `, userInfoFromProvider);

      // kiểm tra account có tồn tại, nếu có thì lưu thông tin user và token
      const res = await authApi.getUserByAccountId(userInfoFromProvider.uid, providerStr);
      console.log('res', res);
      if (res.data && res.data.user) {
        const userInfo = res.data.user;
        cookies.set(COOKIE_KEY.TOKEN, res.data.token);
        cookies.set(COOKIE_KEY.USER_INFO, JSON.stringify(res.data.user));
        dispatch(setUserInfo(res.data.user));
        notifications.show({
          message: 'Đăng nhập thành công',
          color: 'green',
        });
        switch (userInfo.moduleId) {
          case AuthModule.Admin:
            navigate(PATHS.ADMIN_DASHBOARD);
            break;
          case AuthModule.ClinicOwner:
            navigate(PATHS.CLINIC_DASHBOARD);
            break;
          case AuthModule.Patient:
            navigate(PATHS.PROFILE);
            break;
          default:
            navigate(PATHS.PROFILE);
            break;
        }
        return;
      } else {
        // chưa có tài khoản, chọn email để đăng ký tài khoản
        const emailFromProvider =
          userInfoFromProvider.email || userInfoFromProvider.providerData[0].email;
        console.log('emailFromProvider', emailFromProvider);

        open(); // mở modal chọn email để đăng ký tài khoản
      }
    } catch (err) {
      console.error(err);
      notifications.show({
        message: 'Đăng nhập không thành công',
        color: 'red',
      });
    }
  };

  const linkAccount = async (provider: AuthProvider, providertext: string) => {
    // lấy thông tin user từ provider
    const user = await getUserInfoByProvider(provider);
    if (!user) {
      notifications.show({
        message: 'Tài khoản không tồn tại',
        color: 'red',
      });
      return;
    }
    // gọi api liên kết tài khoản với user
    const res = await authApi
      .linkAccount({
        key: user.uid,
        userId: userInfo?.id,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        picture: user.photoURL || '',
        provider: providertext,
      })
      .catch(err => {
        console.error(err);
      });
  };

  // đăng xuất tài khoản
  const logout = () => {
    cookies.remove(COOKIE_KEY.TOKEN);
    cookies.remove(COOKIE_KEY.USER_INFO);

    const deviceToken = cookies.get(COOKIE_KEY.DEVICE_TOKEN)?.toString();

    if (deviceToken && userInfo) {
      notificationApi.deleteDeviceToken(userInfo.id, deviceToken);
      cookies.remove(COOKIE_KEY.DEVICE_TOKEN);
    }

    dispatch(setUserInfo(undefined));
    notifications.show({
      message: 'Bạn đã đăng xuất',
      color: 'orange',
    });
    navigate(PATHS.HOME);
  };

  return {
    userInfo, // thông tin user hiện đang đăng nhập
    isLogin, // trạng thái đăng nhập
    getUserInfoByProvider, // lấy thông tin user từ bên thứ 3
    logout, // đăng xuất
    loginByOAuth, // đăng nhập bằng bên thứ 3
    linkAccount, // liên kết tài khoản với bên thứ 3
    openedModalChooseEmail, // mở modal chọn email để đăng ký tài khoản
    close,
  };
};

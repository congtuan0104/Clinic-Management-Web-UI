import { PATHS, firebaseAuth } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { setUserInfo, userInfoSelector } from '@/store';
import { cookies } from '@/utils';
import { notifications } from '@mantine/notifications';
import { AuthProvider, signInWithPopup } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services';
import { useEffect, useState } from 'react';

// description: hook xử lý các tác vụ liên quan đến chức năng đăng nhập, đăng xuất

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useAppSelector(userInfoSelector);
  const [isLogin, setIsLogin] = useState(false);

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
    const user = await getUserInfoByProvider(provider);
    if (!user) {
      notifications.show({
        message: 'Đăng nhập không thành công',
        color: 'red',
      });
      return;
    }

    // gửi thông tin user lên server để lấy token (đang chờ api)
    console.log(`user info from ${user.providerId}: `, user);
  };

  const linkAccount = async (provider: AuthProvider) => {
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
    const res = await authApi.linkAccount({
      key: user.uid,
      userId: userInfo?.id,
      firstName: user.displayName?.split(' ')[0] || '',
      lastName: user.displayName?.split(' ')[1] || '',
      picture: user.photoURL || '',
      provider: user.providerId,
    });
  };

  // đăng xuất tài khoản
  const logout = () => {
    cookies.remove(COOKIE_KEY.TOKEN);
    cookies.remove(COOKIE_KEY.USER_INFO);

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
  };
};

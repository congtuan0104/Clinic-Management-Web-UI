import { PATHS, firebaseAuth } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { setUserInfo } from '@/store';
import { cookies } from '@/utils';
import { notifications } from '@mantine/notifications';
import { AuthProvider, signInWithPopup } from 'firebase/auth';
import { useAppDispatch } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services';

// description: hook xử lý các tác vụ liên quan đến chức năng đăng nhập, đăng xuất

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = cookies.get(COOKIE_KEY.USER_INFO);
  const token = cookies.get(COOKIE_KEY.TOKEN);

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
        message: 'Đăng nhập không thành cồn',
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

  return { getUserInfoByProvider, logout, loginByOAuth, linkAccount };
};

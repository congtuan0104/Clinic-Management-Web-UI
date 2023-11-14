import { PATHS, firebaseAuth } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { setUserInfo } from '@/store';
import { cookies } from '@/utils';
import { notifications } from '@mantine/notifications';
import { AuthProvider, signInWithPopup } from 'firebase/auth';
import { useAppDispatch } from '@/hooks';
import { useNavigate } from 'react-router-dom';

// description: hook xử lý các tác vụ liên quan đến chức năng đăng nhập, đăng xuất

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = cookies.get(COOKIE_KEY.USER_INFO);
  const token = cookies.get(COOKIE_KEY.TOKEN);

  // đăng nhập bằng tài khoản bên thứ 3
  const loginByOAuth = async (provider: AuthProvider) => {
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      console.log('result', result);
    } catch {
      console.log('error');
      notifications.show({
        message: 'Đăng nhập không thành công',
        color: 'red',
      });
    }
  };

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

  return { loginByOAuth, logout };
};

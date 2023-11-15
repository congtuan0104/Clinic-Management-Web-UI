// kiểm tra xem người dùng đã đăng nhập hay chưa
export const checkIsLogin = () => {
  const token = localStorage.getItem('token');
  const userInfo = localStorage.getItem('userInfo');
  if (token && userInfo) {
    return true;
  }
  return false;
};

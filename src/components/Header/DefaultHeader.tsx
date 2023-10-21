import { PATHS } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setUserInfo, userInfoSelector } from '@/store';
import { cookies } from '@/utils';
import {
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  Stack,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Link, useNavigate } from 'react-router-dom';

// header cho các trang dành cho khách hàng chưa đăng nhập
const Header = () => {
  const userInfo = useAppSelector(userInfoSelector);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    cookies.remove(COOKIE_KEY.TOKEN);
    cookies.remove(COOKIE_KEY.USER_INFO);

    dispatch(setUserInfo(undefined));
    notifications.show({
      message: 'Bạn đã đăng xuất',
      color: 'orange',
    });
    navigate(PATHS.HOME);
  };

  return (
    <Box h={60} className="border border-gray-300 border-solid shadow-md">
      <header className="h-full max-w-screen-xxl mx-auto">
        <Group justify="space-between" h="100%">
          <Box w={userInfo ? undefined : 222}>
            <Link to={PATHS.HOME}>
              <Title>ClinUS</Title>
            </Link>
          </Box>

          <Group h="100%" gap={35} visibleFrom="sm">
            <Link className="hover:text-[#228BE6]" to={PATHS.HOME}>
              Trang chủ
            </Link>
            <Link className="hover:text-[#228BE6]" to="#">
              Giới thiệu
            </Link>
            <Link className="hover:text-[#228BE6]" to="#">
              Bảng giá
            </Link>
            <Link className="hover:text-[#228BE6]" to="#">
              Tin tức
            </Link>
          </Group>

          <Group visibleFrom="sm">
            {userInfo ? (
              <Button variant="light" color="red" onClick={handleLogout}>
                Đăng xuất
              </Button>
            ) : (
              <>
                <Button variant="outline" component={Link} to={PATHS.LOGIN}>
                  Đăng nhập
                </Button>
                <Button component={Link} to={PATHS.REGISTER}>
                  Đăng ký{' '}
                </Button>
              </>
            )}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Menu"
        hiddenFrom="sm"
        zIndex={1000000}>
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Stack pl={20}>
            <Link to={PATHS.HOME}>Trang chủ</Link>
            <Link to="#">Giới thiệu</Link>
            <Link to="#">Bảng giá</Link>
            <Link to="#">Tin tức</Link>
          </Stack>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {userInfo ? (
              <Button color="red" onClick={handleLogout}>
                Đăng xuất
              </Button>
            ) : (
              <>
                <Button variant="outline" component={Link} to={PATHS.LOGIN}>
                  Đăng nhập
                </Button>
                <Button component={Link} to={PATHS.REGISTER}>
                  Đăng ký{' '}
                </Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default Header;

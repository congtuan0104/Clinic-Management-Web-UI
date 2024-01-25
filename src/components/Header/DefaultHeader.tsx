import { PATHS } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { useAppDispatch, useAppSelector, useAuth } from '@/hooks';
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
  UnstyledButton,
  Avatar,
  Text,
  Image,
} from '@mantine/core';

import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import ClinusLogo from '@/assets/images/logo.png'
import classNames from 'classnames';


// header cho các trang dành cho khách hàng chưa đăng nhập
const Header = () => {
  const userInfo = useAppSelector(userInfoSelector);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  // pathname url hiện tại react router dom

  const { logout } = useAuth();
  const { pathname } = useLocation()

  const [scroll] = useWindowScroll();

  return (
    <Box h={(scroll.y > 100 || pathname !== PATHS.HOME) ? 60 : 100} bg='white' className={classNames(
      " fixed top-0 inset-x-0 z-10 transition-all duration-300 ease-in-out",
      (scroll.y > 100 || pathname !== PATHS.HOME) ? 'shadow-lg' : 'shadow-none'
    )}>
      <header className="h-full max-w-screen-xl mx-auto">
        <Group justify="space-between" h="100%">
          <Box w={userInfo ? undefined : 222}>
            <Link to={PATHS.HOME}>
              <Image src={ClinusLogo} alt='logo' h={51} w={150} fit='contain' />
            </Link>
          </Box>

          {!userInfo && (
            <Group h="100%" gap={35} visibleFrom="sm">
              <Link className=" hover:text-teal-500" to={PATHS.HOME}>
                Trang chủ
              </Link>
              <Link className=" hover:text-teal-500" to="/tin-tuc">
                Tin tức
              </Link>
              <Link className=" hover:text-teal-500" to='/phong-kham'>
                Phòng khám
              </Link>
              <Link className=" hover:text-teal-500" to="/dat-lich-hen">
                Đặt lịch khám
              </Link>
            </Group>
          )}

          <Group visibleFrom="md">
            {userInfo ? (
              <Button variant="light" color="red.5" onClick={logout}>
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
          {userInfo && (
            <Link to={PATHS.PROFILE}>
              <Text c="dimmed" size="xs">
                {userInfo?.email}
              </Text>
            </Link>
          )}
          <Divider my="sm" />

          <Stack pl={20}>
            <Link to={PATHS.HOME}>Trang chủ</Link>
            <Link to="#">Giới thiệu</Link>
            <Link to='#'>Bảng giá</Link>
            <Link to="#">Tin tức</Link>
          </Stack>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {userInfo ? (
              <Button color="red" onClick={logout}>
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

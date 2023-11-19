import { PATHS } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { useAppDispatch, useAppSelector, useAuth } from '@/hooks';
import { setUserInfo, userInfoSelector } from '@/store';
import { cookies } from '@/utils';
import { auth } from '@/pages/UserProfile/firebase';


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

import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';


// header cho các trang dành cho khách hàng chưa đăng nhập
const Header = () => {
  const userInfo = useAppSelector(userInfoSelector);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  const { logout } = useAuth();

  return (
    <Box h={60} bg='white' className="shadow-md">
      <header className="h-full max-w-screen-xxl mx-auto">
        <Group justify="space-between" h="100%">
          <Box w={userInfo ? undefined : 222}>
            <Link to={PATHS.HOME}>
              <Image src='/src/assets/images/logo.png' alt='logo' h={50} fit='contain' />
            </Link>
          </Box>

          <Group h="100%" gap={35} visibleFrom="sm">
            <Link className="hover:text-[#228BE6]" to={PATHS.HOME}>
              Trang chủ
            </Link>
            <Link className="hover:text-[#228BE6]" to="#">
              Giới thiệu
            </Link>
            <Link className="hover:text-[#228BE6]" to={PATHS.PRICING_PLAN}>
              Bảng giá
            </Link>
            <Link className="hover:text-[#228BE6]" to="#">
              Tin tức
            </Link>
          </Group>

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
            <Link to={PATHS.PRICING_PLAN}>Bảng giá</Link>
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

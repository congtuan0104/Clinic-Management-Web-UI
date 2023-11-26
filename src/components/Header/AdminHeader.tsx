import { PATHS } from '@/config';
import { useAppSelector, useAuth } from '@/hooks';
import { userInfoSelector } from '@/store';

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
  Image,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import LogoImage from '@/assets/images/logo.png';

// header cho các trang dành cho khách hàng chưa đăng nhập
const AdminHeader = () => {
  const userInfo = useAppSelector(userInfoSelector);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  const { logout } = useAuth();

  return (
    <Box h={60} className="shadow-md">
      <header className="h-full max-w-screen-xxl mx-auto">
        <Group justify="space-between" h="100%">
          <Box w={userInfo ? undefined : 222}>
            <Link to={PATHS.HOME}>
              <Image src={LogoImage} alt='logo' h={50} fit='contain' />
            </Link>
          </Box>

          <Group h="100%" gap={35} visibleFrom="sm">
            <Link className="hover:text-[#6964ff]" to={PATHS.ADMIN_DASHBOARD}>
              Dashboard
            </Link>
            <Link className="hover:text-[#6964ff]" to={PATHS.ADMIN_PRICING_PLAN}>
              Quản lý gói
            </Link>

          </Group>

          <Group visibleFrom="sm">
            {userInfo ? (
              <Button variant="light" color="red.7" onClick={logout}>
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

export default AdminHeader;

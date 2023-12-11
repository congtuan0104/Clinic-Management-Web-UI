import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/config';
import { useAppSelector, useAuth } from '@/hooks';
import { setUserInfo, userInfoSelector } from '@/store';
import { Box, Group, Button, Burger, Drawer, ScrollArea, rem, Stack, Title, UnstyledButton, Avatar, Text, Image, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ClinusLogo from '@/assets/images/logo.png';

const ClinicHeader = () => {
  const userInfo = useAppSelector(userInfoSelector);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  const { logout } = useAuth();

  return (
    <Box h={60} bg='white' className="shadow-md" pos={'fixed'} w={'100%'}>
      <header className="h-full max-w-screen-xxl">
        <Group justify="flex-start" h="100%" pl={10}>
          <Link to={PATHS.CLINIC_DASHBOARD}>
            <Image src={ClinusLogo} alt='logo' h={50} fit='contain' />
          </Link>
        </Group>
      </header>
    </Box>
  );
};

export default ClinicHeader;

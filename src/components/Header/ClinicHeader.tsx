import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/config';
import { useAppDispatch, useAppSelector, useAuth } from '@/hooks';
import { currentClinicSelector, focusModeSelector, listClinicSelector, setCurrentClinic, setUserInfo, userInfoSelector } from '@/store';
import { Text, Group, Button, Image, Divider, Menu, TextInput, Flex, ScrollArea, Indicator, ActionIcon, Badge, Title, Tooltip } from '@mantine/core';
import { useDisclosure, useFullscreen } from '@mantine/hooks';
import ClinusLogo from '@/assets/images/logo.png';
import { IClinic } from '@/types';
import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';
import { IoSearch } from 'react-icons/io5';
import { MdNotificationsNone, MdOutlineHelpOutline, MdOutlineMenuOpen } from 'react-icons/md';
import { CgLogOut, CgProfile } from 'react-icons/cg';
import { FaUserCircle } from "react-icons/fa";
import { BsCardText } from "react-icons/bs";
import { BiCollapse, BiExpand } from "react-icons/bi";

const ClinicHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const currentClinic = useAppSelector(currentClinicSelector);
  const listClinic = useAppSelector(listClinicSelector);
  const focusMode = useAppSelector(focusModeSelector);
  const { userInfo } = useAuth();

  const { toggle, fullscreen } = useFullscreen();

  const handleChangeClinic = (clinic: IClinic) => {
    cookies.set(COOKIE_KEY.CURRENT_CLINIC_ID, clinic.id)
    dispatch(setCurrentClinic(clinic));
  }

  return (
    <header className="h-[60px] flex justify-between items-center pl-3 pr-5 bg-white z-10 
    border-solid border-0 border-b border-gray-300 fixed top-0 right-0 left-0">
      <Group w={280} justify='space-between' align='center' pr={16}>
        <Link className='py-[4px] pr-1 w-fit h-[60px]' to={PATHS.CLINIC_DASHBOARD}>
          <Image src={ClinusLogo} alt='logo' h={51} w={150} fit='contain' />
        </Link>

        {!focusMode && <MdOutlineMenuOpen size={35} />}
      </Group>

      {!focusMode && (
        <TextInput
          variant="filled"
          placeholder="Tìm kiếm"
          leftSection={<IoSearch size={20} />}
          radius='sm'
          w='100%'
          maw={300}
        />
      )}

      <div className='flex flex-1 justify-end items-center gap-1'>
        {!focusMode && <Menu shadow="md" width={200} position="bottom-end" offset={-3}>
          <Divider orientation="vertical" />
          <Menu.Target>
            <Button variant='subtle' color='black.6' c='gray.7' size='sm' fw={400} radius='md'>
              {currentClinic?.name}
            </Button>
          </Menu.Target>

          <Divider orientation="vertical" mr={5} />

          <Menu.Dropdown>
            <ScrollArea mah={300}>
              {listClinic?.map((clinic) => (
                <Menu.Item key={clinic.id} onClick={() => handleChangeClinic(clinic)}>
                  {clinic.name}
                </Menu.Item>
              ))}
            </ScrollArea>
          </Menu.Dropdown>
        </Menu>}

        <Tooltip label={fullscreen ? 'Thu nhỏ' : 'Hiển thị toàn màn hình'}>
          <ActionIcon
            onClick={toggle}
            color='gray.9' variant="subtle" radius="md" size={35} aria-label="full-screen">
            {fullscreen ? <BiCollapse size={25} /> : <BiExpand size={25} />}
          </ActionIcon>
        </Tooltip>

        <Tooltip label='Trợ giúp'>
          <ActionIcon
            component='a'
            target='_blank'
            rel='noopener noreferrer'
            href='mailto:clinius123@gmail.com'
            color='gray.9' variant="subtle" radius="md" size={35} aria-label="full-screen">
            <MdOutlineHelpOutline size={25} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label='Thông báo'>
          <ActionIcon
            onClick={() => { }}
            color='gray.9' variant="subtle" radius="md" size={35} aria-label="Notifications">
            <Indicator color='secondary.5' inline label={2} size={16}>
              <MdNotificationsNone size={25} />
            </Indicator>
          </ActionIcon>
        </Tooltip>

        <Divider orientation="vertical" ml={5} />

        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Button
              onClick={() => { }}
              mx={5}
              color='black.5' variant="subtle" radius="md"
              leftSection={<FaUserCircle size={25} />}
            >
              {userInfo?.firstName} {userInfo?.lastName}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Tài khoản</Menu.Label>
            <Menu.Item
              leftSection={<CgProfile size={15} />}
            >
              Thông tin cá nhân
            </Menu.Item>
            <Menu.Item
              onClick={() => navigate(PATHS.PLAN_MANAGEMENT)}
              leftSection={<BsCardText size={15} />}
            >
              Quản lý gói
            </Menu.Item>
            <Menu.Item
              onClick={() => logout()}
              color="red.8"
              leftSection={<CgLogOut size={15} />}
            >
              Đăng xuất
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

      </div>
    </header>
  );
};

export default ClinicHeader;

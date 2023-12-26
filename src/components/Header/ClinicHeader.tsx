import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/config';
import { useAppDispatch, useAppSelector, useAuth } from '@/hooks';
import { currentClinicSelector, listClinicSelector, setCurrentClinic, setUserInfo, userInfoSelector } from '@/store';
import { Text, Group, Button, Image, Divider, Menu, TextInput, Flex, ScrollArea, Indicator, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ClinusLogo from '@/assets/images/logo.png';
import { IClinic } from '@/types';
import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';
import { IoSearch } from 'react-icons/io5';
import { MdNotificationsNone, MdOutlineMenuOpen } from 'react-icons/md';
import { CgLogOut, CgProfile, CgUser } from 'react-icons/cg';

const ClinicHeader = () => {
  const { logout } = useAuth();
  const currentClinic = useAppSelector(currentClinicSelector);
  const listClinic = useAppSelector(listClinicSelector);
  const dispatch = useAppDispatch();

  const handleChangeClinic = (clinic: IClinic) => {
    cookies.set(COOKIE_KEY.CURRENT_CLINIC_ID, clinic.id)
    dispatch(setCurrentClinic(clinic));
  }

  return (
    <header className="h-[60px] flex justify-between items-center pl-3 pr-5 bg-white z-10 
    border-solid border-0 border-b border-gray-300 fixed top-0 right-0 left-0">
      <Group w={280} justify='space-between' align='center' pr={16}>
        <Link className='py-[4px] pr-1 w-fit h-[60px]' to={PATHS.CLINIC_DASHBOARD}>
          <Image src={ClinusLogo} alt='logo' h={51} fit='contain' />
        </Link>

        <MdOutlineMenuOpen size={35} />
        {/* <p className='text-14 mb-3'>Phòng khám</p> */}
      </Group>

      <TextInput
        variant="filled"
        placeholder="Tìm kiếm chức năng"
        leftSection={<IoSearch size={20} />}
        radius='md'
        w='100%'
        maw={380}
      />

      <div className='flex flex-1 justify-end items-center'>
        <Menu shadow="md" width={200} position="bottom-end" offset={-3}>
          <Menu.Target>
            <Button variant='transparent' size='sm' c='gray.5' fw={400} radius='md' mx={5}>
              {currentClinic?.name}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <ScrollArea h={300}>
              {listClinic?.map((clinic) => (
                <Menu.Item key={clinic.id} onClick={() => handleChangeClinic(clinic)}>
                  {clinic.name}
                </Menu.Item>
              ))}
            </ScrollArea>
          </Menu.Dropdown>
        </Menu>

        <ActionIcon
          onClick={() => { }}
          mx={5}
          color='primary.3' variant="outline" radius="md" size={35} aria-label="Notifications">
          <Indicator color='secondary.5' inline label={2} size={16}>
            <MdNotificationsNone size={25} />
          </Indicator>
        </ActionIcon>

        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <ActionIcon
              onClick={() => { }}
              mx={5}
              color='primary.3' variant="outline" radius="md" size={35} aria-label="Notifications">
              <CgUser size={25} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Tài khoản</Menu.Label>
            <Menu.Item
              leftSection={<CgProfile size={15} />}
            >
              Thông tin cá nhân
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

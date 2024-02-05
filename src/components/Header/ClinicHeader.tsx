import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/config';
import { useAppDispatch, useAppSelector, useAuth } from '@/hooks';
import { currentClinicSelector, focusModeSelector, listClinicSelector, openSidebarClinicSelector, setCurrentClinic, setUserInfo, toggleSidebarClinic, userInfoSelector } from '@/store';
import { Text, Group, Button, Image, Divider, Menu, TextInput, Flex, ScrollArea, Indicator, ActionIcon, Badge, Title, Tooltip, Kbd, Select, Avatar } from '@mantine/core';
import { useDisclosure, useFullscreen, useNetwork } from '@mantine/hooks';
import ClinusLogo from '@/assets/images/logo.png';
import { IClinic } from '@/types';
import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';
import { IoSearch } from 'react-icons/io5';
import { MdNotificationsNone, MdOutlineHelpOutline, MdOutlineSchedule } from 'react-icons/md';
import { CgLogOut, CgProfile } from 'react-icons/cg';
import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { BsCardText } from "react-icons/bs";
import { BiCollapse, BiExpand } from "react-icons/bi";
import { spotlight } from '@mantine/spotlight';


const ClinicHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const currentClinic = useAppSelector(currentClinicSelector);
  const listClinic = useAppSelector(listClinicSelector);
  const focusMode = useAppSelector(focusModeSelector);
  const isOpenSidebar = useAppSelector(openSidebarClinicSelector);
  const { userInfo } = useAuth();

  const { toggle, fullscreen } = useFullscreen();


  const handleChangeClinic = (clinic: IClinic) => {
    cookies.set(COOKIE_KEY.CURRENT_CLINIC_ID, clinic.id)
    dispatch(setCurrentClinic(clinic));
  }

  const toggleMenu = () => {
    dispatch(toggleSidebarClinic());
  }

  return (
    <header className="h-[60px] flex justify-between items-center pl-3 pr-5 bg-white z-10 
    border-solid border-0 border-b border-gray-300 fixed top-0 right-0 left-0">
      <Flex
        className='transition-all duration-300 ease-in-out'
        w={(isOpenSidebar || focusMode) ? 280 : 220}
        justify={(isOpenSidebar || focusMode) ? 'space-between' : 'flex-end'}
        align='center'
        direction={(isOpenSidebar || focusMode) ? 'row' : "row-reverse"}
        pr={16}>
        <Link className='py-[4px] pr-1 w-fit h-[60px]' to={PATHS.CLINIC_DASHBOARD}>
          <Image src={ClinusLogo} alt='logo' h={51} w={150} fit='contain' />
        </Link>

        {!focusMode &&
          <Tooltip label={isOpenSidebar ? 'Thu gọn menu (Ctrl + M)' : 'Mở rộng menu (Ctrl + M)'}>
            <ActionIcon color='teal.6' variant='transparent' size={45} onClick={toggleMenu}>
              {isOpenSidebar ? <RiMenuFoldFill size={35} /> : <RiMenuUnfoldFill size={35} />}
            </ActionIcon>
          </Tooltip>}
      </Flex>

      {!focusMode && (
        <TextInput
          placeholder="Tìm kiếm"
          leftSection={<IoSearch size={20} />}
          radius='md'
          readOnly
          w='100%'
          onClick={() => spotlight.open()}
          maw={300}
          styles={{
            input: {
              cursor: 'pointer',
              height: '40px',
            },
          }}
          rightSectionWidth={60}
          rightSection={<><Kbd>Ctrl+K</Kbd></>}
        />
      )}

      <div className='flex flex-1 justify-end items-center gap-1'>
        {/* <Divider orientation="vertical" mr={5} />
        <Text size='sm' c='gray.6' mr={5} fw={500}>
          {networkStatus.online ? 'Online' : 'Offline'}
        </Text> */}


        {!focusMode && (<Select
          radius='md'
          size='sm'
          placeholder='Chọn phòng khám'
          value={currentClinic?.id}
          styles={{
            input: {
              height: '40px',
            }
          }}
          onChange={(value) => {
            const clinic = listClinic?.find((clinic) => clinic.id === value);
            if (clinic) {
              handleChangeClinic(clinic);
            }
          }}
          data={listClinic?.map((clinic) => ({ value: clinic.id, label: clinic.name }))}
        />)}

        <Divider orientation="vertical" ml={5} />

        <Tooltip label={fullscreen ? 'Thu nhỏ' : 'Hiển thị toàn màn hình'}>
          <ActionIcon
            onClick={toggle}
            color='gray.9' variant="subtle" radius="md" size={35} aria-label="full-screen">
            {fullscreen ? <BiCollapse size={25} /> : <BiExpand size={25} />}
          </ActionIcon>
        </Tooltip>

        <Tooltip label='Yêu cầu hỗ trợ'>
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
          <Indicator color='secondary.5' inline label={2} size={16} offset={5}>
            <ActionIcon
              onClick={() => { }}
              color='gray.9' variant="subtle" radius="md" size={35} aria-label="Notifications">
              <MdNotificationsNone size={25} />
            </ActionIcon>
          </Indicator>
        </Tooltip>

        <Divider orientation="vertical" ml={5} />

        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Button
              onClick={() => { }}
              mx={5}
              color='black.5' variant="subtle" radius="md"
              leftSection={userInfo?.avatar ? <Avatar src={userInfo?.avatar} size={26} /> : <FaUserCircle size={20} />}
            >
              {userInfo?.firstName} {userInfo?.lastName}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Tài khoản</Menu.Label>
            <Menu.Item
              onClick={() => navigate(PATHS.PROFILE)}
              leftSection={<CgProfile size={15} />}
            >
              Quản lý tài khoản
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

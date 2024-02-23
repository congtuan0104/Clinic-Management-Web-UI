import { COOKIE_KEY } from '@/constants';
import { useAppDispatch, useAppSelector, useAuth } from '@/hooks';
import { setUserInfo, userInfoSelector } from '@/store';
import { cookies, renderSendingTime } from '@/utils';
import { PATHS, onMessageListener, realtimeDB, requestForToken } from '@/config';
import { onValue, ref } from 'firebase/database';



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
  Menu,
  Popover,
  Tooltip,
  Indicator,
  ActionIcon,
} from '@mantine/core';

import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ClinusLogo from '@/assets/images/logo.png'
import classNames from 'classnames';
import { CgLogOut, CgProfile } from 'react-icons/cg';
import { FaUserCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { INotification, IUserInfo } from '@/types';
import { MdNotificationsNone } from 'react-icons/md';

interface IProps {
  userInfo: IUserInfo;
}

// header cho các trang dành cho khách hàng chưa đăng nhập
const Header = ({ userInfo }: IProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [notify, setNotify] = useState<INotification[]>([]);

  useEffect(() => {
    let groupRef = ref(realtimeDB, 'notifications/' + userInfo?.id);
    return onValue(groupRef, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        setNotify(data || [])
      }
      else setNotify([])
    })
  }, [userInfo.id])


  return (
    <Box
      h={60}
      bg='white'
      className={classNames(
        " fixed top-0 inset-x-0 z-10 transition-all duration-300 ease-in-out shadow-lg",
      )}>
      <header className="h-full max-w-screen-xl mx-auto">
        <Group justify="space-between" h="100%">
          <Box w={userInfo ? undefined : 222}>
            <Link to={PATHS.HOME}>
              <Image src={ClinusLogo} alt='logo' h={51} w={150} fit='contain' />
            </Link>
          </Box>

          <Group h="100%" gap={35} visibleFrom="sm">
            <Link className=" hover:text-teal-500" to={PATHS.HOME}>
              Trang chủ
            </Link>
            <Link className=" hover:text-teal-500" to={PATHS.NEWS}>
              Tin tức
            </Link>
            <Link className=" hover:text-teal-500" to={PATHS.CLINICS}>
              Phòng khám
            </Link>
            <Link className=" hover:text-teal-500" to="/dat-lich-hen">
              Đặt lịch khám
            </Link>
            <Link className=" hover:text-teal-500" to={PATHS.PATIENT_CHAT}>
              Tin nhắn
            </Link>
          </Group>

          <div className='flex gap-2'>
            <Popover width={300} position="bottom" withArrow shadow="md" arrowSize={11}>
              <Tooltip label='Thông báo'>
                <Popover.Target>
                  <Indicator color='secondary.5' inline label={notify.length} size={16} offset={5} disabled={notify.length === 0}>
                    <ActionIcon
                      onClick={() => { }}
                      color='gray.9' variant="subtle" radius="md" size={35} aria-label="Notifications">
                      <MdNotificationsNone size={25} />
                    </ActionIcon>
                  </Indicator>
                </Popover.Target>
              </Tooltip>

              <Popover.Dropdown styles={{ dropdown: { padding: 8 } }}>
                <ScrollArea h={500}>
                  <div className="flex flex-col">
                    {notify.length === 0 ? <p>Bạn không có thông báo nào</p> : <></>}
                    {notify.reverse().map((item) => (
                      <div key={item.id}
                        className="flex cursor-pointer p-[6px] rounded-md flex-col group hover:bg-gray-200">
                        <div className='border-solid border-0 border-l-[3px] border-primary-300 pl-2'>
                          {/* <p className='font-semibold group-hover:text-primary-500'>{item.title}</p> */}
                          <p className='text-14 text-gray-700 group-hover:text-black-90 text-justify mt-1'>{item.content}</p>
                          <p className='text-gray-500 text-13'>{renderSendingTime(item.sendingTime)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Popover.Dropdown>
            </Popover>


            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <Button
                  onClick={() => { }}
                  mx={5}
                  h={40}
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
                  onClick={() => logout()}
                  color="red.8"
                  leftSection={<CgLogOut size={15} />}
                >
                  Đăng xuất
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>


        </Group>
      </header>

    </Box >
  );
};

export default Header;

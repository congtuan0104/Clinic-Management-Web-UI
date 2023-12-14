import { ActionIcon, Divider, Image, Modal, rem, ScrollArea, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { CgNotes } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdNotificationsNone, MdOutlineAnalytics, MdOutlinePeopleAlt } from "react-icons/md";
import { RiMessage2Fill } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';

import ClinusLogo from '@/assets/images/logo.png';
import { PATHS } from '@/config';
import { useAuth } from '@/hooks';
import { INotification } from '@/types';

import { LinksGroup } from './LinksGroup/LinksGroup';
import classes from './SideBar.module.css';
import { UserButton } from './UserButton/UserButton';

const mockdata = [
  { label: 'Trang chủ', icon: FaHome, href: '/clinic/dashboard' },
  {
    label: 'Quản trị',
    icon: CgNotes,
    children: [
      { label: 'Overview', link: '#' },
      { label: 'Forecasts', link: '#' },
      { label: 'Outlook', link: '#' },
      { label: 'Real time', link: '#' },
    ],
  },
  {
    label: 'Nhân viên',
    icon: MdOutlinePeopleAlt,
    children: [
      { label: 'Upcoming releases', link: '#' },
      { label: 'Previous releases', link: '#' },
      { label: 'Releases schedule', link: '#' },
    ],
  },
  { label: 'Nhắn tin', icon: RiMessage2Fill, href: '/clinic/messages' },
  { label: 'Thống kê', icon: MdOutlineAnalytics },
  { label: 'Cài đặt', icon: IoSettingsOutline },
];

interface ISidebarProps {
  notify: INotification[];
}

export function ClinicSideBar({ notify }: ISidebarProps) {
  const { pathname } = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const { userInfo } = useAuth();

  const links = mockdata.map((item) => <LinksGroup isActive={item.href === pathname} {...item} key={item.label} />);

  const renderSendingTime = (sendingTime: Date) => {
    const diff = dayjs(dayjs()).diff(sendingTime, 'second');
    if (diff < 60) return `${diff} giây trước`;
    else if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    else if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    else return `${Math.floor(diff / 86400)} ngày trước`;
  }


  return (
    <>
      <nav style={{ position: 'fixed', top: 0, bottom: 0, left: 0 }} className={classes.navbar}>
        <div className='flex flex-between items-center px-1 w-full'>
          <Link className='flex-1 flex justify-start' to={PATHS.CLINIC_DASHBOARD}>
            <Image src={ClinusLogo} alt='logo' h={50} fit='contain' />
          </Link>

          <Tooltip label='Hiển thị thông báo'>
            <ActionIcon
              onClick={() => open()}
              color='primary.5' variant="light" radius="xl" size='xl' aria-label="Notifications">
              <MdNotificationsNone size={25} />
            </ActionIcon>
          </Tooltip>

        </div>

        <Divider />

        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>{links}</div>
        </ScrollArea>

        <div className={classes.footer}>
          <UserButton />
        </div>
      </nav>

      <Modal opened={opened} onClose={close} title={<Text fw={600}>Thông báo của {userInfo?.lastName}</Text>}>
        <div className="flex flex-col">
          {notify.length === 0 && <p>Bạn không có thông báo nào</p>}
          {notify.map((item) => (
            <div key={item.id} className="flex flex-col border-0 border-y border-gray-300 border-solid py-2">
              <p>{item.body}</p>
              <p className='text-primary-300 text-14'>{renderSendingTime(item.sendingTime)}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
export default ClinicSideBar;
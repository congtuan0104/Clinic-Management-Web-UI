import { Group, Code, ScrollArea, rem, Divider, Image, ActionIcon } from '@mantine/core';
import { FaHome, FaRegCalendarAlt } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { MdOutlineAnalytics } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdNotificationsNone } from "react-icons/md";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { LinksGroup } from './LinksGroup/LinksGroup';
import { UserButton } from './UserButton/UserButton';
import classes from './SideBar.module.css';
import { RiMessage2Fill } from 'react-icons/ri';
import { PATHS } from '@/config';
import { Link, useLocation } from 'react-router-dom';
import ClinusLogo from '@/assets/images/logo.png';

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

export function ClinicSideBar() {
  const { pathname } = useLocation();

  const links = mockdata.map((item) => <LinksGroup isActive={item.href === pathname} {...item} key={item.label} />);

  return (
    <nav style={{ position: 'fixed', top: 0, bottom: 0, left: 0 }} className={classes.navbar}>
      <div className='flex flex-between items-center px-1 w-full'>
        <Link className='flex-1 flex justify-start' to={PATHS.CLINIC_DASHBOARD}>
          <Image src={ClinusLogo} alt='logo' h={50} fit='contain' />
        </Link>

        <ActionIcon color='gray.9' variant="subtle" radius="xl" size='xl' aria-label="Notifications">
          <MdNotificationsNone size={25} />
        </ActionIcon>

      </div>

      <Divider />

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton />
      </div>
    </nav>
  );
}
export default ClinicSideBar;
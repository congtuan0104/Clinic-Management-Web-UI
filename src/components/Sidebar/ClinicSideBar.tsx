import { Group, Code, ScrollArea, rem } from '@mantine/core';
import { FaHome, FaRegCalendarAlt } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { MdOutlineAnalytics } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { LinksGroup } from './LinksGroup/LinksGroup';
import { UserButton } from './UserButton/UserButton';
import classes from './SideBar.module.css';

const mockdata = [
  { label: 'Trang chủ', icon: FaHome },
  {
    label: 'Quản trị',
    icon: CgNotes,
    initiallyOpened: true,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Forecasts', link: '/' },
      { label: 'Outlook', link: '/' },
      { label: 'Real time', link: '/' },
    ],
  },
  {
    label: 'Nhân viên',
    icon: MdOutlinePeopleAlt,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
  { label: 'Thống kê', icon: MdOutlineAnalytics },
  { label: 'Cài đặt', icon: IoSettingsOutline },
];

export function ClinicSideBar() {
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
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
import { ActionIcon, Divider, Image, Indicator, Modal, rem, ScrollArea, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { CgNotes } from "react-icons/cg";
import { FaHome, FaHospitalUser } from "react-icons/fa";
import { LuWarehouse } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { MdNotificationsNone, MdOutlineAnalytics, MdOutlinePeopleAlt, MdOutlineSchedule, MdPayment } from "react-icons/md";
import { RiMessage2Fill } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { INotification } from '@/types';

import { LinksGroup } from './LinksGroup/LinksGroup';
import { PATHS } from '@/config';

const createMenuItem = () => {
  return [
    { label: 'Trang chủ', icon: FaHome, href: PATHS.CLINIC_DASHBOARD },
    {
      label: 'Quản trị',
      icon: CgNotes,
      children: [
        { label: 'Thông tin phòng khám', href: PATHS.CLINIC_INFO_MANAGEMENT },
        { label: 'Tin tức, quảng cáo', href: '#' },
      ],
    },
    {
      label: 'Nhân viên',
      icon: MdOutlinePeopleAlt,
      children: [
        { label: 'Danh sách nhân viên', href: '#' },
        { label: 'Vai trò nhân viên', href: PATHS.ROLE_MANAGEMENT },
      ],
    },
    { label: 'Nhắn tin tư vấn', icon: RiMessage2Fill, href: PATHS.CLINIC_CHAT },
    { label: 'Bệnh nhân', icon: FaHospitalUser },
    { label: 'Lịch hẹn khám', icon: MdOutlineSchedule },
    { label: 'Tiếp nhận bệnh nhân', icon: MdOutlineAnalytics },
    { label: 'Khám bệnh', icon: MdOutlineAnalytics },
    { label: 'Thanh toán', icon: MdPayment },
    { label: 'Kho hàng, vật tư', icon: LuWarehouse },
    { label: 'Thống kê báo cáo', icon: MdOutlineAnalytics },
    { label: 'Cài đặt', icon: IoSettingsOutline },
  ]
}

interface ISidebarProps {
  notify: INotification[];
}

export function ClinicSideBar({ notify }: ISidebarProps) {
  const { pathname } = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const { userInfo } = useAuth();

  const menuItems = createMenuItem(); // fix lỗi import config path

  const links = menuItems.map((item) =>
    <LinksGroup {...item} key={item.label} />
  );

  const renderSendingTime = (sendingTime: Date) => {
    const diff = dayjs(dayjs()).diff(sendingTime, 'second');
    if (diff < 60) return `${diff} giây trước`;
    else if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    else if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    else return `${Math.floor(diff / 86400)} ngày trước`;
  }


  return (
    <>
      <nav
        className='bg-white pt-[60px] h-screen w-[280px] fixed top-0 bottom-0 left-0 z-[9]'
      >
        {/* <div className='flex flex-between items-center pl-3 w-full'>
          <Link className='flex-1 flex justify-start py-[4px]' to={PATHS.CLINIC_DASHBOARD}>
            <Image src={ClinusLogo} alt='logo' h={51} fit='contain' />
          </Link>

          <Tooltip label='Hiển thị thông báo'>
            <ActionIcon
              onClick={() => open()}
              color='primary.5' variant="light" radius="xl" size='xl' aria-label="Notifications">
              <Indicator color='secondary.5' inline label={notify.length} size={16}>
                <MdNotificationsNone size={25} />
              </Indicator>
            </ActionIcon>
          </Tooltip>

        </div>

        <Divider /> */}

        <ScrollArea>
          <div>{links}</div>
        </ScrollArea>
      </nav>

      <Modal opened={opened} onClose={close} title={<Text fw={600}>Thông báo của {userInfo?.lastName}</Text>}>
        <div className="flex flex-col">
          {notify.length === 0 && <p>Bạn không có thông báo nào</p>}
          {notify.reverse().map((item) => (
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
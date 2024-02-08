import { ActionIcon, Divider, Image, Indicator, Modal, rem, ScrollArea, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { CgNotes } from "react-icons/cg";
import { FaHome, FaHospitalUser } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";
import { MdCalendarMonth, MdNotificationsNone, MdOutlineAnalytics, MdOutlineMedicalServices, MdOutlinePeopleAlt, MdOutlineSchedule, MdPayment } from "react-icons/md";
import { RiMessage2Fill, RiUserReceived2Line } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useAuth } from '@/hooks';
import { INotification } from '@/types';

import { LinksGroup } from './LinksGroup/LinksGroup';
import { PATHS } from '@/config';
import classNames from 'classnames';
import { openSidebarClinicSelector } from '@/store';
import { FaBedPulse } from 'react-icons/fa6';

const createMenuItem = () => {
  return [
    { label: 'Tổng quan', icon: FaHome, href: PATHS.CLINIC_DASHBOARD },
    {
      label: 'Quản trị',
      icon: CgNotes,
      children: [
        { label: 'Thông tin phòng khám', href: PATHS.CLINIC_INFO_MANAGEMENT },
        { label: 'Danh mục, phân loại', href: PATHS.CLINIC_CATEGORY },
        { label: 'Bảng giá dịch vụ', href: PATHS.CLINIC_SERVICE },
        { label: 'Tin tức, quảng cáo', href: PATHS.CLINIC_NEWS },
      ],
    },
    {
      label: 'Nhân viên',
      icon: MdOutlinePeopleAlt,
      children: [
        { label: 'Danh sách nhân viên', href: PATHS.CLINIC_STAFF_MANAGEMENT },
        { label: 'Vai trò nhân viên', href: PATHS.ROLE_MANAGEMENT },
      ],
    },
    { label: 'Bệnh nhân', icon: FaHospitalUser, href: PATHS.CLINIC_PATIENT_MANAGEMENT },
    { label: 'Lịch hẹn khám', icon: MdCalendarMonth, href: PATHS.CLINIC_APPOINTMENT },
    { label: 'Tiếp nhận bệnh nhân', icon: RiUserReceived2Line, href: PATHS.CLINIC_RECEPTION },
    {
      label: 'Khám bệnh',
      icon: FaBedPulse,
      children: [
        { label: 'Thăm khám', href: PATHS.CLINIC_EXAMINATION },
        { label: 'Thực hiện dịch vụ', href: PATHS.CLINIC_SERVICE_EXECUTION },
      ],
    },
    // { label: 'Thực hiện dịch vụ', icon: MdOutlineMedicalServices, href: PATHS.CLINIC_SERVICE_EXECUTION },
    { label: 'Thanh toán', icon: MdPayment, href: PATHS.EXAMINATION_INVOICE },
    { label: 'Nhắn tin tư vấn', icon: RiMessage2Fill, href: PATHS.CLINIC_CHAT },
    {
      label: 'Kho thuốc, vật tư',
      icon: GiMedicines,
      children: [
        { label: 'Danh sách vật tư', href: PATHS.CLINIC_SUPPLIES },
        { label: 'Nhập hàng', href: '#' },
        { label: 'Thuốc', href: '#' },
      ],
    },
    { label: 'Thống kê báo cáo', icon: MdOutlineAnalytics, href: PATHS.CLINIC_REPORT },
    { label: 'Cài đặt', icon: IoSettingsOutline },
  ]
}

export function ClinicSideBar() {
  const { pathname } = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const { userInfo } = useAuth();
  const isOpenSidebar = useAppSelector(openSidebarClinicSelector);


  const menuItems = createMenuItem(); // fix lỗi import config path

  return (
    <>
      <nav className={classNames(
        'bg-white pt-[60px] h-screen w-[280px] fixed top-0 bottom-0 left-0 z-[9] transition-all duration-300 ease-in-out  overflow-x-hidden',
        isOpenSidebar ? 'w-[280px]' : 'w-[60px]'
      )}     >
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

        <ScrollArea scrollbars="y">
          <div>
            {menuItems.map((item) =>
              <LinksGroup {...item} key={item.label} />
            )}
          </div>
        </ScrollArea>
      </nav>

      <Modal opened={opened} onClose={close} title={<Text fw={600}>Thông báo của {userInfo?.lastName}</Text>}>

      </Modal>
    </>
  );
}
export default ClinicSideBar;
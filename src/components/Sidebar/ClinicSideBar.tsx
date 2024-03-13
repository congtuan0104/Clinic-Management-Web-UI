import { ActionIcon, Divider, Image, Indicator, Modal, rem, ScrollArea, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { CgNotes } from "react-icons/cg";
import { FaHome, FaHospitalUser } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { IoNewspaperOutline, IoSettingsOutline } from "react-icons/io5";
import { MdCalendarMonth, MdNotificationsNone, MdOutlineAnalytics, MdOutlineMedicalServices, MdOutlinePeopleAlt, MdOutlineSchedule, MdPayment } from "react-icons/md";
import { RiMessage2Fill, RiUserReceived2Line } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useAuth } from '@/hooks';
import { INotification } from '@/types';

import { LinksGroup } from './LinksGroup/LinksGroup';
import { PATHS } from '@/config';
import classNames from 'classnames';
import { openSidebarClinicSelector, staffPermissionSelector } from '@/store';
import { FaBedPulse, FaUserDoctor } from 'react-icons/fa6';
import { PERMISSION } from '@/enums';

const createMenuItem = (permissions: PERMISSION[]) => {
  return [
    { label: 'Tổng quan', icon: FaHome, href: PATHS.CLINIC_DASHBOARD },
    {
      label: 'Quản trị',
      icon: CgNotes,
      children: [
        { label: 'Thông tin phòng khám', href: PATHS.CLINIC_INFO_MANAGEMENT, hidden: !permissions.includes(PERMISSION.CLINIC_INFO) },
        { label: 'Danh mục, phân loại', href: PATHS.CLINIC_CATEGORY, hidden: !permissions.includes(PERMISSION.CATEGORY_TYPE) },
        { label: 'Bảng giá dịch vụ', href: PATHS.CLINIC_SERVICE, hidden: !permissions.includes(PERMISSION.SERVICE_PRICE) },
      ],
      hidden: !permissions.some(p => [PERMISSION.CLINIC_INFO, PERMISSION.CATEGORY_TYPE, PERMISSION.SERVICE_PRICE].includes(p))
    },
    {
      label: 'Nhân viên',
      icon: FaUserDoctor,
      children: [
        { label: 'Danh sách nhân viên', href: PATHS.CLINIC_STAFF_MANAGEMENT },
        { label: 'Vai trò nhân viên', href: PATHS.ROLE_MANAGEMENT },
      ],
      hidden: !permissions.includes(PERMISSION.STAFF)
    },
    {
      label: 'Bệnh nhân',
      icon: FaHospitalUser,
      href: PATHS.CLINIC_PATIENT_MANAGEMENT,
      hidden: !permissions.includes(PERMISSION.PATIENT_INFO)
    },
    {
      label: 'Lịch hẹn khám',
      icon: MdCalendarMonth,
      href: PATHS.CLINIC_APPOINTMENT,
      hidden: !permissions.includes(PERMISSION.APPOINTMENT)
    },
    {
      label: 'Tiếp nhận bệnh nhân',
      icon: RiUserReceived2Line, href: PATHS.CLINIC_RECEPTION,
      hidden: !permissions.includes(PERMISSION.RECEPTION)
    },
    {
      label: 'Khám bệnh',
      icon: FaBedPulse,
      children: [
        { label: 'Thăm khám', href: PATHS.CLINIC_EXAMINATION },
        { label: 'Thực hiện dịch vụ', href: PATHS.CLINIC_SERVICE_EXECUTION },
      ],
    },
    // { label: 'Thực hiện dịch vụ', icon: MdOutlineMedicalServices, href: PATHS.CLINIC_SERVICE_EXECUTION },
    {
      label: 'Thanh toán',
      icon: MdPayment,
      href: PATHS.EXAMINATION_INVOICE,
      hidden: !permissions.includes(PERMISSION.INVOICE)
    },
    {
      label: 'Nhắn tin tư vấn',
      icon: RiMessage2Fill,
      href: PATHS.CLINIC_CHAT
    },
    {
      label: 'Vật tư y tế',
      icon: GiMedicines,
      href: PATHS.CLINIC_SUPPLIES,
      hidden: !permissions.includes(PERMISSION.SUPPLIES)
    },
    {
      label: 'Tin tức, quảng cáo',
      icon: IoNewspaperOutline,
      href: PATHS.CLINIC_NEWS,
      hidden: !permissions.includes(PERMISSION.NEWS_AD)
    },
    {
      label: 'Thống kê báo cáo',
      icon: MdOutlineAnalytics,
      href: PATHS.CLINIC_REPORT,
      hidden: !permissions.includes(PERMISSION.REPORT)
    },
    { label: 'Cài đặt', icon: IoSettingsOutline },
  ]
}

export function ClinicSideBar() {
  const { pathname } = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const { userInfo } = useAuth();
  const isOpenSidebar = useAppSelector(openSidebarClinicSelector);
  const permissions = useAppSelector(staffPermissionSelector);

  const menuItems = createMenuItem(permissions);

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

        <ScrollArea scrollbars="y" type='auto'>
          {menuItems.map((item) =>
            <LinksGroup {...item} key={item.label} />
          )}
        </ScrollArea>
      </nav>

      <Modal opened={opened} onClose={close} title={<Text fw={600}>Thông báo của {userInfo?.lastName}</Text>}>

      </Modal>
    </>
  );
}
export default ClinicSideBar;
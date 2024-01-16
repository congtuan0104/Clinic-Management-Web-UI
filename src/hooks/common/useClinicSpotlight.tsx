import { FaHome } from 'react-icons/fa';
import { useMemo } from "react"
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/config';
import { MdOutlineSchedule } from 'react-icons/md';
import { RiGroupFill, RiMessage2Fill } from 'react-icons/ri';
import { BsCardText } from 'react-icons/bs';
import { TbUsersGroup } from 'react-icons/tb';
import { useAuth } from '..';
import { CgLogOut } from 'react-icons/cg';

const useClinicSpotlight = () => {
  const navigate = useNavigate()
  const { logout } = useAuth();

  const actions = useMemo(() => {
    return [
      {
        id: 'home',
        label: 'Dashboard',
        description: 'Hiển thị thông tin tổng quan về phòng khám',
        onClick: () => navigate(PATHS.CLINIC_DASHBOARD),
        leftSection: <FaHome size={20} />,
      },
      {
        id: 'appointment',
        label: 'Lịch hẹn khám',
        description: 'Xem lịch hẹn khám',
        onClick: () => navigate(PATHS.CLINIC_APPOINTMENT),
        leftSection: <MdOutlineSchedule size={20} />,
      },
      {
        id: 'staff_list',
        label: 'Nhân viên',
        description: 'Xem danh sách nhân viên trong phòng khám',
        onClick: () => navigate(PATHS.CLINIC_STAFF_MANAGEMENT),
        leftSection: <RiGroupFill size={20} />,
      },
      {
        id: 'role_management',
        label: 'Vai trò',
        description: 'Xem vai trò của nhân viên trong phòng khám',
        onClick: () => navigate(PATHS.ROLE_MANAGEMENT),
        leftSection: <TbUsersGroup size={20} />,
      },
      {
        id: 'plan_management',
        label: 'Quản lý gói',
        description: 'Xem thông tin gói dịch vụ mà bạn sở hữu',
        onClick: () => navigate(PATHS.PLAN_MANAGEMENT),
        leftSection: <BsCardText size={20} />,
      },
      {
        id: 'chat',
        label: 'Nhắn tin, tư vấn',
        description: 'Nhắn tin, tư vấn trực tiếp với bệnh nhân',
        onClick: () => navigate(PATHS.CLINIC_CHAT),
        leftSection: <RiMessage2Fill size={20} />,
      },
      {
        id: 'logout',
        label: 'Đăng xuất',
        description: 'Đăng xuất khỏi hệ thống',
        onClick: () => logout(),
        leftSection: <CgLogOut size={20} />,
      }
    ]
  }, [])

  return {
    actions,
  }
}

export default useClinicSpotlight

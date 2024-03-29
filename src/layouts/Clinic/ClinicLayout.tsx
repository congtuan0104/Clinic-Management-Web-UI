import { ClinicHeader, ClinicSideBar } from '@/components';
import { PATHS, onMessageListener, realtimeDB, requestForToken } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { AuthModule, CLINIC_SUBSCRIPTION_STATUS, PERMISSION } from '@/enums';
import { useAppDispatch, useAppSelector, useAuth } from '@/hooks';
import { clinicApi, notificationApi, staffApi } from '@/services';
import { currentClinicSelector, focusModeSelector, openSidebarClinicSelector, setCurrentClinic, setStaffPermission, setListClinics, toggleSidebarClinic, setStaffInfo } from '@/store';
import { INotification } from '@/types';
import { cookies } from '@/utils';
import { Title, Text, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import classNames from 'classnames';
import { onValue, ref } from 'firebase/database';
import { MessagePayload } from 'firebase/messaging';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { BiSearch } from 'react-icons/bi';
import { FaHome } from 'react-icons/fa';
import { MdOutlineSchedule } from 'react-icons/md';
import useClinicSpotlight from '@/hooks/common/useClinicSpotlight';
import { useHotkeys } from '@mantine/hooks';

const ClinicLayout = ({ children }: { children: JSX.Element }) => {
  const { userInfo } = useAuth();
  const { actions } = useClinicSpotlight();
  const [notify, setNotify] = useState<INotification[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const focusMode = useAppSelector(focusModeSelector);
  const isOpenSidebar = useAppSelector(openSidebarClinicSelector);
  const location = useLocation();
  const currentClinic = useAppSelector(currentClinicSelector);

  const { data: clinics, isLoading: isLoadingClinic } = useQuery(
    ['clinics', userInfo?.id],
    () => clinicApi.getClinics({
      ownerId: userInfo?.moduleId === AuthModule.ClinicOwner ? userInfo?.id : undefined,
      suid: userInfo?.moduleId === AuthModule.ClinicStaff ? userInfo?.id : undefined,

    }).then(res => res.data),
    {
      enabled: !!userInfo?.id,
      refetchOnWindowFocus: false,
    }
  );

  const listActiveClinics = clinics?.filter(
    (clinic) => clinic.subscriptions &&
      clinic.subscriptions[0].status === CLINIC_SUBSCRIPTION_STATUS.ACTIVE
  );

  const setCurrentStaffInfo = async (clinicId: string, userId: string) => {
    const res = await staffApi.getStaffs({
      clinicId,
      userId,
    })

    if (res.data && res.data.length > 0) {
      const staff = res.data[0];
      const permissions: number[] = staff.role.permissions.map((p) => p.id);
      dispatch(setStaffInfo(staff))
      dispatch(setStaffPermission(permissions));
    }
  }

  useEffect(() => {
    if (userInfo?.moduleId !== AuthModule.ClinicOwner && userInfo?.moduleId !== AuthModule.ClinicStaff) {
      navigate(PATHS.HOME, { replace: true });
    }

    if (!isLoadingClinic
      && (!listActiveClinics || listActiveClinics.length === 0)
      && location.pathname !== PATHS.PLAN_MANAGEMENT) {
      navigate(PATHS.PLAN_MANAGEMENT, { replace: true });
    }
  }, [userInfo, navigate, clinics, isLoadingClinic]);

  useEffect(() => {
    let groupRef = ref(realtimeDB, 'notifications/' + userInfo?.id);
    return onValue(groupRef, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        setNotify(data || [])
      }
      else setNotify([])
    })
  }, [userInfo?.id])

  useEffect(() => {
    if (!isLoadingClinic) {
      const curClinicId = cookies.get(COOKIE_KEY.CURRENT_CLINIC_ID)?.toString();
      const listActiveClinics = clinics?.filter(
        (clinic) => clinic.subscriptions &&
          clinic.subscriptions[0].status === CLINIC_SUBSCRIPTION_STATUS.ACTIVE
          && clinic.isActive
      );
      const curClinic = listActiveClinics?.find((clinic) => clinic.id == curClinicId) || listActiveClinics?.[0];
      cookies.set(COOKIE_KEY.CURRENT_CLINIC_ID, curClinic?.id || '');
      dispatch(setListClinics(listActiveClinics || []))
      dispatch(setCurrentClinic(curClinic))
      if (curClinic && userInfo) {
        setCurrentStaffInfo(curClinic.id, userInfo.id)
      }

    }
  }, [isLoadingClinic])

  useHotkeys([
    ['ctrl+M', () => dispatch(toggleSidebarClinic())],
    ['ctrl+K', () => spotlight.open()],
  ]);


  return (
    <>
      <main className='bg-primary-0 min-h-screen relative'>
        <ClinicHeader notify={notify} />
        {!focusMode && <ClinicSideBar />}
        <div className={classNames(
          'pt-[60px] transition-all duration-300 ease-in-out',
          focusMode ? 'pl-0' : isOpenSidebar ? 'pl-[280px]' : 'pl-[70px]',
        )}>
          {children}
        </div>
      </main>

      <Spotlight
        actions={actions}
        nothingFound="Không tìm thấy chức năng"
        highlightQuery
        radius='md'
        shortcut="ctrl + K"
        searchProps={{
          leftSection: <BiSearch size={20} />,
          placeholder: 'Nhập chức năng mà bạn muốn tìm kiếm',
        }}
      />
    </>
  );
};

export default ClinicLayout;

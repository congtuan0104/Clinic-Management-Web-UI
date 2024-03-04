import { ClinicHeader, ClinicSideBar } from '@/components';
import { PATHS, onMessageListener, realtimeDB, requestForToken } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { AuthModule, CLINIC_SUBSCRIPTION_STATUS, PERMISSION } from '@/enums';
import { useAppDispatch, useAppSelector, useAuth } from '@/hooks';
import { clinicApi, notificationApi, staffApi } from '@/services';
import { focusModeSelector, openSidebarClinicSelector } from '@/store';
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
    </>
  );
};

export default ClinicLayout;

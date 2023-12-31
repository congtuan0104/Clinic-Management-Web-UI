import { ClinicHeader, ClinicSideBar } from '@/components';
import { PATHS, onMessageListener, realtimeDB, requestForToken } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { AuthModule, CLINIC_SUBSCRIPTION_STATUS } from '@/enums';
import { useAppDispatch, useAppSelector, useAuth } from '@/hooks';
import { clinicApi, notificationApi } from '@/services';
import { focusModeSelector, setCurrentClinic, setListClinics } from '@/store';
import { INotification } from '@/types';
import { cookies } from '@/utils';
import { Title, Text, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import classNames from 'classnames';
import { onValue, ref } from 'firebase/database';
import { MessagePayload } from 'firebase/messaging';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

const ClinicLayout = ({ children }: { children: JSX.Element }) => {
  const { userInfo } = useAuth();
  const [notify, setNotify] = useState<INotification[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const focusMode = useAppSelector(focusModeSelector);

  const { data: clinics, isLoading: isLoadingClinic } = useQuery(
    ['clinics', userInfo?.id],
    () => clinicApi.getClinicsByOwner(userInfo?.id).then(res => res.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (userInfo?.moduleId !== AuthModule.Clinic) {
      navigate(PATHS.HOME, { replace: true });
    }
  }, [userInfo, navigate]);

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
      );
      const curClinic = listActiveClinics?.find((clinic) => clinic.id == curClinicId) || listActiveClinics?.[0];
      cookies.set(COOKIE_KEY.CURRENT_CLINIC_ID, curClinic?.id || '');
      dispatch(setListClinics(listActiveClinics || []))
      dispatch(setCurrentClinic(curClinic))
    }
  }, [isLoadingClinic])


  return (
    <>
      <main className='bg-primary-0 min-h-screen relative'>
        <ClinicHeader />
        {!focusMode && <ClinicSideBar notify={notify} />}
        <div className={classNames(
          'pt-[60px]',
          focusMode ? 'pl-0' : 'pl-[280px]',
        )}>
          {children}
        </div>
      </main>
    </>
  );
};

export default ClinicLayout;

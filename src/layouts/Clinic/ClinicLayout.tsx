import { ClinicHeader, ClinicSideBar } from '@/components';
import { PATHS, onMessageListener, realtimeDB, requestForToken } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { AuthModule } from '@/enums';
import { useAppDispatch, useAuth } from '@/hooks';
import { clinicApi, notificationApi } from '@/services';
import { setCurrentClinic, setListClinics } from '@/store';
import { INotification } from '@/types';
import { cookies } from '@/utils';
import { Title, Text, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
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

  const { data: clinics, isLoading: isLoadingClinic } = useQuery(
    ['clinics', userInfo?.id],
    () => clinicApi.getClinicsByOwner(userInfo?.id).then(res => res.data)
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
      const curClinic = clinics?.find((clinic) => clinic.id == curClinicId) || clinics?.[0];
      dispatch(setListClinics(clinics || []))
      dispatch(setCurrentClinic(curClinic))
    }
  }, [isLoadingClinic])


  return (
    <>
      <ClinicSideBar notify={notify} />
      <main style={{ marginLeft: '280px' }} className='bg-primary-0 min-h-screen  '>
        <ClinicHeader />
        <div className='pt-[60px]'>
          {children}
        </div>
      </main>
    </>
  );
};

export default ClinicLayout;

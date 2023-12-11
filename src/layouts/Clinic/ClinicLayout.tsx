import { ClinicHeader, ClinicSideBar } from '@/components';
import { onMessageListener, realtimeDB, requestForToken } from '@/config';
import { useAuth } from '@/hooks';
import { INotification } from '@/types';
import { Title, Text, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { onValue, ref } from 'firebase/database';
import { MessagePayload } from 'firebase/messaging';
import { useEffect, useState } from 'react';

const ClinicLayout = ({ children }: { children: JSX.Element }) => {
    const { userInfo } = useAuth();
    const [userNotice, setUserNotice] = useState<INotification[]>([]);

    requestForToken();
    onMessageListener()
        .then((payload) => {
            notifications.show({
                message: <>
                    <Title>{payload?.notification?.title}</Title>
                    <Text>{payload?.notification?.body}</Text>
                </>,
                color: 'blue',
            });
        })
        .catch((err) => console.log('Get firebase message failed: ', err));

    useEffect(() => {
        let groupRef = ref(realtimeDB, 'notifications/' + userInfo?.id);
        return onValue(groupRef, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setUserNotice(data || [])
            }
            else setUserNotice([])
        })

    }, [userInfo?.id])

    return (

        <>
            <ClinicSideBar />
            <main style={{ marginLeft: '280px' }} className='bg-primary-0'>
                {children}
            </main>
        </>
    );
};

export default ClinicLayout;

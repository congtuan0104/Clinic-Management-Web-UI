import { useEffect, useMemo, useState } from 'react';
import {
    Flex,
    Button,
    ActionIcon,
    Title,
    Text,
    Badge,
    Group,
} from '@mantine/core';
import { IClinic, INotification } from '@/types';
import { renderSendingTime } from '@/utils';
import { realtimeDB } from '@/config';
import { onValue, ref } from 'firebase/database';
import { useAuth } from '@/hooks';

const NotificationPage = () => {
    const [notify, setNotify] = useState<INotification[]>([]);
    const { userInfo } = useAuth();

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
    return (
        <div className="mt-6 ml-4 mr-4">
            <Group justify='space-between'>
                <Text fw={700} pb={15} size='20px'>Thông báo</Text>
            </Group>
            <div className='flex flex-col bg-white p-3 rounded-xl border border-solid border-gray-300'>
            {notify.length === 0 ? <p>Bạn không có thông báo nào</p> : <></>}
            {notify.reverse().map((item) => (
                <div key={item.id}
                    className="flex cursor-pointer p-[6px] rounded-md flex-col group hover:bg-gray-200">
                    <div className='border-solid border-0 border-l-[3px] border-primary-300 pl-2'>
                        <p className='text-14 text-gray-700 group-hover:text-black-90 text-justify mt-1'>{item.content}</p>
                        <p className='text-gray-500 text-13'>{renderSendingTime(item.sendingTime)}</p>
                    </div>
                </div>
            ))}
            </div>
            
        </div>
    )
};

export default NotificationPage;

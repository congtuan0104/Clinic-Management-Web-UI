import React, { useState } from "react";
import { randomId } from '@mantine/hooks';
import { Pagination, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { INotification } from '@/types';

interface ISidebarProps {
    notify: INotification[];
}


function chunk<T>(array: T[], size: number): T[][] {
    if (!array || !array.length) {
        return [];
    }

    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
}


const mockNotifications = [
    { id: 1, body: 'Notification 1 body', sendingTime: dayjs().subtract(1, 'hour').toDate() },
    { id: 2, body: 'Notification 2 body', sendingTime: dayjs().subtract(1, 'day').toDate() },
    { id: 3, body: 'Notification 1 body', sendingTime: dayjs().subtract(1, 'hour').toDate() },
    { id: 4, body: 'Notification 2 body', sendingTime: dayjs().subtract(1, 'day').toDate() },
    { id: 5, body: 'Notification 1 body', sendingTime: dayjs().subtract(1, 'hour').toDate() },
    { id: 6, body: 'Notification 2 body', sendingTime: dayjs().subtract(1, 'day').toDate() },
    { id: 7, body: 'Notification 1 body Notification 1 body Notification 1 body Notification 1 body Notification 1 body', sendingTime: dayjs().subtract(1, 'hour').toDate() },
    { id: 8, body: 'Notification 2 body', sendingTime: dayjs().subtract(1, 'day').toDate() },
    { id: 9, body: 'Notification 1 body', sendingTime: dayjs().subtract(1, 'hour').toDate() },
    { id: 10, body: 'Notification 2 body', sendingTime: dayjs().subtract(1, 'day').toDate() },
    { id: 11, body: 'Notification 1 body', sendingTime: dayjs().subtract(1, 'hour').toDate() },
    { id: 12, body: 'Notification 2 body', sendingTime: dayjs().subtract(1, 'day').toDate() },
    { id: 13, body: 'Notification 1 body', sendingTime: dayjs().subtract(1, 'hour').toDate() },
    { id: 14, body: 'Notification 2 body', sendingTime: dayjs().subtract(1, 'day').toDate() },

];



export default function Notification({ notify }: ISidebarProps) {
    const data = chunk(notify.reverse(), 8);
    const [activePage, setPage] = useState(1);
    const items = data[activePage - 1].map((item) => (
        <div key={item.id} className="flex flex-col border-0 border-b border-gray-300 border-solid py-2">
            <p>{item.body}</p>
            <p className='text-primary-300 text-14'>{renderSendingTime(item.sendingTime)}</p>
        </div>
    ));

    function renderSendingTime(sendingTime: any) {
        if (!sendingTime) {
            return 'Unknown time';
        }
        const diff = dayjs(dayjs()).diff(sendingTime, 'second');
        if (diff < 60) return `${diff} giây trước`;
        else if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        else if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        else return `${Math.floor(diff / 86400)} ngày trước`;
    }

    return (
        <div className="p-5 h-screen overflow-auto">
            <div className="flex justify-between items-center mb-4">
                <Text size={"22px"} fw={700}>
                    Thông báo
                </Text>
            </div>
            <div className="bg-white p-4 rounded-xl border border-solid border-gray-300 h-[94%] flex flex-col">

                <div className="pl-4 flex-grow">
                    {notify.length === 0 && <p>Bạn không có thông báo nào</p>}
                    {items}
                </div>

                <div className="flex justify-end items-end mt-auto">
                    <Pagination total={data.length} value={activePage} onChange={setPage} />
                </div>
            </div>
        </div>
    );
}

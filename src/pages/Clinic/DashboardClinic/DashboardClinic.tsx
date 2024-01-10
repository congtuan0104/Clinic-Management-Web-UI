import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text } from '@mantine/core';

const DashboardAdmin = () => {
  const userInfo = useAppSelector(userInfoSelector);

  return (
    <div className='px-3'>
      <Title ta="center">Dashboard</Title>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className='h-[100px] bg-white rounded-md p-2'>
          Số bệnh nhân đăng ký: 0
        </div>
        <div className='h-[100px] bg-white rounded-md p-2'>
          Số bác sĩ: 0
        </div>
        <div className='h-[100px] bg-white rounded-md p-2'>
          Số lịch hẹn khám hôm nay: 0
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;

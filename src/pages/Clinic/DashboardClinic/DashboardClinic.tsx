import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text } from '@mantine/core';
import { Sparkline } from '@mantine/charts';
import { PATHS } from '@/config';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
  const userInfo = useAppSelector(userInfoSelector);

  return (
    <div className='p-3'>
      <Title mb={15} order={3}>Tổng quan</Title>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[130px]">
        <div className='h-full bg-white rounded-md p-6'>
          Số bệnh nhân đăng ký: 0
        </div>
        <div className='h-full bg-white rounded-md p-6'>
          Số bác sĩ: 0
        </div>
        <div className='h-full bg-white rounded-md p-6'>
          Số lịch hẹn khám hôm nay: 0
        </div>
        <div className='h-full bg-white rounded-md p-6'>
          Số lịch hẹn khám hôm nay: 0
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-2 rounded-md">
          Doanh thu tháng 01/2024
          <Sparkline
            w={'100%'}
            h={400}
            data={[10, 20, 40, 20, 40, 10, 50]}
            curveType="bump"
            color="blue"
            fillOpacity={0.45}
            strokeWidth={1.7}
          />
        </div>
        <div className="col-span-1 p-2 rounded-md bg-white">
          Lịch hẹn khám sắp diễn ra

          <Link to={PATHS.CLINIC_APPOINTMENT} className='text-right ml-auto text-primary-300 hover:text-primary-400'>
            <Text className='text-center'>Xem tất cả lịch hẹn</Text>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;

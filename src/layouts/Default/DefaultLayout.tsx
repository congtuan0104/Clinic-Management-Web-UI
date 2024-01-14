import { useNavigate } from 'react-router-dom';

import { DefaultHeader } from '@/components';
import { Box } from '@mantine/core';

const DefaultLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <Box bg='primary.0' mih='100vh'>
      <DefaultHeader />
      <main className="mx-auto pt-[60px]">{children}</main>

      <footer className="bg-primary-300 text-white text-center py-4 border-t-[1px] border-solid border-gray-300 shadow-md">
        <div className="flex flex-wrap items-center max-w-screen-xl mx-auto justify-center md:justify-between">
          <div className="w-full px-4">
            <div className="text-md font-semibold py-1">
              © 2024 <b>Clinus</b> - Phần mềm hỗ trợ đặt lịch hẹn và quản lý khám chữa bệnh
            </div>
            <div className="text-sm py-1">
              Đồ án tốt nghiệp (K19-K20) - Trường Đại học Khoa học Tự nhiên Tp.HCM
            </div>
          </div>
        </div>
      </footer>
    </Box>
  );
};

export default DefaultLayout;

import { PATHS } from '@/config';
import { Button, Image } from '@mantine/core';
import { IoMdHome } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import FaultyRobotImage from '@/assets/images/faulty_robot.png'
import ClinusLogo from '@/assets/images/logo-2.png';
import { BiArrowBack } from 'react-icons/bi';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen bg-primary-0 flex justify-center items-start flex-col">

      <div className="max-w-screen-lg relative flex flex-col md:flex-row items-center justify-between px-5 mx-auto text-gray-700 bg-white rounded-xl py-10 shadow-md">
        <div className='absolute top-[-80px] left-0 right-0 w-[170px] h-[170px] mx-auto rounded-full outline outline-[6px] outline-primary-0'>
          <Image src={ClinusLogo} alt='logo' h={170} w={170} fit='contain' />
        </div>
        <div className="max-w-lg ml-10">
          <div className="text-7xl font-dark font-bold">404</div>
          <p className="text-2xl md:text-3xl font-light leading-normal mt-2"          >
            Trang không tồn tại
          </p>
          <p className="mb-5 mt-3 text-gray-500">Rất tiếc trang web bạn truy cập không tồn tại. Vui lòng quay lại trang chủ!</p>

          <Button color='teal.6' leftSection={<BiArrowBack size={18} />} onClick={() => navigate(-1)} radius='xl'>
            Quay lại
          </Button>
          <Button color='teal.6' variant='outline' leftSection={<IoMdHome size={18} />} onClick={() => navigate(PATHS.HOME)} radius='xl' ml={10}>
            Về trang chủ
          </Button>
        </div>
        <div className="max-w-md">
          <Image src={FaultyRobotImage} alt='faulty' w={400} fit='contain' />
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;

// import { useQuery } from 'react-query';
import { PATHS } from '@/config';
import { Image, Button, Center, Flex, Stack, Text } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClinusLogo from '@/assets/images/logo-2.png';
import { BiArrowBack, BiMailSend } from 'react-icons/bi';
import { IoMdHome } from 'react-icons/io';
import FaultyRobotImage from '@/assets/images/faulty_robot.png'
import { authApi } from '@/services';




const VerifyAccountPage = () => {
  // get query params from url react router dom
  const [params] = useSearchParams();
  const email = params.get('email');

  const navigate = useNavigate();

  const handleResendVerifyEmail = async () => {
    if (!email) return;
    const res = await authApi.sendVerifyEmail(email);
    console.log(res);
  }

  return (
    <div className="h-screen w-screen bg-primary-0 flex justify-center items-start flex-col">

      <div className="max-w-screen-lg relative flex flex-col md:flex-row items-center justify-between px-5 mx-auto text-gray-700 bg-white rounded-xl py-20 shadow-md border-solid border border-yellow-300">
        <div className='absolute top-[-80px] left-0 right-0 w-[170px] h-[170px] mx-auto rounded-full outline outline-[6px] outline-primary-0'>
          <Image src={ClinusLogo} alt='logo' h={170} w={170} fit='contain' />
        </div>
        <div className="max-w-lg ml-10 flex-1">
          <div className="text-7xl font-dark font-bold">Xin chào</div>
          <p className="text-2xl md:text-3xl font-light leading-normal mt-2"          >
            Chào mừng bạn đến với Clinus
          </p>
          <p className="mb-5 mt-3 text-gray-500">Chúng tôi đã gửi một đường link xác thực đến email
            <span className='text-teal-600'> {email}. </span><br />
            Vui lòng xác thực để tiếp tục sử dụng ứng dụng</p>

          <Button color='gray.3' c='black' leftSection={<IoMdHome size={18} />} onClick={() => navigate(PATHS.HOME)} radius='xl'>
            Về trang chủ
          </Button>
          <Button
            ml={20} color='teal.7' leftSection={<BiMailSend size={18} />} onClick={handleResendVerifyEmail} radius='xl'>
            Gửi lại mail xác thực
          </Button>
        </div>
        <div>
          <Image src='/assets/images/doctor-welcome.png' alt='faulty' w={450} fit='contain' />
        </div>

      </div>

    </div>
  );
};

export default VerifyAccountPage;

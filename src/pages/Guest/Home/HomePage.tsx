import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text, Group, Image, Flex, Stack, Button, Container, Badge, Center, Divider, ThemeIcon, Grid } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { FaArrowLeft, FaArrowRight, FaCheck, FaLink, FaRegNewspaper, FaUsers } from 'react-icons/fa';
import { IoMdPaper } from 'react-icons/io';
import { AiOutlineSchedule } from "react-icons/ai";
import { MdOutlinePayment } from 'react-icons/md';
import { PATHS } from '@/config';
import { PlanCard } from '@/components';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { planApi } from '@/services';
import { BiChevronLeftCircle, BiChevronRightCircle } from 'react-icons/bi';
import { useScrollIntoView } from '@mantine/hooks';



const HomePage = () => {
  const userInfo = useAppSelector(userInfoSelector);

  const { data: plans, isLoading } = useQuery('plans', () => getAllPlans());
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 80,
  });
  const navigate = useNavigate();

  const getAllPlans = async () => {
    try {
      const response = await planApi.getAllPlans();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  const handleBuyPlan = () => {
    navigate(`${PATHS.LOGIN}?callback=${PATHS.PLAN_MANAGEMENT}`)
  }

  return (
    <Stack gap={'xl'} pb={40} w={'100%'} bg='white'>
      <Center className='max-w-screen-xl mx-auto h-[calc(100vh_-_70px)]'>
        <Flex
          pt={30}
          w={'100%'}
          justify="center"
          align="center"
          gap={30}
        >
          <div>
            <Stack gap={'xl'}>
              <Text fz={40} fw={700} w={'95%'}>Phần Mềm Quản Lý Phòng Khám Hiệu Quả</Text>
              <Text fz={16} fw={500} c={'gray.6'}>Với sứ mệnh cải thiện trải nghiệm chăm sóc sức khỏe của người dùng, chúng tôi tự hào giới thiệu một nền tảng độc đáo, giúp bạn dễ dàng quản lý lịch hẹn khám và tận hưởng một dịch vụ y tế chất lượng.</Text>
              <Button onClick={() => scrollIntoView()} size='lg' color='primary' w={250} radius={'xl'}>Xem bảng giá</Button>
            </Stack>
          </div>
          <Image
            radius="lg"
            mah={'74vh'}
            maw={'55%'}
            src="/assets/images/doctor_management.png"
            fallbackSrc="https://placehold.co/200x200?text=Error"
          />
        </Flex>
      </Center>

      <Stack align='center' gap={'xl'} >
        <Center>
          <Stack align='center'>
            <Text size='24px' fw={700} w={'100%'}>Tại sao nên sử dụng Clinus?</Text>
            <Divider size={'md'} color='gray.6' w={'70%'} />
          </Stack>
        </Center>
        <Flex
          w={'100%'}
          gap="xl"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Image
            radius="lg"
            h={300}
            src="https://media.istockphoto.com/id/1468678629/photo/portrait-healthcare-and-tablet-with-a-doctor-woman-at-work-in-a-hospital-for-research-or.webp?b=1&s=170667a&w=0&k=20&c=H9w4bMoP3WXY178SVYmZsZsSCaTJoVLRMnSLPd3L3OE="
            fallbackSrc="https://placehold.co/200x200?text=Error"
          />
          <div>
            <Stack gap={'sm'} ml={20}>
              <Text size='22px' fw={700}>NÂNG CAO HIỆU SUẤT CÔNG VIỆC</Text>
              <Group>
                <FaCheck size="1rem" stroke={1.5} color="#6964FF" />
                <Text ml={5} component='span'>Tăng tốc độ xử lý hồ sơ bệnh án</Text>
              </Group>
              <Group>
                <FaCheck size="1rem" stroke={1.5} color="#6964FF" />
                <Text ml={5} component='span'>Tiết kiệm thời gian. Không trùng lịch khám Hiệu suất không bị gián đoạn.</Text>
              </Group>
              <Group>
                <FaCheck size="1rem" stroke={1.5} color="#6964FF" />
                <Text ml={5} component='span'>Tích hợp đầy đủ tính năng: Quản lý nhân viên, Quản lý phòng khám,…</Text>
              </Group>
            </Stack>

          </div>
        </Flex>
        <Flex
          w={'100%'}
          gap="xl"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <div>
            <Stack gap={'sm'}>
              <Text size='22px' fw={700}>GIẢM CHI PHÍ VẬN HÀNH</Text>
              <Group>
                <FaCheck size="1rem" stroke={1.5} color="#6964FF" />
                <Text ml={5} component='span'>Quản lý phòng khám mọi lúc mọi nơi</Text>
              </Group>
              <Group>
                <FaCheck size="1rem" stroke={1.5} color="#6964FF" />
                <Text ml={5} component='span'>Triển khai cài đặt và vận hành đơn giản, nhanh chóng</Text>
              </Group>
              <Group>
                <FaCheck size="1rem" stroke={1.5} color="#6964FF" />
                <Text ml={5} component='span'>Theo dõi thu chi một cách tự động, hiệu quả và minh bạch</Text>
              </Group>
            </Stack>
          </div>
          <Image
            radius="lg"
            h={300}
            src="https://www.genamet.com/media/1732/clinic-mgt.png"
            fallbackSrc="https://placehold.co/200x200?text=Error"
          />
        </Flex>
      </Stack>
      <Stack className='overflow-hidden max-w-screen-xl mx-auto'>
        <Center p={10} className=''>
          <Stack align='center'>
            <Text size='24px' fw={700} >Tính năng</Text>
            <Divider size={'md'} color='gray.6' w={'70%'} />

          </Stack>
        </Center>
        <Center>
          <Grid w={'100%'} gutter="lg">
            <Grid.Col span={4}>
              <Stack align='center'>
                <FaUsers size="4rem" color='blue' />

                <Group>
                  <Badge color='blue'>01</Badge>
                  <Text c={'blue'}>Hồ sơ sức khỏe</Text>
                </Group>
                <Text ta='center' w={'70%'}>Quản lý hồ sơ sức khỏe của bệnh nhân: huyết áp, mạch, các chỉ định cận lâm sàng, lịch sử khám chữa bệnh ...</Text>
              </Stack>

            </Grid.Col>
            <Grid.Col span={4}>
              <Stack align='center'>
                <IoMdPaper size="4rem" color='red' />
                <Group>
                  <Badge color='red'>02</Badge>
                  <Text c={'red'}>Quản lý nhân viên</Text>
                </Group>
                <Text ta='center' w={'70%'}>Hỗ trợ quản lý thông tin nhân viên, phân quyền,...</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack align='center'>
                <FaLink size="4rem" color='#c688eb' />
                <Group>
                  <Badge color='#c688eb'>03</Badge>
                  <Text c={'#c688eb'}>Kết nối</Text>
                </Group>
                <Text ta='center' w={'70%'} >Kết nối bệnh nhân với bác sĩ, giữa các phòng khám với nhau</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack align='center'>
                <MdOutlinePayment size="4rem" color='orange' />
                <Group>
                  <Badge color='orange'>04</Badge>
                  <Text c={'orange'}>Thanh toán</Text>
                </Group>
                <Text ta='center' w={'70%'}>Hỗ trợ việc thanh toán cho phòng khám qua ZaloPay, VNPAY</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack align='center'>
                <AiOutlineSchedule size="4rem" color='green' />
                <Group>
                  <Badge color='green'>05</Badge>
                  <Text c={'green'}>Lịch hẹn</Text>
                </Group>
                <Text ta='center' w={'70%'}>Dựa theo lịch tái khám và lịch đăng ký khám lần đầu để tổng hợp lịch làm việc hàng ngày của phòng khám.</Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={4}>
              <Stack align='center'>
                <FaRegNewspaper size="4rem" color='#B85B36' />
                <Group>
                  <Badge color='#B85B36'>06</Badge>
                  <Text c={'#B85B36'}>Tin Tức, Quảng cáo</Text>
                </Group>
                <Text ta='center' w={'70%'}>Quản lý, Đăng tải các tin tức quản cáo cho phòng khám</Text>
              </Stack>
            </Grid.Col>

          </Grid>
        </Center>
      </Stack>
      <Center>
        <Stack align='center'>
          <Text ref={targetRef} size='24px' fw={700} w={'100%'}>Bảng giá</Text>
          <Divider size={'md'} color='gray.6' w={'70%'} />
        </Stack>
      </Center>
      <Grid gutter={20} className='max-w-screen-xl mx-auto'>
        {plans && plans.map((plan) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <PlanCard key={plan.id} plan={plan} actionText='Mua gói' action={handleBuyPlan} />
          </Grid.Col>
        ))}
      </Grid>

      <Center>
        <Stack align='center'>
          <Text size='24px' fw={700} w={'100%'}>Một số hình ảnh về ứng dụng</Text>
          <Divider size={'md'} color='gray.6' w={'70%'} />

        </Stack>
      </Center>
      <Flex className='max-w-screen-xl mx-auto'>
        <Carousel
          nextControlIcon={<FaArrowRight size={40} />}
          previousControlIcon={<FaArrowLeft size={40} />}

        >
          <Carousel.Slide>
            <Image mx='auto' radius='lg' className='border border-solid border-primary-300' w={'85%'} h='auto' fit='contain' src='/assets/images/home-banner-1.png' />
          </Carousel.Slide>
          <Carousel.Slide>
            <Image mx='auto' radius='lg' className='border border-solid border-primary-300' w={'85%'} h='auto' fit='contain' src='/assets/images/home-banner-2.png' />
          </Carousel.Slide>
          <Carousel.Slide>
            <Image mx='auto' radius='lg' className='border border-solid border-primary-300' w={'85%'} h='auto' fit='contain' src='/assets/images/home-banner-3.png' />
          </Carousel.Slide>

        </Carousel>
      </Flex>
    </Stack>
  );
};

export default HomePage;

import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text, Group, Image, Flex, Stack, Button, Container, Badge, Center, Divider, ThemeIcon, Grid } from '@mantine/core';
import { FaCheck, FaLink, FaRegNewspaper, FaUsers } from 'react-icons/fa';
import { IoMdPaper } from 'react-icons/io';
import { AiOutlineSchedule } from "react-icons/ai";
import { MdOutlinePayment } from 'react-icons/md';



const HomePage = () => {
  const userInfo = useAppSelector(userInfoSelector);

  return (
    <Stack gap={'xl'} w={'100%'}>
      <Center>
        <Flex
          pt={30}
          w={'100%'}
          justify="center"
          align="center"
        >
          <div>
            <Stack gap={'xl'}>
              <Text size='26px' fw={700} w={'95%'}>CLINICUS - Phần Mềm Việt Nam Quản Lí Phòng Khám Hiệu Quả</Text>
              <Text size='24px' fw={700} c={'primary.3'}>GIÁ CHỈ TỪ 100.000VNĐ/THÁNG</Text>
              <Button w={'50%'} radius={'xl'}>ĐĂNG KÝ NGAY</Button>
            </Stack>
          </div>
          <Image
            radius="lg"
            h={400}
            src="https://healthcaresoftwareguide.files.wordpress.com/2020/06/hospital-and-clinic-management-software.jpg"
            fallbackSrc="https://placehold.co/200x200?text=Error"
          />
        </Flex>
      </Center>
      <Badge w={'108%'} bg={'#081692'} h={50} ml={-60}></Badge>
      <Stack align='center' gap={'xl'} >
        <Center>
          <Stack align='center'>
            <Text size='24px' fw={700} w={'100%'}>CLINUS - SỰ LỰA CHỌN HOÀN HẢO CHO PHÒNG KHÁM CỦA BẠN</Text>
            <Divider size={'lg'} color='black' w={'30%'} />
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
      <Stack>
        <Center m={10}>
          <Stack align='center'>
            <Text size='24px' fw={700} >Phần mềm CLINICUS Quản Lý Phòng Khám 2024</Text>
            <Text size='20px' c={'gray.6'}>5 Tính năng cốt lõi</Text>
          </Stack>
        </Center>
        <Center>
          <Grid w={'100%'} grow gutter="xl">
            <Grid.Col span={4}>
              <Stack align='center'>
                <FaUsers size="4rem" color='blue' />

                <Group>
                  <Badge color='blue'>01</Badge>
                  <Text c={'blue'}>Hồ sơ sức khỏe</Text>
                </Group>
                <Text w={'70%'}>Quản lý hồ sơ sức khỏe của bệnh nhân: huyết áp, mạch, các chỉ định cận lâm sàng, lịch sử khám chữa bệnh ...</Text>
              </Stack>

            </Grid.Col>
            <Grid.Col span={4}>
              <Stack align='center'>
                <IoMdPaper size="4rem" color='red' />
                <Group>
                  <Badge color='red'>02</Badge>
                  <Text c={'red'}>Quản lý nhân viên</Text>
                </Group>
                <Text w={'70%'}>Hỗ trợ quản lý thông tin nhân viên, phân quyền,...</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack align='center'>
                <FaLink size="4rem" color='#c688eb' />
                <Group>
                  <Badge color='#c688eb'>03</Badge>
                  <Text c={'#c688eb'}>Kết nối</Text>
                </Group>
                <Text w={'70%'} >Kết nối bệnh nhân với bác sĩ, giữa các phòng khám với nhau</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack align='center'>
                <MdOutlinePayment size="4rem" color='orange' />
                <Group>
                  <Badge color='orange'>04</Badge>
                  <Text c={'orange'}>Thanh toán</Text>
                </Group>
                <Text w={'70%'}>Hỗ trợ việc thanh toán cho phòng khám qua ZaloPay, VNPAY</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack align='center'>
                <AiOutlineSchedule size="4rem" color='green' />
                <Group>
                  <Badge color='green'>05</Badge>
                  <Text c={'green'}>Lịch hẹn</Text>
                </Group>
                <Text w={'70%'}>Dựa theo lịch tái khám và lịch đăng ký khám lần đầu để tổng hợp lịch làm việc hàng ngày của phòng khám.</Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={4}>
              <Stack align='center'>
                <FaRegNewspaper size="4rem" color='#B85B36' />
                <Group>
                  <Badge color='#B85B36'>06</Badge>
                  <Text c={'#B85B36'}>Tin Tức, Quảng cáo</Text>
                </Group>
                <Text w={'70%'}>Quản lý, Đăng tải các tin tức quản cáo cho phòng khám</Text>
              </Stack>
            </Grid.Col>

          </Grid>
        </Center>
      </Stack>
      <Center>
        <Stack align='center'>
          <Text size='24px' fw={700} w={'100%'}>TIN TỨC</Text>
          <Divider size={'lg'} color='black' w={'100%'} />
        </Stack>
      </Center>
 </Stack>

  );
};

export default HomePage;

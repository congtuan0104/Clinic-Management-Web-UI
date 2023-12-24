import { CurrencyFormatter } from '@/components';
import { PATHS } from '@/config';
import { Image, Title, Text, Flex, Paper, Button } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentResult = () => {
  //http://localhost:5173/thanh-toan/thong-tin-thanh-toan?amount=20000&clinicId=78c4b001-be0c-47df-9ab0-b804f089aadb&status=1
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const amount = searchParams.get('amount');
  const clinicId = searchParams.get('clinicId');
  const status = searchParams.get('status');

  return (
    <Flex justify={'center'} align={'center'} h='100vh'>
      <Paper shadow="xs" p="xl" w={'90%'} maw={'500px'} radius='lg'>
        <Flex direction='column' align='center'>
          {status === '1' ?
            <Image src={'https://logowik.com/content/uploads/images/check-badge8301.logowik.com.webp'} width={'60px'} height={'60px'} />
            :
            <Image src={'https://t3.ftcdn.net/jpg/05/77/95/38/360_F_577953883_zBPvFb7h53kH4EORs7Cy8C1iTlrBP6lQ.jpg'} width={60} height={60} />
          }
          <Title order={4} mb={20}>Thanh toán {status === '1' ? 'thành công' : 'thất bại'}</Title>

          {status === '1' && <Text mb={20}>Bạn đã thanh toán thành công <CurrencyFormatter value={Number(amount)} /></Text>}

          <Button fullWidth color='primary.3' size='lg' radius='md'
            onClick={() => navigate(PATHS.PLAN_MANAGEMENT)}>
            Quay lại trang phòng khám
          </Button>

        </Flex>
      </Paper>
    </Flex>
  );
};

export default PaymentResult;

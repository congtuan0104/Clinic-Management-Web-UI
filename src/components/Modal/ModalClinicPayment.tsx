import { planApi } from '@/services';
import { IClinicWithSubscription } from '@/types';
import { Paper, Text, Group, Avatar, Input, Divider, Button, Flex, Modal, Radio, RadioGroup, Image, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { CurrencyFormatter } from '..';
import { notifications } from '@mantine/notifications';
import { paymentApi } from '@/services/payment.service';
import { PaymentProvider } from '@/enums';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  clinicPayment: IClinicWithSubscription
}

const ModalClinicPayment = ({ isOpen, onClose, clinicPayment }: IProps) => {
  const { clinic, subscription } = clinicPayment; // thông tin phòng khám cần thanh toán

  const { data: plans, isLoading: isLoadingPlan } = useQuery(
    'plans',
    () => planApi.getAllPlans().then(res => res.data)
  );


  const planInfo = plans?.find(plan => plan.id === subscription.planId)

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentProvider>();


  const handlePayment = async () => {
    if (selectedPaymentMethod) {
      if (!planInfo) return;

      const response = await paymentApi.createPaymentRequest({
        totalCost: planInfo.currentPrice,
        provider: selectedPaymentMethod,
        subscribePlanId: subscription.id,
      })

      if (response.status && response.data) {
        window.location.href = response.data; // chuyển hướng sang trang thanh toán (payment gateway)
      }
      else {
        notifications.show({
          message: 'Thanh toán thất bại',
          color: 'red.5',
        })
      }

    } else {
      notifications.show({
        message: 'Vui lòng chọn phương thức thanh toán',
        color: 'orange.5',
      })
    }
  };


  return (
    <Modal.Root opened={isOpen} onClose={onClose} centered size={'lg'}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title fz="lg" fw={600}>Thông tin thanh toán</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <div className='flex bg-slate-300 p-4 rounded-xl mb-5'>
            <div className="flex w-[75%] pr-3 bg-slate-300 items-center">
              <Text>{planInfo?.planName}</Text>
            </div>
            <div className="flex-1 flex flex-col">
              {planInfo?.currentPrice && <Text fw={600}><CurrencyFormatter value={planInfo?.currentPrice} /></Text>}
              <Text>{planInfo?.duration} ngày</Text>
            </div>
          </div>

          <Text pb={5}>Nội dung: Mua gói và khởi tạo phòng khám <b>{clinic.name}</b></Text>
          <Text fw={600} py={10}>Chọn kênh thanh toán</Text>
          <div className='flex justify-between gap-2'>
            <Box className='border border-solid border-blue-500 w-full'>
              <Image
                src="data:image/png;base64,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"
                width={50}
                fit='contain'
                height={50}
                alt="ZaloPay Logo"
              />
            </Box>
            <Box className='border border-solid border-blue-500 w-full'>
              <Image
                src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                width={50}
                height={50}
                fit='contain'
                alt="ZaloPay Logo"
              />
            </Box>
            <Box className='border border-solid border-blue-500 w-full'>
              <Image
                src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                width={50}
                height={50}
                fit='contain'
                alt="ZaloPay Logo"
              />
            </Box>
            <Box className='border border-solid border-blue-500 w-full hover:bg-[#50d71e]'>
              <Image
                src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                width={50}
                height={50}
                fit='contain'
                alt="ZaloPay Logo"
              />
            </Box>


            {/* <Paper
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                cursor: 'pointer',
                color: selectedPaymentMethod === PaymentProvider.ZaloPay ? 'blue' : 'gray',
                border: `1px solid ${selectedPaymentMethod === PaymentProvider.ZaloPay ? 'blue' : 'gray'}`,
                padding: '20px',
              }}
              onClick={() => setSelectedPaymentMethod(PaymentProvider.ZaloPay)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  radius="md"
                  src="data:image/png;base64,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"
                  alt="ZaloPay Logo"
                  style={{ marginRight: '10px' }}
                />
                <Text size='1.5rem'>ZaloPay</Text>
              </div>
            </Paper>


            <Paper
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                cursor: 'pointer',
                color: selectedPaymentMethod === PaymentProvider.VnPay ? 'blue' : 'gray',
                border: `1px solid ${selectedPaymentMethod === PaymentProvider.VnPay ? 'blue' : 'gray'}`,
                padding: '20px',
              }}
              onClick={() => setSelectedPaymentMethod(PaymentProvider.VnPay)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  radius="sm"
                  src="data:image/png;base64,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"
                  alt="VNPay Logo"
                  style={{ marginRight: '10px' }}
                />
                <Text size='1.5rem'>VNPay</Text>
              </div>
            </Paper> */}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button mt="xl" radius="sm" size="md" onClick={handlePayment}>
              Tiến hành thanh toán
            </Button>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default ModalClinicPayment;
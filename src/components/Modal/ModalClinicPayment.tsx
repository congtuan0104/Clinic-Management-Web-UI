import { planApi } from '@/services';
import { IClinicWithSubscription } from '@/types';
import { Paper, Text, Group, Avatar, Input, Divider, Button, Flex, Modal, Radio, RadioGroup, Image, Box, ChipGroup, Chip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { CurrencyFormatter } from '..';
import { notifications } from '@mantine/notifications';
import { paymentApi } from '@/services/payment.service';
import { PaymentProvider } from '@/enums';
import classNames from 'classnames';

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
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
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

          <div className='flex justify-between gap-3'>
            <div
              className={classNames(
                'flex items-center justify-center py-4 border border-solid w-full px-2 cursor-pointer rounded-md',
                selectedPaymentMethod === PaymentProvider.ZaloPay ? 'border-primary-100 bg-primary-100' : 'border-gray-300',
              )}
              onClick={() => setSelectedPaymentMethod(PaymentProvider.ZaloPay)}
            >
              <Image src='https://upload.wikimedia.org/wikipedia/vi/7/77/ZaloPay_Logo.png' width={'auto'} fit="cover" />
            </div>

            <div
              className={classNames(
                'flex items-center gap-2 py-4 border border-solid w-full px-2 cursor-pointer rounded-md',
                selectedPaymentMethod === PaymentProvider.VnPay ? 'border-primary-100 bg-primary-100' : 'border-gray-300',
              )}
              onClick={() => setSelectedPaymentMethod(PaymentProvider.VnPay)}
            >
              <Image src='https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png' width={70} height={35} />
              {/* <Text>VNPay</Text> */}
            </div>

            <div
              className={classNames(
                'flex relative justify-center items-center gap-2 py-4 border border-solid w-full px-2 cursor-pointer rounded-md',
                selectedPaymentMethod === PaymentProvider.ATM ? 'border-primary-100 bg-primary-100' : 'border-gray-300',
              )}
              onClick={() => setSelectedPaymentMethod(PaymentProvider.ATM)}
            >
              <Image src='https://timo.vn/wp-content/uploads/2018/04/card-1673581_1280.png' width={70} height={50} />
              {/* <Text>Thẻ ATM</Text> */}
              <div className="absolute text-white top-[50%] left-0 right-0 text-center mr-6 text-18">ATM</div>
            </div>

            <div
              className={classNames(
                'flex items-center gap-2 py-4 border border-solid w-full px-2 cursor-pointer rounded-md',
                selectedPaymentMethod === PaymentProvider.VISA ? 'border-primary-100 bg-primary-100' : 'border-gray-300',
              )}
              onClick={() => setSelectedPaymentMethod(PaymentProvider.VISA)}
            >
              <Image src='https://vudigital.co/wp-content/uploads/2022/04/8.webp' width={60} height={60} />
              {/* <Text>Thẻ ghi nợ</Text> */}
            </div>
          </div>


          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button mt="xl" size="md" onClick={handlePayment} disabled={!selectedPaymentMethod}>
              Tiến hành thanh toán
            </Button>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default ModalClinicPayment;
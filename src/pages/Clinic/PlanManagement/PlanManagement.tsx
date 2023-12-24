import { Text, Flex, Box, Paper, Title, Button } from '@mantine/core';
import { useState } from 'react';
import PlanCard from '@/components/Card/PlanCard';
import { useQuery } from 'react-query';
import { clinicApi, planApi } from '@/services';
import { IClinic, IClinicWithSubscription, IServicePlan } from '@/types';
import { ModalClinicPayment, ModalCreateNewClinic } from '@/components';
import { useAuth } from '@/hooks';
import dayjs from 'dayjs';
import { renderSubscriptionStatus } from '@/utils/subscription';
import { CLINIC_SUBSCRIPTION_STATUS } from '@/enums';


const ClinicManagePage = () => {
  const { userInfo } = useAuth()
  const { data: clinics, isLoading: isLoadingClinic } = useQuery(
    ['clinics', userInfo?.id],
    () => clinicApi.getClinicsByOwner(userInfo?.id).then(res => res.data)
  );
  const { data: plans, isLoading: isLoadingPlan } = useQuery('plans', () => getAllPlans());
  const [isOpenClinicModal, setIsOpenClinicModal] = useState<boolean>(false);
  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState<boolean>(false);
  const [clinicNeedPayment, setClinicNeedPayment] = useState<IClinicWithSubscription>();  // thông tin phòng khám vừa được tạo (dùng để thanh toán)

  const [selectedPlan, setSelectedPlan] = useState<IServicePlan>();

  const getAllPlans = async () => {
    try {
      const response = await planApi.getAllPlans();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Xử lý khi mua gói dịch vụ
   */
  const handleBuyPlan = (plan: IServicePlan) => {
    setSelectedPlan(plan);
    setIsOpenClinicModal(true);
  }

  const handleCloseModal = () => {
    setIsOpenClinicModal(false);
  }

  const handleCreateClinicSuccess = (clinic: IClinicWithSubscription) => {
    setIsOpenClinicModal(false);
    setClinicNeedPayment(clinic);
    setIsOpenPaymentModal(true);
  }

  const getPlanInfo = (planId: number) => {
    return plans?.find((plan) => plan.id == planId);
  }

  const renderSubscriptionInfo = (clinic: IClinic) => {
    const subscription = clinic.subscriptions ? clinic.subscriptions[0] : null;
    if (!subscription) return null;
    const plan = getPlanInfo(subscription.planId);
    return (
      <>
        <Text tt='uppercase'>
          Gói {plan?.planName}
        </Text>
        {(subscription.status !== CLINIC_SUBSCRIPTION_STATUS.CANCEL && subscription.status !== CLINIC_SUBSCRIPTION_STATUS.INPAYMENT)
          && <Text tt='uppercase'>
            Hết hạn: {dayjs(subscription.expiredAt).format('DD/MM/YYYY')} (Còn {dayjs(subscription.expiredAt).diff(dayjs(), 'day')} ngày)
          </Text>}
        <Text>Trạng thái: {renderSubscriptionStatus(subscription.status)}</Text>
      </>
    )
  }

  return (
    <>
      {clinics && clinics.length > 0 ? (
        <Box px='xl' pt='lg'>
          <Flex justify='space-between'>
            <Title order={4} mb={20}>Danh sách phòng khám</Title>
            <Button
              color='primary'
              onClick={() => setIsOpenClinicModal(true)}
            >
              Thêm phòng khám
            </Button>
          </Flex>
          <Flex direction='column' gap={20}>
            {clinics.map((clinic) => (
              <Paper shadow="xs" radius='md' p='lg'>
                <Text fw='semibold' tt='uppercase'>{clinic.name}</Text>
                <Text>{clinic.address}</Text>
                {renderSubscriptionInfo(clinic)}
              </Paper>
            ))}
          </Flex>
        </Box>
      ) : (<Box>
        <Text ta="center" pt={30} size="xl" fw={600} mb='31.72px' mt='33.48px' c='secondary'>
          Bạn chưa đăng ký phòng khám. Vui lòng chọn mua gói và khởi tạo phòng khám
        </Text>
        <Flex wrap='wrap' my={30} mx={{ base: 15, md: 0 }} gap={20} direction={{ base: 'column', md: 'row' }}>
          {plans && plans.map((plan) => (
            <Box w='350' h='509'>
              <PlanCard key={plan.id} plan={plan} actionText='Mua gói' action={handleBuyPlan} />
            </Box>
          ))}
        </Flex>
      </Box>)}

      <ModalCreateNewClinic
        isOpen={isOpenClinicModal}
        onClose={handleCloseModal}
        selectedPlanId={selectedPlan?.id}
        onSuccess={handleCreateClinicSuccess}
      />

      {clinicNeedPayment && <ModalClinicPayment
        isOpen={isOpenPaymentModal}
        onClose={() => setIsOpenPaymentModal(false)}
        clinicPayment={clinicNeedPayment}
      />}
    </>
  );
}

export default ClinicManagePage;

import { Text, Flex, Box, Paper, Title, Button, Loader, Stack, Badge, ActionIcon } from '@mantine/core';
import { useEffect, useState } from 'react';
import PlanCard from '@/components/Card/PlanCard';
import { useQuery } from 'react-query';
import { clinicApi, planApi } from '@/services';
import { IClinic, IClinicWithSubscription, IServicePlan } from '@/types';
import { ModalClinicPayment, ModalCreateNewClinic } from '@/components';
import { useAppDispatch, useAppSelector, useAuth } from '@/hooks';
import dayjs from 'dayjs';
import { renderSubscriptionStatus } from '@/utils/subscription';
import { CLINIC_SUBSCRIPTION_STATUS } from '@/enums';
import { listClinicSelector, setCurrentClinic, setFocusMode } from '@/store';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline } from 'react-icons/io5';
import { PATHS } from '@/config';
import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';


const ClinicManagePage = () => {
  const { userInfo } = useAuth()
  const dispatch = useAppDispatch();
  // const clinics = useAppSelector(listClinicSelector);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setFocusMode(true));
    return () => {
      dispatch(setFocusMode(false));
    }
  }, [])

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
      <div className='flex flex-col items-end'>
        <Text tt='uppercase'>
          Gói {plan?.planName}
        </Text>
        {(subscription.status !== CLINIC_SUBSCRIPTION_STATUS.NOT_ACTIVE && subscription.status !== CLINIC_SUBSCRIPTION_STATUS.INPAYMENT)
          && <Text>
            Sử dụng đến {dayjs(subscription.expiredAt).format('DD/MM/YYYY')} (Còn {dayjs(subscription.expiredAt).diff(dayjs(), 'day')} ngày)
          </Text>}

        <Badge
          color={subscription.status === CLINIC_SUBSCRIPTION_STATUS.ACTIVE ? 'primary.4'
            : subscription.status === CLINIC_SUBSCRIPTION_STATUS.INPAYMENT ? 'teal.6'
              : subscription.status === CLINIC_SUBSCRIPTION_STATUS.EXPIRED ? 'gray.6'
                : 'error'}
        >
          {renderSubscriptionStatus(subscription.status)}
        </Badge>

      </div>
    )
  }

  const renderAction = (clinic: IClinic) => {
    const subscription = clinic.subscriptions ? clinic.subscriptions[0] : null;
    if (!subscription) return null;

    if (subscription.status === CLINIC_SUBSCRIPTION_STATUS.ACTIVE) return (
      <div
        className='cursor-pointer text-teal-600 hover:text-teal-500'
        onClick={() => {
          cookies.set(COOKIE_KEY.CURRENT_CLINIC_ID, clinic.id)
          dispatch(setCurrentClinic(clinic));
          navigate(PATHS.CLINIC_INFO_MANAGEMENT)
        }}
      >
        Xem chi tiết
      </div>
    )

    if (subscription.status === CLINIC_SUBSCRIPTION_STATUS.EXPIRED) return (
      <div
        className='cursor-pointer text-teal-600 hover:text-teal-500'
        onClick={() => {
          alert('Gia hạn phòng khám')
        }}
      >
        Gia hạn
      </div>
    )
  }

  if ((isLoadingPlan || isLoadingClinic) && !isOpenClinicModal && !isOpenPaymentModal) return (
    <Stack h="90vh" align="center" justify="center">
      <Loader size="xl" />
      <Text size="xl">Đang tải</Text>
    </Stack>)

  return (
    <div className='max-w-screen-md mx-auto pb-3'>
      {clinics && clinics.length > 0 ? (
        <Box px='xl' pt='md'>
          <Flex justify='space-between' align='center' mb={15}>
            <Flex>
              <ActionIcon size='md' radius='xl' mr={5} c='gray.7' variant="subtle" aria-label="Back" onClick={() => navigate(-1)}>
                <IoChevronBackOutline size={25} />
              </ActionIcon>
              <Title order={4}>Danh sách gói - phòng khám</Title>
            </Flex>
            <Button
              color='primary'
              onClick={() => setIsOpenClinicModal(true)}
            >
              Mua gói
            </Button>
          </Flex>
          <Flex direction='column' gap={15}>
            {clinics.map((clinic) => (
              <Paper shadow="xs" radius='md' p='lg'>
                <div className='flex justify-between'>
                  <div>
                    <Text fw='semibold' tt='uppercase'>{clinic.name}</Text>
                    <Text>{clinic.address}</Text>
                    {renderAction(clinic)}

                  </div>
                  <div>
                    {renderSubscriptionInfo(clinic)}
                  </div>
                </div>
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
    </div>
  );
}

export default ClinicManagePage;

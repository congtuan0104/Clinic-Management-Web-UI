import { Text, Flex, Box, Paper, Title, Button, Loader, Stack, Badge, ActionIcon, Grid } from '@mantine/core';
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
import classNames from 'classnames';
import Map, { Marker } from 'react-map-gl';


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
    () => clinicApi.getClinics({ ownerId: userInfo?.id }).then(res => res.data)
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

  const handleCancelPayment = () => {
    setIsOpenPaymentModal(false);
    setClinicNeedPayment(undefined);
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
      <div className='flex flex-col items-end min-w-[250px]'>
        <Text tt='uppercase' miw={200} ta='right'>
          {plan?.planName}
        </Text>
        {(subscription.status === CLINIC_SUBSCRIPTION_STATUS.ACTIVE)
          && <Text ta='right'>
            Sử dụng đến {dayjs(subscription.expiredAt).format('DD/MM/YYYY')}<br />
            (Còn {dayjs(subscription.expiredAt).diff(dayjs(), 'day')} ngày)
          </Text>}

        <Badge
          color={subscription.status === CLINIC_SUBSCRIPTION_STATUS.ACTIVE ? 'primary.4'
            : subscription.status === CLINIC_SUBSCRIPTION_STATUS.INPAYMENT ? 'yellow.5'
              : subscription.status === CLINIC_SUBSCRIPTION_STATUS.EXPIRED ? 'gray.6'
                : 'red.5'}
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
          setClinicNeedPayment({
            clinic: clinic,
            subscription: subscription,
          })
          setIsOpenPaymentModal(true);
        }}
      >
        Gia hạn
      </div>
    )

    if (subscription.status === CLINIC_SUBSCRIPTION_STATUS.NOT_ACTIVE) return (
      <div
        className='cursor-pointer text-teal-600 hover:text-teal-500'
        onClick={() => {
          setClinicNeedPayment({
            clinic: clinic,
            subscription: subscription,
          })
          setIsOpenPaymentModal(true);
        }}
      >
        Kích hoạt
      </div>
    )

    if (subscription.status === CLINIC_SUBSCRIPTION_STATUS.INPAYMENT) return (
      <div
        className='cursor-pointer text-yellow-600 hover:text-yellow-500'
        onClick={() => {
          setClinicNeedPayment({
            clinic: clinic,
            subscription: subscription,
          })
          setIsOpenPaymentModal(true);
        }}
      >
        Thanh toán lại
      </div>
    )
  }

  if ((isLoadingPlan || isLoadingClinic) && !isOpenClinicModal && !isOpenPaymentModal) return (
    <Stack h="90vh" align="center" justify="center">
      <Loader size="xl" />
      <Text size="xl">Đang tải</Text>
    </Stack>)

  return (
    <div className={classNames(
      'mx-auto pb-3',
      clinics && clinics.length > 0 ? 'max-w-screen-md' : 'max-w-screen-xl'
    )}>
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
              color='secondary'
              onClick={() => setIsOpenClinicModal(true)}
            >
              Mua gói
            </Button>
          </Flex>
          <Flex direction='column' gap={15}>
            {clinics.map((clinic) => (
              <Paper shadow="xs" radius='md' p='lg' key={clinic.id}>
                <div className='flex justify-between'>
                  <div>
                    <Text fw={600} c='primary.3' tt='uppercase'>{clinic.name}</Text>
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
        <Text ta="center" size="xl" fw={600} mt='20px' c='secondary'>
          Bạn chưa đăng ký phòng khám. Vui lòng chọn mua gói và khởi tạo phòng khám
        </Text>
        <Grid gutter={20} mt={20}>
          {plans && plans.map((plan) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={plan.id}>
              <PlanCard key={plan.id} plan={plan} actionText='Mua gói' action={handleBuyPlan} />
            </Grid.Col>
          ))}
        </Grid>
      </Box>)}

      <ModalCreateNewClinic
        isOpen={isOpenClinicModal}
        onClose={handleCloseModal}
        selectedPlanId={selectedPlan?.id}
        onSuccess={handleCreateClinicSuccess}
      />

      {clinicNeedPayment && <ModalClinicPayment
        isOpen={isOpenPaymentModal}
        onClose={handleCancelPayment}
        clinicPayment={clinicNeedPayment}
      />}
    </div>
  );
}

export default ClinicManagePage;

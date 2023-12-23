import { Text, Flex, Box } from '@mantine/core';
import { useState } from 'react';
import PlanCard from '@/components/Card/PlanCard';
import { useQuery } from 'react-query';
import { planApi } from '@/services';
import { IClinicWithSubscription, IServicePlan } from '@/types';
import { ModalClinicPayment, ModalCreateNewClinic } from '@/components';


const PricingPlanPage = () => {
  const { data: plans, isLoading } = useQuery('plans', () => getAllPlans());
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

  return (
    <>
      <Box>
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
      </Box>

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

export default PricingPlanPage;

import { Text, Flex, Box } from '@mantine/core';
import { useState } from 'react';
import PlanCard from '@/components/Card/PlanCard';
import { useQuery } from 'react-query';
import { planApi } from '@/services';
import  AddClinicModal  from './ModalAddClinic'
import { IServicePlan } from '@/types';


const PricingPlanPage = () => {
  const { data: plans, isLoading, isError, error } = useQuery('plans', () => getAllPlans());
  const [isOpenClinicModal, setIsOpenClinicModal] = useState<boolean>(false);
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
    setIsOpenClinicModal(true);
    setSelectedPlan(plan);
  }

  const handleCloseModal = (e:any) => {
    if (e.target.id === 'container') setIsOpenClinicModal(false);
  }

  return (
    <Box>
      {/* Blur backdrop when modal is open */}
      {isOpenClinicModal && (
        <div className="backdrop-blur-md" />
      )}
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
      {
      isOpenClinicModal && selectedPlan?
      (<div id='container' onClick={handleCloseModal} className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md'>
        <Box
          pos='absolute' top="50%" left="50%" style={{transform:"translate(-50%, -50%)", zIndex:"9999"}} 
        >
          <AddClinicModal plan={selectedPlan}/>
        </Box>
      </div>) :
      null
      }
    </Box>
  );
}

export default PricingPlanPage;

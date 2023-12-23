import { Text, Flex, Box } from '@mantine/core';

import PlanCard from '@/components/Card/PlanCard';
import { useQuery } from 'react-query';
import { planApi } from '@/services';

const PricingPlanPage = () => {
  const { data: plans, isLoading, isError, error } = useQuery('plans', () => getAllPlans());

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
  const handleBuyPlan = () => {
    alert('Chức năng mua gói dịch vụ đang được phát triển');
  }

  return (
    <Box>
      <Text ta="center" pt={30} size="xl" fw={600}>
        Bảng giá dịch vụ
      </Text>
      <Flex wrap='wrap' my={30} mx={{ base: 15, md: 0 }} gap={20} direction={{ base: 'column', md: 'row' }}>
        {plans && plans.map((plan) => (
          <Box w='350' h='509'>
            <PlanCard key={plan.id} plan={plan} actionText='Mua gói' action={handleBuyPlan} />
          </Box>
        ))}
      </Flex>
    </Box>
  );
}

export default PricingPlanPage;

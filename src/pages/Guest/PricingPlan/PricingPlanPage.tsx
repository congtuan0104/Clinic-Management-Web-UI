import { Text, Flex, Box } from '@mantine/core';

import PlanCard from '@/components/Card/PlanCard';
import { useQuery } from 'react-query';
import { planApi } from '@/services';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/config';

const PricingPlanPage = () => {
  const { data: plans, isLoading } = useQuery('plans', () => getAllPlans());
  const navigate = useNavigate();

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
    navigate(`${PATHS.LOGIN}?callback=${PATHS.PLAN_MANAGEMENT}`)
  }

  return (
    <Box>
      <Text ta="center" pt={30} size="xl" fw={600}>
        Bảng giá dịch vụ
      </Text>
      <Flex gap={20} direction={{ base: 'column', md: 'row' }}>
        {plans && plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} actionText='Mua gói' action={handleBuyPlan} />
        ))}
      </Flex>
    </Box>
  );
}

export default PricingPlanPage;

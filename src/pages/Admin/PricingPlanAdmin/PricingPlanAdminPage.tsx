import { PlanCard } from '@/components';
import { useAppSelector } from '@/hooks';
import { planApi } from '@/services';
import { userInfoSelector } from '@/store';
import { Box, Title, Text, Flex, Button, Loader } from '@mantine/core';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ModalAddPlan from './ModalAddPlan';
import { IServicePlan } from '@/types';
import ModalPlanDetail from './ModalPlanDetail';

const PlanAdminPage = () => {
  const { data: plans, isLoading } = useQuery('plans', () => getAllPlans());

  const [openAddModal, setOpenAddModal] = useState(false);  // mở modal thêm gói dịch vụ
  const [planDetail, setPlanDetail] = useState<IServicePlan | undefined>(undefined);  // mở modal xem chi tiết gói dịch vụ

  const getAllPlans = async () => {
    try {
      const response = await planApi.getAllPlans();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <Flex justify='justify-between' pt={30}>
        <Text size="xl" fw={600} style={{ flex: 1 }}>
          Danh sách gói dịch vụ
        </Text>
        {!isLoading && <Button color='secondary.4' onClick={() => setOpenAddModal(true)}>Thêm gói</Button>}
      </Flex>

      {isLoading && <Flex justify='center' align='center' h='500px'>
        <Loader color="blue" size="xl" />
      </Flex>}

      <Flex wrap='wrap' justify='space-between' my={10} mx={{ base: 15, md: 0 }} direction={{ base: 'column', md: 'row' }}>
        {plans && plans.map((plan) => (
          <Box w='32%'>
            <PlanCard key={plan.id} plan={plan} actionText='Xem chi tiết' action={() => setPlanDetail(plan)} />
          </Box>
        ))}
      </Flex>

      <ModalAddPlan open={openAddModal} onClose={() => setOpenAddModal(false)} />
      {planDetail &&
        <ModalPlanDetail
          open={!!planDetail}
          onClose={() => setPlanDetail(undefined)}
          planInfo={planDetail}
        />
      }
    </>
  );
};

export default PlanAdminPage;

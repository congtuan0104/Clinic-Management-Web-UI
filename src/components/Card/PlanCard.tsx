import { Paper, Text, Divider, Group, Button, Flex, Box } from '@mantine/core';
import { FaCheck } from 'react-icons/fa';

import classes from './style.module.css';
import { IServicePlan } from '@/types';

/**
 * @param {IServicePlan} plan - Thông tin gói dịch vụ
 * @param {string} actionText - Nội dung button thực thi hành động (ví dụ như 'Mua gói')
 * @param {() => void} action - Hành động thực thi khi click vào button
 */
interface IPlanCardProps {
  plan: IServicePlan;
  actionText?: string;
  action: () => void;
}

const PlanCard = ({ plan, actionText, action }: IPlanCardProps) => {
  return (
    <Paper w="100%" h='100%' withBorder shadow="md" p={30} radius="md" display='flex' style={{ flexDirection: 'column' }}>
      <Text ta="center" c={'primary'} fw={700} fz="lg">{plan.planName}</Text>
      <Divider pb={10} color='primary'></Divider>

      <Text ta='center' c='gray.7'>{plan.description}</Text>
      <Text ta="center" c='secondary' size='lg'>{plan.currentPrice}₫/{plan.duration} ngày</Text>


      {/* <Group>
        <FaCheck size="1rem" color="var(--mantine-color-primary-3)" stroke={1.5} />
        <Text>{plan} người dùng</Text>
      </Group> */}

      <Box style={{ flex: 1 }}>
        {plan.planOptions.map((option) => (
          <Flex key={option.option.id} mt={10}>
            <FaCheck size="1rem" stroke={1.5} color="var(--mantine-color-primary-3)" />
            <Text ml={5} component='span'>{option.option.optionName}</Text>
          </Flex>
        ))}
      </Box>

      <Button mt="xl" radius="sm" size="md" type="submit" variant='outline' fullWidth mx='auto' onClick={action}>
        {actionText}
      </Button>
    </Paper>
  );
};

export default PlanCard;

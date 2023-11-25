import { Paper, Text, Divider, Group, Button } from '@mantine/core';
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
    <Paper w="100%" withBorder shadow="md" p={30} radius="md" >
      <Text ta="center" c={'primary'} fw={700} fz="lg">{plan.planName}</Text>
      <Divider pb={10} color='primary'></Divider>

      <Text ta="center" size='lg'>{plan.currentPrice}/{plan.duration} ngày</Text>

      {/* <Group>
        <FaCheck size="1rem" color="var(--mantine-color-primary-3)" stroke={1.5} />
        <Text>{plan} người dùng</Text>
      </Group> */}

      {plan.planOptions.map((option) => (
        <Group>
          <FaCheck size="1rem" stroke={1.5} color="var(--mantine-color-primary-3)" />
          <Text>{option.optionId}</Text>
        </Group>
      ))}

      <Button mt="xl" radius="sm" size="md" type="submit" w='60%' mx='auto' onClick={action}>
        {actionText}
      </Button>
    </Paper>
  );
};

export default PlanCard;

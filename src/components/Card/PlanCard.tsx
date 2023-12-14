import { Paper, Text, Divider, Group, Button, Flex, Box, NumberFormatter, ThemeIcon } from '@mantine/core';
import { FaCheck } from 'react-icons/fa';

import classes from './style.module.css';
import { IServicePlan } from '@/types';
import { CurrencyFormatter } from '@/components';

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
    <Paper w="100%" h='100%' withBorder shadow="md" px={25} py={15} radius="md" display='flex' style={{ flexDirection: 'column' }}>
      <Text ta="center" tt='uppercase' c={'primary'} fw={700} fz="lg" >{plan.planName}</Text>
      <Divider pb={10} color='gray.5'></Divider>

      <Text ta="center" c='secondary' size='lg'>
        <CurrencyFormatter value={plan.currentPrice} />
        /{plan.duration} ngày
      </Text>
      <Text ta='center' c='gray.7'>{plan.description}</Text>


      {/* <Group>
        <FaCheck size="1rem" color="var(--mantine-color-primary-3)" stroke={1.5} />
        <Text>{plan} người dùng</Text>
      </Group> */}

      <Box style={{ flex: 1 }}>
        {plan.planOptions.map((option) => (
          <Flex key={option.id} mt={10}>
            <ThemeIcon variant='white' color="primary" >
              <FaCheck size="1rem" stroke={1.5} />
            </ThemeIcon>
            <Text mt={1} ml={5} component='span'>{option.optionName}</Text>
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

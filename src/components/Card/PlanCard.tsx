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
  action: (plan: IServicePlan) => void;
}

const PlanCard = ({ plan, actionText, action }: IPlanCardProps) => {
  return (
    <Paper w="100%" h='100%' withBorder shadow="md" radius="md" display='flex' style={{ flexDirection: 'column', borderRadius: '17px' }} /* className='rounded-2xl' */>
      <Box w='100%' bg={{ base: 'primary' }} style={{ borderRadius: '17px' }}/* className='rounded-2xl' */>
        <Text ta="center" tt='uppercase' c={'white'} fw={700} fz="lg" style={{ marginTop: '30px', marginBottom: '20px' }}>{plan.planName}</Text>
        <Text mx='auto' w='288px' h='55px' ta="center" c='primary' size='lg' bg='white' style={{
          borderRadius: '10px',
          alignContent: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <CurrencyFormatter value={plan.currentPrice} />
          /{plan.duration} ngày
        </Text>
        <Text lineClamp={2} ta='center' c='white'>{plan.description}</Text>
      </Box>


      {/* <Group>
        <FaCheck size="1rem" color="var(--mantine-color-primary-3)" stroke={1.5} />
        <Text>{plan} người dùng</Text>
      </Group> */}

      <Box mx='26px' style={{ flex: 1 }} mt='27.8px'>
        {plan.planOptions.map((option) => (
          <Flex key={option.id} mt={10}>
            <ThemeIcon variant='white' color="primary" >
              <FaCheck size="1rem" stroke={1.5} />
            </ThemeIcon>
            <Text mt={1} ml={5} component='span'>{option.optionName}</Text>
          </Flex>
        ))}
      </Box>

      <Button w='183px' h='50px' mt="xl" mb='24px' radius="25" size="md" type="submit" fullWidth mx='auto' onClick={() => action(plan)} color='primary'>
        {actionText}
      </Button>
    </Paper>
  );
};

export default PlanCard;

import { Paper, Text, Divider, Group, Button } from '@mantine/core'; 
import { FaCheck } from 'react-icons/fa'; 

import classes from './style.module.css';


const PlanCard = ({ index, plan } : any) => {
    const _buildFeature = (text: string) => {
        return (
            <Group>
                <FaCheck size="1rem" stroke={1.5} color="var(--mantine-color-primary-3)" />
                <Text>{text}</Text>
            </Group>
        );
    };

  return (
    <Paper w="100%" withBorder shadow="md" p={30} radius="md" className={classes.PaperWithButton}>
      <Text ta="center" c={'primary'} fw={700} fz="lg">{plan.name}</Text>
      <Divider pb={10} color='primary'></Divider>

      <Text ta="center" size='lg'>{plan.price}</Text>
      <Text ta="center" c={'grey'} size='sm'>/ tháng</Text>

      <Group>
        <FaCheck size="1rem" color="var(--mantine-color-primary-3)" stroke={1.5} />
        <Text>{plan.numberOfUsers} người dùng</Text>
      </Group>

      {plan.features.map((feature : any) => (
        feature.isActive ? _buildFeature(feature.description) : null
      ))}

      <div style={{ margin: '4rem' }} />
      <Button mt="xl" radius="sm" size="md" type="submit">
        Mua gói
      </Button>
    </Paper>
  );
};

export default PlanCard;

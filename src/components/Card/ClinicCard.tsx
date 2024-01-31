import { Paper, Text, Divider, Group, Button, Flex, Box, NumberFormatter, ThemeIcon, Image, Stack, Container } from '@mantine/core';
import { FaCheck } from 'react-icons/fa';

import classes from './style.module.css';
import { IClinic, IServicePlan } from '@/types';
import { CurrencyFormatter } from '@/components';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiMail, FiPhone } from "react-icons/fi";
import { FaPhoneAlt } from "react-icons/fa";
import ClinicLogoDefault from '@/assets/images/hospital-logo.png';
import { Link } from 'react-router-dom';
import { PATHS } from '@/config';

/**
 * @param {IClinic} clinic 
 */
interface IClinicCardProps {
  clinic: IClinic;
}

// Import necessary components and libraries

const ClinicCard = ({ clinic }: IClinicCardProps) => {
  return (
    <Paper w={580} h='100%' withBorder shadow="md" radius="md" >
      <Flex justify='flex-start' align='center' p={20}>
        <Box w={150} h={150}>
          <Image
            radius="xl"
            src={clinic.logo}
            h={150}
            fallbackSrc={ClinicLogoDefault}
          />
        </Box>

        <Stack align="flex-start" gap="xs" pl={30}>
          <Text fw={700} size='25px'>{clinic.name}</Text>
          <Group pt={20}>
            <HiOutlineLocationMarker size={'20px'} color='gray' />
            <Text c='gray.6'>
              {clinic.address}
            </Text>
          </Group>
          <Group>
            <FiMail size={'20px'} color='gray' />
            <Text c='gray.6'>
              {clinic.email}
            </Text>
          </Group>
          <Group>
            <FiPhone size={'20px'} color='gray' />
            <Text c='gray.6'>
              {clinic.phone}
            </Text>
          </Group>
          <Button
            w='150px'
            h='40px'
            mt="xl"
            mb='24px'
            ml={0}
            radius="25"
            size="md"
            type="submit"
            // onClick={() => action(clinic)}
            component={Link} to={`${PATHS.CLINICS}/${clinic.id}`}
            mx='auto'
            color='primary'
            variant='outline'
          >
            Chi tiết
          </Button>
        </Stack>
      </Flex>
    </Paper>
  );
};

export default ClinicCard;


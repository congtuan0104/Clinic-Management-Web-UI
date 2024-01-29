import { Paper, Text, Divider, Group, Button, Flex, Box, NumberFormatter, ThemeIcon, Image, Stack } from '@mantine/core';
import { FaCheck } from 'react-icons/fa';

import classes from './style.module.css';
import { IClinic, IServicePlan } from '@/types';
import { CurrencyFormatter } from '@/components';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiMail, FiPhone } from "react-icons/fi";
import { FaPhoneAlt } from "react-icons/fa";
import ClinicLogoDefault from '@/assets/images/hospital-logo.png';

/**
 * @param {IClinic} clinic 
 * @param {string} actionText 
 * @param {() => void} action
 */
interface IClinicCardProps {
  clinic: IClinic;
  actionText?: string;
  action: (plan: IClinic) => void;
}

// Import necessary components and libraries

const ClinicCard = ({ clinic, actionText, action }: IClinicCardProps) => {
  return (
    <Paper w="100%" h='100%' withBorder shadow="md" radius="md" >
      <Flex justify='flex-start' align='center' p={20}>
        <Image
          pl={20}
          pr={30}
          radius="xl"
          src={clinic.logo}
          h={150}
          fallbackSrc={ClinicLogoDefault}
        />
        <div>
          <Text fw={700} size='25px'>{clinic.name}</Text>
          <Group pt={20}>
            <HiOutlineLocationMarker size={'20px'} color='gray'/>
            <Text c='gray.6'>
              {clinic.address}
            </Text>
          </Group>
          <Group pt={10}>
            <FiMail size={'20px'} color='gray'/>
            <Text c='gray.6'>
              {clinic.email}
            </Text>
          </Group>
          <Group pt={10}>
            <FiPhone size={'20px'} color='gray'/>
            <Text c='gray.6'>
              {clinic.phone}
            </Text>
          </Group>


          <Button
            w='150px'
            h='40px'
            mt="xl"
            mb='24px'
            radius="25"
            size="md"
            type="submit"
            onClick={() => action(clinic)}
            mx='auto'
            color='primary'
            variant='outline'
          >
            {actionText}
          </Button>
        </div>
      </Flex>
    </Paper>
  );
};

export default ClinicCard;


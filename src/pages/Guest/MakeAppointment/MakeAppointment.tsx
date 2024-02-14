import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text, Group, Image, Flex, Stack, Button, Container, Badge, Center, Divider, Grid, TextInput, Paper, GridCol, Anchor } from '@mantine/core';
import { PATHS } from '@/config';
import { CiSearch } from "react-icons/ci";
import { ClinicCard } from '@/components';
import { clinicApi, clinicServiceApi } from '@/services';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { IClinic, IClinicService } from '@/types';
import ClinicLogoDefault from '@/assets/images/hospital-logo.png';
import { useDebouncedState } from '@mantine/hooks';

const MakeAppointment = () => {
    var appointment: Array<any> = [];
const [value, setValue] = useDebouncedState('', 1000);
  const [selectedClinic, setSelectedClinic] = useState<IClinic | null>(null);
  const [selectedService, setSelectedService] = useState<IClinicService | null>(null);
  const [currentScreen, setCurrentScreen] = useState(1);

  const { data: clinics, refetch } = useQuery('clinics', () => getAllClinics(value));
  const { data: services } = useQuery(['services', selectedClinic?.id], () => getClinicService(selectedClinic?.id ?? ''));


  const getAllClinics = async (searchValue?: string) => {
    try {
      const response = await clinicApi.getClinics({ name: searchValue });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  const getClinicService = async (clinicId: string) => {
    try {
      const response = await clinicServiceApi.getClinicServices(clinicId, false);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  const handleSelectClinic = (clinic: IClinic) => {
    setSelectedClinic(clinic);
    appointment.push(selectedClinic?.name);
    setCurrentScreen(currentScreen + 1);
    console.log(appointment);
  };

  const handleSelectService = (service: IClinicService) => {
    setSelectedService(service);
    appointment.push(selectedService?.serviceName);
    setCurrentScreen(currentScreen + 1);
    console.log(appointment);
  };

  const handleGoBack = () => {
    appointment.pop();
    setCurrentScreen(currentScreen - 1);
    console.log(appointment);
  };

  useEffect(() => {
    const fetchData = async () => {
      refetch();
    };

    fetchData();
  }, [value, refetch]);

  return (
    <div className='max-w-screen-xl mx-auto'>
      <Grid>
        <GridCol span={4}>
        <Paper w='100%' withBorder shadow="md" p={30} radius="md">
          {selectedClinic && (
            <Box>
              <Title>Thông tin phòng khám đã chọn:</Title>
              {appointment.map((appointmentItem, index) => (
      <Text key={index}>{appointmentItem}</Text>
    ))}
            </Box>
          )}
          <Button onClick={handleGoBack}>Quay lại</Button>
          </Paper>
        </GridCol>
        <GridCol span={8}>
        <Paper w='100%' withBorder shadow="md" p={30} radius="md">
          {currentScreen === 1 && (
            <Box>
              <Title>Danh sách phòng khám</Title>
              <TextInput
            //   w={660}
              size='lg'
              radius={'md'}
              leftSection={<CiSearch />}
              placeholder='Tìm kiếm phòng khám'
              onChange={(event) => setValue(event.currentTarget.value)}
            />
              <Stack>
                {clinics?.map((clinic) => (
                    <Anchor key={clinic.id} onClick={() => handleSelectClinic(clinic)}>{clinic.name}</Anchor>
                ))}
              </Stack>
            </Box>
          )}
          {currentScreen === 2 && (
            <Box>
              <Title>Chọn dịch vụ</Title>
              <Stack>
                {services?.map((service) => (
                    <Anchor key={service.id} onClick={() => handleSelectService(service)}>{service.serviceName}</Anchor>
                ))}
              </Stack>
            </Box>
          )}
          </Paper>
        </GridCol>
      </Grid>
    </div>
  );
};

export default MakeAppointment;

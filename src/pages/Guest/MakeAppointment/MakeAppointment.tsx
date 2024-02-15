import { useAppSelector, useAuth } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text, Group, Image, Flex, Stack, Button, Container, Badge, Center, Divider, Grid, TextInput, Paper, GridCol, Anchor, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { PATHS } from '@/config';
import * as yup from 'yup';
import { CiSearch } from "react-icons/ci";
import { ClinicCard } from '@/components';
import { clinicApi, clinicServiceApi, staffApi } from '@/services';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { IClinic, IClinicService } from '@/types';
import ClinicLogoDefault from '@/assets/images/hospital-logo.png';
import { useDebouncedState } from '@mantine/hooks';
// import { DateInput, Select } from 'react-hook-form-mantine';
import dayjs from 'dayjs';
import { FaCalendarDay } from 'react-icons/fa';

interface IFormData {
  doctorId: string;
  clinicId: string;
  patientId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime?: string;
  description?: string;
}

const schema = yup.object().shape({
  doctorId: yup.string().required('Bác sĩ không được để trống'),
  clinicId: yup.string().required('Vui lòng chọn phòng khám'),
  patientIdL: yup.string(),
  serviceId: yup.string().required('Vui lòng chọn dịch vụ khám'),
  date: yup.date().required('Chọn ngày hẹn khám'),
  startTime: yup.string().required('Chọn thời gian bắt đầu khám'),
  endTime: yup.string(),
  description: yup.string(),
});



const MakeAppointment = () => {
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const { userInfo, linkAccount } = useAuth();


  const { data: clinics, refetch, isLoading } = useQuery(
    ['clinic'],
    () => clinicApi.getClinics({})
      .then(res => res.data),
    {
      refetchOnWindowFocus: false,
    }
  );
  
  const { data: staffs } = useQuery(
    ['staffs', selectedClinicId],
    () => staffApi.getStaffs({ clinicId: selectedClinicId ?? undefined })
      .then(res => res.data),
    {
      refetchOnWindowFocus: false,
    }
  );
  
  const { data: services } = useQuery(
    ['clinic_service', selectedClinicId],
    () => clinicServiceApi.getClinicServices(selectedClinicId ?? '', false)
      .then(res => res.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className='max-w-screen-xl mx-auto'>
      <Grid my={10}>
        <GridCol span={6}>
          <Paper w='100%' withBorder shadow="md" radius="md">
            <Stack gap={'lg'} p={30}>
              <Text fw={700} size='25px'> Thông tin bệnh nhân</Text>
              <Divider/>
            <Group justify='space-between' grow>
              <TextInput
                label={<Text fw={700}>Họ</Text>}
                defaultValue={userInfo?.firstName}
              />
              <TextInput
                label={<Text fw={700}>Tên</Text>}
                defaultValue={userInfo?.lastName}
              />
            </Group>
            <Group justify='space-between' grow>
              <DateInput
                label={<Text fw={700}>Ngày sinh</Text>}
                name="birthday"
                valueFormat="DD/MM/YYYY"
                defaultDate={
                  userInfo?.birthday === null ?
                    dayjs(userInfo?.birthday, 'DD/MM/YYYY').toDate()
                    : undefined
                }
                rightSection={<FaCalendarDay size={18} />}
              />
              <Select
                label={<Text fw={700}>Giới tính</Text>}
                name='gender'
                defaultValue={userInfo?.gender?.toLocaleString()}
                data={[
                  { label: 'Nam', value: '1' },
                  { label: 'Nữ', value: '0' },
                ]}
              />
            </Group>
            <TextInput
              label={<Text fw={700}>Số điện thoại</Text>}
              defaultValue={userInfo?.phone}
            />
            <TextInput
              label={<Text fw={700}>Địa chỉ</Text>}
              defaultValue={userInfo?.address}
            />
          </Stack>
          </Paper>
        </GridCol>
        <GridCol span={6}>
          <GridCol span={12}>
          <Paper w='100%' withBorder shadow="md" p={30} radius="md">
          <Select
            label={<Text fw={700}>Phòng khám</Text>}
            placeholder="Chọn phòng khám khám bệnh"
            size="md"
            radius='md'
            allowDeselect
            data={clinics?.map((clinic) => ({
              value: clinic.id.toString(),
              label: `${clinic.name}`
            })) || []}
            searchable
            w={'100%'}
            onChange={setSelectedClinicId}
          />
          </Paper>
          </GridCol>
          <GridCol span={12}>
            {selectedClinicId ? (
              <Paper w='100%' withBorder shadow="md" p={30} radius="md">
              <Select
                label={<Text fw={700}>Bác sĩ</Text>}
                placeholder="Chọn bác sĩ khám bệnh"
                size="md"
                radius='md'
                allowDeselect
                data={staffs?.map((staff) => ({
                  value: staff.id.toString(),
                  label: `${staff?.users?.firstName} ${staff?.users?.lastName}`
                })) || []}
                searchable
                w={'100%'}
              />
              </Paper>
            ) : null}
          
          </GridCol>
          <GridCol span={12}>
          {selectedClinicId ? (
              <Paper w='100%' withBorder shadow="md" p={30} radius="md">
              <Select
                label={<Text fw={700}>Dịch vụ</Text>}
                placeholder="Chọn dịch vụ"
                size="md"
                radius='md'
                allowDeselect
                data={services?.map((service) => ({
                  value: service.id.toString(),
              label: service.serviceName
                })) || []}
                searchable
                w={'100%'}
              />
              </Paper>
            ) : null}
          </GridCol>
        </GridCol>
      </Grid>
    </div >
  );
};

export default MakeAppointment;

import { useAppSelector, useAuth } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text, Group, Image, Flex, Stack, Button, Container, Badge, Center, Divider, Grid, TextInput, Paper, GridCol, Anchor, Select, SimpleGrid, Textarea, Chip } from '@mantine/core';
import { DateInput, Calendar } from '@mantine/dates';
import { PATHS } from '@/config';
import * as yup from 'yup';
import { appointmentApi, clinicApi, clinicServiceApi, staffApi } from '@/services';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
// import { DateInput, Select } from 'react-hook-form-mantine';
import dayjs from 'dayjs';
import { FaCalendarDay, FaRegClock } from 'react-icons/fa';
import { ISchedule, INewAppointmentPayload } from '@/types';
import { notifications } from '@mantine/notifications';
// import { Chip } from 'react-hook-form-mantine';
import { APPOINTMENT_STATUS } from '@/enums';

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
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [description, setDescription] = useState<string>();
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
    ['staffs', selectedServiceId, selectedStaffId],
    () => staffApi.getStaffs({ clinicId: selectedClinicId ?? undefined })
      .then(res => res.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: services } = useQuery(
    ['clinic_service', selectedClinicId, selectedServiceId],
    () => clinicServiceApi.getClinicServices(selectedClinicId ?? '', false)
      .then(res => res.data),
    {
      refetchOnWindowFocus: false,
    }
  );
  
  const { data: freeTimes } = useQuery(
    ['free_time', selectedDate],
    () => staffApi.getFreeAppoinment(selectedStaffId ?? '', dayjs(selectedDate).toISOString().slice(0,10))
      .then(res => res.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(dayjs(selectedDate).toISOString().slice(0,10))

  const makeAppointment = async () => {
    const time = selectedTime?.split(' - ');
    try {
      if (!userInfo) return;
      const res = await appointmentApi.createAppointment({
        clinicId: selectedClinicId ?? '',
        doctorId: Number(selectedStaffId) ?? -1,
        serviceId: Number(selectedServiceId) ?? -1,
        patientId: 2,
        userId: userInfo.id ?? '',
        date: dayjs(selectedDate).toISOString().slice(0,10) ?? '',
        startTime: time ? time[0] : '',
        endTime: time ? time[1] : '',
        description: description,
        status: APPOINTMENT_STATUS.PENDING,
      });

      if (res.status) {
        // Password change successful
        notifications.show({
          message: 'Đặt lịch hẹn thành công',
          color: 'green',
        })
      } else {
        notifications.show({
          message: res.message || 'Đặt lịch hẹn không thành công',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        message: 'Đặt lịch hẹn không thành công',
        color: 'red',
      });
    }
  };

  return (
    <div className='max-w-screen-xl mx-auto'>
      <SimpleGrid my={10} cols={2}>
        {/* <GridCol span={6} h={'100%'}> */}
        <Paper w='100%' withBorder shadow="md" radius="md">
          <Stack gap={'lg'} p={30}>
            <Text fw={700} size='25px'> Thông tin bệnh nhân</Text>
            <Divider />
            <Group justify='space-between' grow>
              <TextInput
                readOnly
                label={<Text fw={700}>Họ</Text>}
                defaultValue={userInfo?.firstName}
              />
              <TextInput
                readOnly
                label={<Text fw={700}>Tên</Text>}
                defaultValue={userInfo?.lastName}
              />
            </Group>
            <Group justify='space-between' grow>
              <DateInput
                readOnly
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
              readOnly
              label={<Text fw={700}>Số điện thoại</Text>}
              defaultValue={userInfo?.phone}
            />
            <TextInput
              readOnly
              label={<Text fw={700}>Địa chỉ</Text>}
              defaultValue={userInfo?.address}
            />
          </Stack>
        </Paper>
        {/* </GridCol>
        <GridCol span={6} h={'100%'}> */}
        <Stack>
          <Paper w='100%' withBorder shadow="md" p={32} radius="md">
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
              onChange={(value) => {
                setSelectedServiceId(null)
                setSelectedStaffId(null)
                setSelectedClinicId(value)
              }}
            />
          </Paper>
          {selectedClinicId ? (
            <Paper w='100%' withBorder shadow="md" p={32} radius="md">
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
                onChange={(value) => {
                  setSelectedStaffId(null)
                  setSelectedServiceId(value)
                }}
              />
            </Paper>
          ) : null}
          {selectedServiceId ? (
            <Paper w='100%' withBorder shadow="md" p={32} radius="md">
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
                onChange={(value) => {
                  setSelectedStaffId(value)
                }}
              />
            </Paper>
          ) : null}
        </Stack>
        {/* </GridCol> */}


      </SimpleGrid>
      <SimpleGrid cols={3} py={10}>
        {selectedStaffId ? (
          <Paper w='100%' withBorder shadow="md" p={32} radius="md">
            <Center>
              <Text fw={700}>Chọn ngày khám</Text>
            </Center>
            <Divider my={10} />
            <Center>
              <Calendar
                getDayProps={(date) => ({
                  selected: dayjs(selectedDate).isSame(dayjs(date).subtract(-1,'day'), 'day'),
                  onClick: () => setSelectedDate(dayjs(date).add(1, 'day').toDate()),
                })}
              />
            </Center>
          </Paper>
        ) : null}
        {selectedDate ? (
          <Paper w='100%' withBorder shadow="md" p={32} radius="md">
            <Center>
              <Text fw={700}>Chọn giờ khám</Text>
            </Center>
            <Divider my={10} />
            <Center>
              <Chip.Group multiple={false} value={selectedTime} onChange={setSelectedTime}>
              {freeTimes && freeTimes.length > 0 ? (
                <>
                  {freeTimes.map((time) => (
                    <Chip value={`${time.startTime} - ${time.endTime}`}>{time.startTime} - {time.endTime}</Chip>
                  ))}
                </>
              )
              :
              (!freeTimes || freeTimes.length === 0 && <Text>Không có lịch trống</Text>)
                  }
              </Chip.Group>            
            </Center>
          </Paper>
        ) : null}
        {selectedTime ? (
          <Paper w='100%' withBorder shadow="md" p={32} radius="md">
            <Center>
              <Text fw={700}>Thêm ghi chú</Text>
            </Center>
            <Divider my={10} />
            <Textarea
              autosize
              minRows={8}
              pt={10}
              pb={20}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Center>
            </Center>
            <Group justify='flex-end'>
              <Button onClick={() => makeAppointment()}>Đặt lịch hẹn</Button>
            </Group>
          </Paper>
        ) : null}
      </SimpleGrid>

    </div >
  );
};

export default MakeAppointment;

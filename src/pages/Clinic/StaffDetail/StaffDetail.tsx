import React, { useState, MouseEvent, useMemo, useEffect } from 'react';
import { Text, Flex, Button, Indicator, Divider, Center, Stack, Box, Title, Grid, Group, SimpleGrid } from '@mantine/core';
import { Form, useForm } from 'react-hook-form';
import { TextInput, Select, TimeInput } from 'react-hook-form-mantine';
import { CgProfile } from 'react-icons/cg';
import { FaRegCalendar } from 'react-icons/fa';
import { FaRegClock } from "react-icons/fa6";
import { Calendar } from '@mantine/dates';
import { CgMail } from "react-icons/cg";
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from 'react-query';
import { clinicApi } from '@/services';
import { notifications } from '@mantine/notifications';
import { Label } from 'recharts';

interface IUpdateAccount {
  avatar: string,
  firstName: string,
  lastName: string,
  email: string,
}

interface IUpdateInfo {
  id_staff?: string,
  phoneNumber?: string,
  gender?: number,
  address?: string,
  specialize?: string,
  experience?: number,
}

interface IUpdateSchedule {
  day: number,
  startTime: string,
  endTime: string,
}

const infoschema = yup.object().shape({
  id_staff: yup.string(),
  phoneNumber: yup.string(),
  gender: yup.number(),
  address: yup.string(),
  specialize: yup.string(),
  experience: yup.number(),
});

const scheduleschema = yup.object().shape({
    day: yup.number(),
    startTime: yup.string(),
    endTime: yup.string(),
});


const StaffDetail = () => {
  const { data: staff, isLoading } = useQuery('staff', () => getStaffInfo());

  const daysOfWeek = [
    { label: 'Thứ 2', value: '2' },
    { label: 'Thứ 3', value: '3' },
    { label: 'Thứ 4', value: '4' },
    { label: 'Thứ 5', value: '5' },
    { label: 'Thứ 6', value: '6' },
    { label: 'Thứ 7', value: '7' },
    { label: 'Chủ Nhật', value: 'CN' },
  ];

  const { id: staffId } = useParams();
  const currentClinic = useAppSelector(currentClinicSelector);
  const [selectedTab, setSelectedTab] = useState<'account' | 'info' | 'schedule'>('account');
  const [isUpdateInfo, setIsUpdateInfo] = useState<boolean>(false);
  const [isUpdateSchedule, setIsUpdateSchedule] = useState<boolean>(false);

  const { control: controlInfo, setValue, getValues } = useForm<IUpdateInfo>({
    resolver: yupResolver(infoschema),
    defaultValues: useMemo(() => {
      return {
        id_staff: staffId,
        phoneNumber: staff?.phoneNumber,
        // gender: staff?.gender,
        address: staff?.address,
        specialize: staff?.specialize,
        experience: staff?.experience,
      }
    }, [staffId]),
  });

  const { control: controlSchedule } = useForm<IUpdateSchedule[]>();

  const getStaffInfo = async () => {
    try {
      const response = await clinicApi.getClinicStaff(staffId ?? '');
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  const handleTabClick = (tabType: 'account' | 'info' | 'schedule') => {
    if (selectedTab === tabType) {
      return;
    }

    setSelectedTab(tabType);
  };

  const handleOnClickEditInfo = () => {
    setIsUpdateInfo(!isUpdateInfo);
  }

  const handleOnClickEditSchedule = () => {
    setIsUpdateSchedule(!isUpdateSchedule);
  }


  const onInfoSubmit = async (data: IUpdateInfo) => {
    try {
      const res = await clinicApi.updateStaffInfo(staffId ?? '', {
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        address: data.address,
        specialize: data.specialize,
        experience: data.experience,
      });

      if (res.status) {
        // Password change successful
        notifications.show({
          message: 'Đổi thông tin thành công',
          color: 'green',
        })
        setIsUpdateInfo(false);
      } else {
        notifications.show({
          message: res.message || 'Đổi thông tin không thành công',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        message: 'Đổi thông tin không thành công',
        color: 'red',
      });
    }
  }

  const onScheduleSubmit = async (data: IUpdateSchedule[]) => {
    console.log(data);
  };

  return (
    <Center>
      <Stack>
        {<Flex w='941px' h='160px' px='30px' align="center" justify={'space-between'} bg='#081692' style={{ borderRadius: '10px' }} mt='30px' c='white'>
          <Stack>
            <h1 className="p-2">Quản lý nhân viên</h1>

            <Flex gap={2}>
              <Button
                onClick={() => handleTabClick('account')}
                leftSection={<CgProfile size={14} />}
                variant={selectedTab === 'account' ? 'filled' : 'outline'}
                color={selectedTab === 'account' ? 'primary.3' : 'gray.5'}
                className={'flex-1 w-full m-2'}
              >
                Thông tin tài khoản
              </Button>
              <Button
                onClick={() => handleTabClick('info')}
                leftSection={<CgProfile size={14} />}
                variant={selectedTab === 'info' ? 'filled' : 'outline'}
                color={selectedTab === 'info' ? 'primary.3' : 'gray.5'}
                className={'flex-2 w-full m-2'}
              >
                Thông tin nhân viên
              </Button>

              <Button
                onClick={() => handleTabClick('schedule')}
                leftSection={<FaRegCalendar size={14} />}
                variant={selectedTab === 'schedule' ? 'filled' : 'outline'}
                color={selectedTab === 'schedule' ? 'primary.3' : 'gray.5'}
                className={'flex-3 w-full m-2'}
              >
                Lịch làm việc
              </Button>
            </Flex>
          </Stack>
        </Flex>}

        {selectedTab === 'account' && (
          <Box w='100%' h='100%' px='30px' bg='white' py='20px' style={{ borderRadius: '10px' }}>
            <Flex justify={"space-between"}>
              <Title order={5} >THÔNG TIN TÀI KHOẢN</Title>
              <Text c='#6B6B6B'>ID Phòng khám: {currentClinic?.id}</Text>
            </Flex>
            <Divider my="md" />

            <Grid align='center' justify='center'>
              <Grid.Col>
                <Box maw={700} mx="auto">
                  <Form control={controlInfo} onSubmit={e => onInfoSubmit(e.data)} onError={e => console.log(e)}>
                    <Grid>
                      <Grid.Col span={6}>
                        {/* <TextInput
                          label="Họ"
                          disabled={!isUpdateInfo}
                          mt="md"
                          w={'100%'}
                          name='firstName'
                          control={controlInfo}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Tên"
                          disabled={!isUpdateInfo}
                          mt="md"
                          w={'100%'}
                          name='lastName'
                          control={controlInfo}
                        /> */}
                      </Grid.Col>
                    </Grid>

                    <Grid>
                      {/* <TextInput
                        label="Email"
                        disabled={!isUpdateInfo}
                        mt="md"
                        // name='email'
                        w={'100%'}
                        px={8}
                        defaultValue={staff?.address}
                        // control={control}
                      /> */}

                    </Grid>
                    <Divider my="md" mt={40} />
                    <Group justify="flex-end" mt="lg">
                      {
                        isUpdateInfo ? (
                          <Button type="submit">Lưu thay đổi</Button>
                        ) : (
                          <></>
                        )
                      }
                      {isUpdateInfo ?
                        (
                          <Button variant="outline" color='gray.6' onClick={handleOnClickEditInfo}>Hủy thay đổi</Button>
                        ) :
                        (
                          <Button onClick={handleOnClickEditInfo}>Chỉnh sửa</Button>
                        )}
                    </Group>
                  </Form>
                </Box>
              </Grid.Col>

            </Grid>

          </Box>
        )}

        {selectedTab === 'info' && (
          <Box w='100%' h='100%' px='30px' bg='white' py='20px' style={{ borderRadius: '10px' }}>
            <Flex justify={"space-between"}>
              <Title order={5} >THÔNG TIN CÁ NHÂN</Title>
              <Text c='#6B6B6B'>ID Phòng khám: {currentClinic?.id}</Text>
            </Flex>
            <Divider my="md" />

            <Grid align='center' justify='center'>
              <Grid.Col>
                <Box maw={700} mx="auto">
                  <Form control={controlInfo} onSubmit={e => onInfoSubmit(e.data)} onError={e => console.log(e)}>
                    <TextInput label="ID nhân viên"
                      // disabled
                      name='id_staff'
                      defaultValue={staffId}
                      control={controlInfo}
                    />
                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          label="SĐT liên lạc"
                          disabled={!isUpdateInfo}
                          mt="md"
                          w={'100%'}
                          name='phoneNumber'
                          control={controlInfo}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Select
                          label="Giới tính"
                          disabled={!isUpdateInfo}
                          mt="md"
                          w={'100%'}
                          name='gender'
                          control={controlInfo}
                          defaultValue={staff?.gender?.toString()}
                          data={[
                            { label: 'Nam', value: '1' },
                            { label: 'Nữ', value: '0' },
                          ]}
                        />
                      </Grid.Col>
                      <Grid.Col span={9}>
                        <TextInput
                          label="Chuyên khoa"
                          disabled={!isUpdateInfo}
                          mt="md"
                          w={'100%'}
                          name='specialize'
                          control={controlInfo}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <TextInput
                          label="Năm kinh nghiệm"
                          disabled={!isUpdateInfo}
                          mt="md"
                          w={'100%'}
                          name='experience'
                          control={controlInfo}
                        />
                      </Grid.Col>
                    </Grid>

                    <Grid>
                      <TextInput
                        label="Địa chỉ"
                        disabled={!isUpdateInfo}
                        mt="md"
                        name='address'
                        w={'100%'}
                        px={8}
                        defaultValue={staff?.address}
                        control={controlInfo}
                      />

                    </Grid>
                    <Divider my="md" mt={40} />
                    <Group justify="flex-end" mt="lg">
                      {
                        isUpdateInfo ? (
                          <Button type="submit">Lưu thay đổi</Button>
                        ) : (
                          <></>
                        )
                      }
                      {isUpdateInfo ?
                        (
                          <Button variant="outline" color='gray.6' onClick={handleOnClickEditInfo}>Hủy thay đổi</Button>
                        ) :
                        (
                          <Button onClick={handleOnClickEditInfo}>Chỉnh sửa</Button>
                        )}
                    </Group>
                  </Form>
                </Box>
              </Grid.Col>

            </Grid>

          </Box>
        )}

        {selectedTab === 'schedule' && (
          <Box
            w="100%"
            h="100%"
            px="30px"
            bg="white"
            py="20px"
            style={{ borderRadius: '10px' }}
          >
          <Form control={controlSchedule} onSubmit={e => onScheduleSubmit(e.data)} onError={e => console.log(e)}>
            <Group>
              <Title order={6} size={19}>Lịch làm việc</Title>
            </Group>

            <Divider my="md"></Divider>

            <SimpleGrid cols={2} spacing="xl">
              {daysOfWeek.map((day, index) => (
                <div key={index}>
                  <Text py={10}>{day.label}:</Text>
                  <Group style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TimeInput
                      placeholder="Input placeholder"
                      disabled={!isUpdateSchedule}
                      name={`schedule[${index}].startTime` as `${number}.startTime`} 
                      control={controlSchedule}
                    />

                    <Text>-</Text>

                    <TimeInput
                      placeholder="Input placeholder"
                      disabled={!isUpdateSchedule}
                      name={`schedule[${index}].endTime` as `${number}.endTime`} 
                      control={controlSchedule}
                    />
                  </Group>
                </div>
              ))}
            </SimpleGrid>
            <Group my={20} justify="flex-end" mt="lg" mr={'23%'}>
              {isUpdateSchedule ? (
                <Button type="submit">
                  Lưu thay đổi
                </Button>
              ) : (
                <></>
              )}
              {isUpdateSchedule ? (
                <Button variant="outline" color='gray.6' onClick={handleOnClickEditSchedule}>
                  Hủy thay đổi
                </Button>
              ) : (
                <Button onClick={handleOnClickEditSchedule} w={'25%'}>
                  Chỉnh sửa
                </Button>
              )}
            </Group>
            </Form>
          </Box>
        )}
      </Stack>
    </Center>
  );
};

export default StaffDetail;

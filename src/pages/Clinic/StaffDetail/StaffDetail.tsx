import React, { useState, MouseEvent, useMemo, useEffect } from 'react';
import { Text, Flex, Button, Indicator, Divider, Center, Stack, Box, Title, Grid, Group, SimpleGrid, Avatar } from '@mantine/core';
import { Form, useForm } from 'react-hook-form';
import { TimeInput } from '@mantine/dates';
import { TextInput, Select} from 'react-hook-form-mantine';
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
import { clinicApi, staffApi } from '@/services';
import { notifications } from '@mantine/notifications';
import { Label } from 'recharts';
import { ISchedule } from '@/types';
import dayjs from 'dayjs';

interface IStaff {
  id_staff?: string,
  firstName?: string,
  lastName?: string,
  phoneNumber?: string,
  email?: string,
  gender?: number,
  address?: string,
  specialize?: string,
  experience?: number,
}


const infoschema = yup.object().shape({
  id_staff: yup.string(),
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string(),
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
  const { id: staffId } = useParams();
  const { data: staff, isLoading } = useQuery(['staff', staffId], () => getStaffInfo());
  const { data: schedules, isLoading: isLoadingClinic } = useQuery(
    ['schedules', staff?.id],
    () => staffApi.getSchedule(String(staff?.id)).then(res => res.data)
  );

  const [newschedules, setNewSchedules] = useState<Array<ISchedule>>(() => {
    const newschedules: Array<ISchedule> = [];
    for (let i = 0; i < 7; i++) {
      newschedules.push({
        day: i + 1,
        startTime: '',
        endTime: '',
      });
    }


    return newschedules;
  });
  // console.log(schedules)
  // console.log(tempschedules)

  useEffect(() => {
    if (schedules) {
      schedules.map((day, index) => {
        newschedules[day.day - 1] = day
      })
    }
  }, [schedules]);


  // schedules!.sort((a, b) => a.day - b.day);

  // console.log(schedules);


  const daysOfWeek = [
    { label: 'Chủ Nhật', value: '1' },
    { label: 'Thứ 2', value: '2' },
    { label: 'Thứ 3', value: '3' },
    { label: 'Thứ 4', value: '4' },
    { label: 'Thứ 5', value: '5' },
    { label: 'Thứ 6', value: '6' },
    { label: 'Thứ 7', value: '7' },
  ];

  // function printDaysOfWeek() {
  //   daysOfWeek.map((day, index) => {
  //     if (schedules && schedules[index - 1]) {
  //       console.log(schedules[index - 1].startTime);
  //       console.log('-');
  //       console.log(schedules[index - 1].endTime);
  //     } else {
  //       console.log('Schedule data not available for', day.label);
  //     }
  //   });
  // }

  // // Call the function to print the daysOfWeek
  // printDaysOfWeek();



  const currentClinic = useAppSelector(currentClinicSelector);
  const [selectedTab, setSelectedTab] = useState<'info' | 'schedule'>('info');
  const [isUpdateInfo, setIsUpdateInfo] = useState<boolean>(false);
  const [isUpdateSchedule, setIsUpdateSchedule] = useState<boolean>(false);

  const { control: controlInfo, setValue, getValues } = useForm<IStaff>({
    resolver: yupResolver(infoschema),
    defaultValues: useMemo(() => {
      return {
        id_staff: staffId,
        firstName: staff?.users.firstName,
        lastName: staff?.users.lastName,
        phoneNumber: staff?.users.phone,
        email: staff?.users.email,
        // gender: staff?.gender,
        address: staff?.users.address,
        specialize: staff?.specialize,
        experience: staff?.experience,
      }
    }, [staffId]),
  });

  const { control: controlSchedule } = useForm<ISchedule[]>();

  const getStaffInfo = async () => {
    try {
      const response = await staffApi.getStaff(staffId ?? '');
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  const handleTabClick = (tabType: 'info' | 'schedule') => {
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


  const onInfoSubmit = async (data: IStaff) => {
    try {
      const res = await staffApi.updateStaffInfo(staffId ?? '', {
        userInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          phone: data.phoneNumber,
          email: data.email,
          address: data.address,
        }

      });

      if (res.status) {
        // Password change successful
        notifications.show({
          message: 'Đổi thông tin nhân viên thành công',
          color: 'green',
        })
        setIsUpdateInfo(false);
      } else {
        notifications.show({
          message: res.message || 'Đổi thông tin nhân viên không thành công',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        message: 'Đổi thông tin nhân viên không thành công',
        color: 'red',
      });
    }
  }

  const onScheduleSubmit = async () => {
    // const Schedule = newschedules.filter(obj => obj.startTime && obj.endTime).map(obj => ({
    //   day: obj.day,
    //   startTime: obj.startTime,
    //   endTime: obj.endTime,
    // }));
    // try {
    //   const res = await staffApi.updateSchedule(staffId ?? '', Schedule);

    //   if (res.status) {
    //     // Password change successful
    //     notifications.show({
    //       message: 'Đổi thông tin lịch làm việc thành công',
    //       color: 'green',
    //     })
    //     setIsUpdateSchedule(false);
    //   } else {
    //     notifications.show({
    //       message: res.message || 'Đổi thông tin lịch làm việc không thành công',
    //       color: 'red',
    //     });
    //   }
    // } catch (error) {
    //   notifications.show({
    //     message: 'Đổi thông tin lịch làm việc không thành công',
    //     color: 'red',
    //   });
    // }
    console.log(newschedules);
  };

  return (
    <Center>
      <Stack>
        {<Flex w='941px' h='160px' px='30px' align="center" justify={'space-between'} bg='#081692' style={{ borderRadius: '10px' }} mt='30px' c='white'>
          <Stack>
            <h1 className="p-2">Quản lý nhân viên</h1>

            <Flex gap={2}>
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

        {selectedTab === 'info' && (
          <Box w='100%' h='100%' px='30px' bg='white' py='20px' style={{ borderRadius: '10px' }}>
            <Flex justify={"space-between"}>
              <Title order={5} >THÔNG TIN CÁ NHÂN</Title>
              <Text c='#6B6B6B'>ID Phòng khám: {currentClinic?.id}</Text>
            </Flex>
            <Divider my="md" />

            <Grid align='center' justify='center'>
              <Grid.Col>
                <Group justify='flex-start' align='flex-start'>
                  <Avatar
                    src={staff?.users.avatar}
                    size={150}
                    radius={150}
                    mr={10}
                    alt="no image here"
                    color={'primary'}
                  />
                  <Box maw={700} mx="auto">
                    <Form control={controlInfo} onSubmit={e => onInfoSubmit(e.data)} onError={e => console.log(e)}>
                      <TextInput label="ID nhân viên"
                        // disabled
                        name='id_staff'
                        defaultValue={staffId}
                        control={controlInfo}
                        disabled
                      />
                      <Grid>
                        <Grid.Col span={6}>
                          <TextInput
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
                          />
                        </Grid.Col>
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
                            defaultValue={staff?.users.gender?.toString()}
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
                          defaultValue={staff?.users.address}
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
                </Group>
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
                      disabled={!isUpdateSchedule}
                      value={newschedules && newschedules[index] ? newschedules[index].startTime : ''}
                      name={`schedule[${index}].startTime` as `${number}.startTime`}
                      onChange={(value) => setNewSchedules(prev => {
                        const newSchedule = [...prev];
                        newSchedule[index].startTime = String(value);
                        return newSchedule;
                      })
                      }
                    />
                    <Text>-</Text>
                    <TimeInput
                      disabled={!isUpdateSchedule}
                      value={newschedules && newschedules[index] ? newschedules[index].endTime : ''}
                      name={`schedule[${index}].endTime` as `${number}.endTime`}
                      onChange={(event) => {setNewSchedules(prev => {
                        const value = event.target.value;
                        const newSchedule = [...prev];
                        newSchedule[index].endTime = value;
                        return newSchedule;
                      })
                    console.log(event.target.value)}
                      }
                    />
                  </Group>
                </div>
              ))}
            </SimpleGrid>
            <Group my={20} justify="flex-end" mt="lg" mr={'23%'}>
              {isUpdateSchedule ? (
                <Button onClick={() => onScheduleSubmit()}>
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
          </Box>
        )}
      </Stack>
    </Center>
  );
};

export default StaffDetail;

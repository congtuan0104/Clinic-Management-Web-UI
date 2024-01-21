import React, { useState, MouseEvent, useMemo, useEffect } from 'react';
import { Text, Flex, Button, Indicator, Divider, Center, Stack, Box, Title, Grid, Group, SimpleGrid, Select} from '@mantine/core';
import { Form, useForm} from 'react-hook-form';
import { TextInput } from 'react-hook-form-mantine';
import { CgProfile } from 'react-icons/cg';
import { FaRegCalendar } from 'react-icons/fa';
import { FaRegClock } from "react-icons/fa6";
import { Calendar, TimeInput } from '@mantine/dates';
import { CgMail } from "react-icons/cg";
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from 'react-query';
import { clinicApi } from '@/services';

interface IUpdateInfo {
  id_staff: string;
  firstName: string,
  lastName: string,
  phoneNumber?: string,
  gender?: number,
  address?: string,
  specialize?: string,
  experience?: number,
}

const schema = yup.object().shape({
  id_staff: yup.string().required(),
  firstName: yup.string().required('Bạn chưa nhập Họ'),
  lastName: yup.string().required('Bạn chưa nhập Tên'),
  phoneNumber: yup.string(),
  gender: yup.number(),
  address: yup.string(),
  specialize: yup.string(),
  experience: yup.number(),
});

const StaffDetail = () => {
  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  const { id: staffId } = useParams();
  const currentClinic = useAppSelector(currentClinicSelector);
  const [selectedTab, setSelectedTab] = useState<'info' | 'schedule'>('info');
  const [isUpdateInfo, setIsUpdateInfo] = useState<boolean>(false);
  const [isUpdateSchedule, setIsUpdateSchedule] = useState<boolean>(false);
  const { data: staff, isLoading } = useQuery('staff', () => getStaffInfo());
  const { control, setValue, getValues } = useForm<IUpdateInfo>({
    resolver: yupResolver(schema),
    defaultValues: useMemo(() => {
      return {
        id_staff: staffId,
        firstName: staff?.firstName,
        lastName: staff?.lastName,
        phoneNumber: staff?.phoneNumber,
        gender: staff?.gender,
        address: staff?.address,
        specialize: staff?.specialize,
        experience: staff?.experience,
      }
    }, [currentClinic]),
  });

  const getStaffInfo = async () => {
    try {
      const response = await clinicApi.getClinicMember(staffId ?? '');
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


  const onSubmit = async (data: IUpdateInfo) => {
    const updateInfo = {
      firstName: data.firstName,
      lastName: data.lastName,
    }
    if (currentClinic?.id && staffId) {
      console.log(updateInfo);
      console.log(staff?.firstName);
    }
  }

  return (
    <Center>
      <Stack>
        {<Flex w='941px' h='160px' px='30px' align="center" justify={'space-between'} bg='#081692' style={{ borderRadius: '10px' }} mt='30px' c='white'>
          <Stack>
            <h1 className="p-2">Thông tin nhân viên</h1>

            <Flex gap={2}>
              <Button
                onClick={() => handleTabClick('info')}
                leftSection={<CgProfile size={14} />}
                variant={selectedTab === 'info' ? 'filled' : 'outline'}
                color={selectedTab === 'info' ? 'primary.3' : 'gray.5'}
                className={'flex-1 w-full m-2'}
              >
                Hiển thị thông tin
              </Button>

              <Button
                onClick={() => handleTabClick('schedule')}
                leftSection={<FaRegCalendar size={14} />}
                variant={selectedTab === 'schedule' ? 'filled' : 'outline'}
                color={selectedTab === 'schedule' ? 'primary.3' : 'gray.5'}
                className={'flex-2 w-full m-2'}
              >
                Hiển thị lịch làm việc
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
                <Box maw={700} mx="auto">
                  <Form control={control} onSubmit={e => onSubmit(e.data)} onError={e => console.log(e)}>
                    <TextInput label="ID nhân viên"
                      disabled
                      name='id_staff'
                      defaultValue={staffId}
                      control={control}
                    />
                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Họ"
                          disabled={!isUpdateInfo}
                          mt="md"
                          w={'100%'}
                          name='firstName'
                          control={control}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Tên"
                          disabled={!isUpdateInfo}
                          mt="md"
                          w={'100%'}
                          name='lastName'
                          control={control}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="SĐT liên lạc"
                          disabled={!isUpdateInfo}
                          mt="md"
                          w={'100%'}
                          name='phoneNumber'
                          control={control}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Giới tính"
                          disabled={!isUpdateInfo}
                          mt="md"
                          w={'100%'}
                          name='gender'
                          control={control}
                        />
                      </Grid.Col>
                      <Grid.Col span={9}>
                        <TextInput
                          label="Chuyên khoa"
                          disabled={!isUpdateInfo}
                          mt="md"
                          w={'100%'}
                          name='specialize'
                          control={control}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <TextInput
                          label="Năm kinh nghiệm"
                          disabled={!isUpdateInfo}
                          mt="md"
                          w={'100%'}
                          name='experience'
                          control={control}
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
                        control={control}
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
            <Group>
              <Title order={6} size={19}>Lịch làm việc</Title>
            </Group>

            <Divider my="md"></Divider>

            <SimpleGrid cols={2} spacing="xl">
              {daysOfWeek.map((day, index) => (
                <div key={index}>
                  <Text py={10}>{day}:</Text>
                  <Group style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TimeInput placeholder="Input placeholder" disabled={!isUpdateSchedule} />
                    <Text>-</Text>
                    <TimeInput placeholder="Input placeholder" disabled={!isUpdateSchedule} />
                  </Group>
                </div>
              ))}
            </SimpleGrid>
            <Group my={20} justify="flex-end" mt="lg" mr={'23%'}>

              {
                isUpdateSchedule ? (
                  <Button type="submit">Lưu thay đổi</Button>
                ) : (
                  <></>
                )
              }
              {isUpdateSchedule ?
                (
                  <Button variant="outline" color='gray.6' onClick={handleOnClickEditSchedule}>Hủy thay đổi</Button>
                ) :
                (
                  <Button onClick={handleOnClickEditSchedule} w={'25%'}>Chỉnh sửa</Button>
                )}
            </Group>
          </Box>
        )}
      </Stack>
    </Center>
  );
};

export default StaffDetail;

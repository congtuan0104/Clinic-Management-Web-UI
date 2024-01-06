import React, { useState, MouseEvent } from 'react';
import { Text, Flex, Button, Indicator, Divider, TextInput, Center, Stack, Box, Title, Grid, Group, SimpleGrid } from '@mantine/core';
import { CgProfile } from 'react-icons/cg';
import { FaRegCalendar } from 'react-icons/fa';
import { FaRegClock } from "react-icons/fa6";
import { Calendar, TimeInput } from '@mantine/dates';
import { CgMail } from "react-icons/cg";
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';

const StaffDetail = () => {
  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  const { id: staffId } = useParams()
  const currentClinic = useAppSelector(currentClinicSelector);
  const [selectedButton, setSelectedButton] = useState<'info' | 'schedule'>('info');
  const [isUpdateInfo, setIsUpdateInfo] = useState<boolean>(false);

  const handleButtonClick = (buttonType: 'info' | 'schedule') => {
    if (selectedButton === buttonType) {
      return;
    }

    setSelectedButton(buttonType);
  };

  const handleCancelChange = () => {
    setIsUpdateInfo(false);
  }

  const handleUpdate = () => {
    setIsUpdateInfo(true);
  }

  return (
    <Center>
      <Stack>
        {<Flex w='941px' h='160px' px='30px' align="center" justify={'space-between'} bg='#081692' style={{ borderRadius: '10px' }} mt='30px' c='white'>
          <Stack>
            <h1 className="p-2">Thông tin nhân viên</h1>

            <Flex gap={2}>
              <Button
                onClick={() => handleButtonClick('info')}
                leftSection={<CgProfile size={14} />}
                variant={selectedButton === 'info' ? 'filled' : 'outline'}
                color={selectedButton === 'info' ? 'primary.3' : 'gray.5'}
                className={'flex-1 w-full m-2'}
              >
                Hiển thị thông tin
              </Button>

              <Button
                onClick={() => handleButtonClick('schedule')}
                leftSection={<FaRegCalendar size={14} />}
                variant={selectedButton === 'schedule' ? 'filled' : 'outline'}
                color={selectedButton === 'schedule' ? 'primary.3' : 'gray.5'}
                className={'flex-2 w-full m-2'}
              >
                Hiển thị lịch làm việc
              </Button>
            </Flex>
          </Stack>
        </Flex>}

        {selectedButton === 'info' && (
          <Box w='100%' h='100%' px='30px' bg='white' py='20px' style={{ borderRadius: '10px' }}>
            <Flex justify={"space-between"}>
              <Title order={5}>THÔNG TIN CÁ NHÂN</Title>
              <Text c='#6B6B6B'>ID Phòng khám: {currentClinic?.id}</Text>
            </Flex>
            <Divider my="md" />
            <Grid align='center' justify='center'>
              <Grid.Col>
                <Box maw={700} mx="auto">
                  <TextInput label="ID nhân viên"
                    disabled={!isUpdateInfo}
                  // placeholder={staffId}
                  />
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Họ"
                        disabled={!isUpdateInfo}
                        mt="md"
                        w={'100%'}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Tên"
                        disabled={!isUpdateInfo}
                        mt="md"
                        w={'100%'}
                      />
                    </Grid.Col>
                  </Grid>
                  <Grid>
                    <TextInput
                      label="Email liên hệ"
                      disabled={!isUpdateInfo}
                      mt="md"
                      name='email'
                      w={'100%'}
                      px={8}
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
                        <Button variant="outline" color='gray.6' onClick={handleCancelChange}>Hủy thay đổi</Button>
                      ) :
                      (
                        <Button onClick={handleUpdate}>Chỉnh sửa</Button>
                      )}
                  </Group>
                </Box>
              </Grid.Col>
            </Grid>
          </Box>
        )}

        {selectedButton === 'schedule' && (
          <Box
            w="100%"
            h="100%"
            px="30px"
            bg="white"
            py="20px"
          >
            <Group>
              <Title size={25} pb={10}>Lịch làm việc</Title>
            </Group>

            <SimpleGrid cols={2} spacing="xl">
              {daysOfWeek.map((day, index) => (
                <div key={index}>
                  <Text py={10}>{day}:</Text>
                  <Group style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TimeInput placeholder="Input placeholder" />
                    <Text px={2}>-</Text>
                    <TimeInput placeholder="Input placeholder" />
                  </Group>
                </div>
              ))}
            </SimpleGrid>

            

            <Center my={20}>
              
              <Button mt={30} w={'30%'}>Chỉnh sửa</Button>

            </Center>


          </Box>

        )}

      </Stack>
    </Center>
  );
};

export default StaffDetail;

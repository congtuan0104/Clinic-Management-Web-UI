import React, { useState, MouseEvent, useMemo, useEffect } from 'react';
import { Text, Flex, Button, Indicator, Divider, Center, Stack, Box, Title, Grid, Group, SimpleGrid, Avatar, Badge, TypographyStylesProvider } from '@mantine/core';
import { Form, useForm } from 'react-hook-form';
import { TimeInput } from '@mantine/dates';
import { TextInput, Select, DateInput} from 'react-hook-form-mantine';
import { CgProfile } from 'react-icons/cg';
import { FaCalendarDay, FaRegCalendar } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from 'react-query';
import { clinicApi, staffApi } from '@/services';
import { notifications } from '@mantine/notifications';
import { ISchedule, IClinicStaff } from '@/types';
import { RichTextEditor, Link } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { useEditor } from '@tiptap/react';
import dayjs from 'dayjs';

interface IStaff {
  id_staff?: string,
  firstName?: string,
  lastName?: string,
  phoneNumber?: string,
  role?: number,
  email?: string,
  gender?: number,
  address?: string,
  specialize?: string,
  experience?: number,
  description?: string,
}


const infoschema = yup.object().shape({
  id_staff: yup.string(),
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string(),
  role: yup.number(),
  phoneNumber: yup.string(),
  gender: yup.number(),
  address: yup.string(),
  specialize: yup.string(),
  experience: yup.number(),
  description: yup.string(),
});

const scheduleschema = yup.object().shape({
  day: yup.number(),
  startTime: yup.string(),
  endTime: yup.string(),
});


const StaffDetail = () => {
  const currentClinic = useAppSelector(currentClinicSelector)
  const { id: staffId } = useParams();
  const { data: staff, refetch} = useQuery(['staff', staffId], () => getStaffInfo());
  const { data: schedules} = useQuery(
    ['schedules', staff?.id],
    () => staffApi.getSchedule(String(staff?.id)).then(res => res.data)
  );
  const { data: roles } = useQuery(
    ['role', currentClinic],
    () => clinicApi.getClinicRoles(currentClinic?.id ?? '').then(res => res.data)
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

  const daysOfWeek = [
    { label: 'Chủ Nhật', value: '1' },
    { label: 'Thứ 2', value: '2' },
    { label: 'Thứ 3', value: '3' },
    { label: 'Thứ 4', value: '4' },
    { label: 'Thứ 5', value: '5' },
    { label: 'Thứ 6', value: '6' },
    { label: 'Thứ 7', value: '7' },
  ];

  const [selectedTab, setSelectedTab] = useState<'info' | 'schedule'>('info');
  const [isUpdateInfo, setIsUpdateInfo] = useState<boolean>(false);
  const [isUpdateSchedule, setIsUpdateSchedule] = useState<boolean>(false);

  const { control: controlInfo, setValue, getValues, watch } = useForm<IStaff>({
    resolver: yupResolver(infoschema),
    defaultValues: useMemo(() => {
      return {
        id_staff: staffId,
        firstName: staff?.users.firstName,
        lastName: staff?.users.lastName,
        phoneNumber: staff?.users.phone,
        // role: staff?.role.id,
        email: staff?.users.email,
        // gender: staff?.users.gender,
        address: staff?.users.address,
        specialize: staff?.specialize,
        experience: staff?.experience,
        description: staff?.description,
      }
    }, [staffId]),
  });


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
      const updateInfo: any = {
        specialize: data.specialize,
        experience: data.experience,
        description: data.description,
        roleId: data.role,
        userInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          phone: data.phoneNumber,
          email: data.email,
          address: data.address,
        }
      }

      const res = await staffApi.updateStaffInfo(staffId ?? '', updateInfo);

      if (res.status) {
        // Password change successful
        notifications.show({
          message: 'Đổi thông tin nhân viên thành công',
          color: 'green',
        })
        refetch()
        resetFormInfo()
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
    const Schedule = newschedules.filter(obj => obj.startTime && obj.endTime).map(obj => ({
      day: obj.day,
      startTime: obj.startTime,
      endTime: obj.endTime,
    }));
    try {
      const res = await staffApi.updateSchedule(staffId ?? '', Schedule);

      if (res.status) {
        // Password change successful
        notifications.show({
          message: 'Đổi thông tin lịch làm việc thành công',
          color: 'green',
        })
        setIsUpdateSchedule(false);
      } else {
        notifications.show({
          message: res.message || 'Đổi thông tin lịch làm việc không thành công',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        message: 'Đổi thông tin lịch làm việc không thành công',
        color: 'red',
      });
    }
  };

  const resetFormInfo = () => {
    setValue('id_staff', staffId);
    setValue('firstName', staff?.users.firstName);
    setValue('lastName', staff?.users.lastName);
    setValue('phoneNumber', staff?.users.phone);
    setValue('role', staff?.role.id);
    setValue('email', staff?.users.email);
    setValue('gender', staff?.users.gender);
    setValue('address', staff?.users.address);
    setValue('specialize', staff?.specialize);
    setValue('experience', staff?.experience);
    setValue('description', staff?.description || '');
    editor?.commands.setContent(staff?.description || '')
  }

  useEffect(() => {
    resetFormInfo()
  }, [staff, staffId])


  useEffect(() => {
    if (schedules) {
      schedules.map((day) => {
        newschedules[day.day - 1] = day
      })
    }
  }, [schedules]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: watch('description'),
    onUpdate({ editor }) {
      setValue('description', editor.getHTML());
      // setEditorContent(editor.getHTML());
    },
    editable: true,

  });

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
                      <TextInput label="Email"
                        name='email'
                        defaultValue={staff?.users.email}
                        control={controlInfo}
                        readOnly
                      />
                      <Grid>
                        <Grid.Col span={6}>
                          <TextInput
                            label="Họ"
                            readOnly={!isUpdateInfo}
                            mt="md"
                            w={'100%'}
                            name='firstName'
                            control={controlInfo}
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput
                            label="Tên"
                            readOnly={!isUpdateInfo}
                            mt="md"
                            w={'100%'}
                            name='lastName'
                            control={controlInfo}
                          />
                        </Grid.Col>
                        {/* <Grid.Col span={12}>
                          <DateInput
                            label='Ngày sinh'
                            disabled={!isUpdateInfo}
                            name="birthday"
                            valueFormat="YYYY-MM-DD"
                            date={                       
                              staff?.users.birthday === null ?
                                dayjs(staff?.users.birthday).toDate()
                                : undefined
                            }
                            control={controlInfo}
                            rightSection={<FaCalendarDay size={18} />}
                          />
                        </Grid.Col>  */}
                        <Grid.Col span={6}>
                          <TextInput
                            label="SĐT liên lạc"
                            readOnly={!isUpdateInfo}
                            mt="md"
                            w={'100%'}
                            name='phoneNumber'
                            control={controlInfo}
                          />

                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Select
                            label="Giới tính"
                            readOnly={!isUpdateInfo}
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

                        <TextInput
                          label="Địa chỉ"
                          readOnly={!isUpdateInfo}
                          mt="md"
                          name='address'
                          w={'100%'}
                          px={8}
                          defaultValue={staff?.users.address}
                          control={controlInfo}
                        />
                      </Grid>
                      <Divider mt={30} mb={10} />
                      <Grid>
                        <Grid.Col span={12}>
                          <Select label="Vai trò"
                            name='role'
                            control={controlInfo}
                            readOnly={!isUpdateInfo}
                            defaultValue={staff?.role.id.toString()}
                            data={roles ? roles.map((role) => ({
                              value: role.id.toString(),
                              label: role.name,
                            })) : []}
                          />
                        </Grid.Col>

                        <Grid.Col span={9}>
                          <TextInput
                            label="Chuyên khoa"
                            readOnly={!isUpdateInfo}
                            mt="md"
                            w={'100%'}
                            name='specialize'
                            control={controlInfo}
                          />
                        </Grid.Col>
                        <Grid.Col span={3}>
                          <TextInput
                            label="Năm kinh nghiệm"
                            readOnly={!isUpdateInfo}
                            mt="md"
                            w={'100%'}
                            name='experience'
                            control={controlInfo}
                          />
                        </Grid.Col>
                      </Grid>
                      <Text pt={30} size='14px'>Các quyền</Text>
                      {staff && staff.role && staff.role.permissions ? (
                        staff.role.permissions.map((permission, index) => (
                          <Badge
                            key={permission.id}
                            color={index % 2 === 0 ? 'primary.3' : 'gray.6'}
                            size='lg'
                            tt='capitalize'
                            mt={10}
                            mr={10}
                          >
                            {permission.optionName}
                          </Badge>
                        ))
                      ) : <Text>Error</Text>}


                      <Divider my="md" mt={40} />
                      <Text fw={700} pb={10}>Mô tả</Text>
                      {isUpdateInfo ? (
                      <RichTextEditor editor={editor} w='100%' maw={650} style={{ transform: "translateX(11px)" }}>
                        <RichTextEditor.Toolbar sticky stickyOffset={60}>
                          <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                          </RichTextEditor.ControlsGroup>
                          <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                          </RichTextEditor.ControlsGroup>
                          <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                          </RichTextEditor.ControlsGroup>
                          <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                          </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>
                        <RichTextEditor.Content style={{ minHeight: '8em' }} />
                      </RichTextEditor>
                  ) : (
                    <TypographyStylesProvider>
                      <div className="w-full rounded-md" dangerouslySetInnerHTML={{ __html: staff?.description || '' }}></div>
                    </TypographyStylesProvider>
                  )}
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
                      readOnly={!isUpdateSchedule}
                      value={newschedules && newschedules[index] ? newschedules[index].startTime : ''}
                      name={`schedule[${index}].startTime` as `${number}.startTime`}
                      onChange={(event) => setNewSchedules(prev => {
                        const value = event.target.value;
                        const newSchedule = [...prev];
                        newSchedule[index].startTime = value;
                        return newSchedule;
                      })
                      }
                    />
                    <Text>-</Text>
                    <TimeInput
                      readOnly={!isUpdateSchedule}
                      value={newschedules && newschedules[index] ? newschedules[index].endTime : ''}
                      name={`schedule[${index}].endTime` as `${number}.endTime`}
                      onChange={(event) => {
                        setNewSchedules(prev => {
                          const value = event.target.value;
                          const newSchedule = [...prev];
                          newSchedule[index].endTime = value;
                          return newSchedule;
                        })
                      }
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

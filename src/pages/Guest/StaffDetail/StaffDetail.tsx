import { Text, Center, Stack, Grid, GridCol, Button, Paper, Image, Group, Anchor, Box, Divider, Badge, TypographyStylesProvider, Flex } from '@mantine/core';
import { PATHS } from '@/config';
import { NewsCard } from '@/components';
import { useQuery } from 'react-query';
import { chatApi, staffApi } from '@/services';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import StaffAvatarDefault from '@/assets/images/doctor-avatar.png';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FiMail, FiPhone } from 'react-icons/fi';
import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { GroupChatType } from '@/enums';
import { notifications } from '@mantine/notifications';

const StaffDetail = () => {
    const { id: staffId } = useParams();
    const { data: staff, isFetching } = useQuery(['staffs', staffId], () =>
        getStaffDetail()
    );
    const userInfo = useAppSelector(userInfoSelector);
    const navigate = useNavigate();

    const getStaffDetail = async () => {
        try {
            const response = await staffApi.getStaff(staffId ?? '');
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const handleChatWithDoctor = async () => {
        if (!staff) return;
        if (!userInfo) {
            notifications.show({
                title: 'Thông báo',
                message: 'Vui lòng đăng nhập để sử dụng chức năng này',
                color: 'secondary.5',
            })
            navigate(PATHS.LOGIN);
            return;
        }
        const staffName = `${staff?.users.firstName} ${staff?.users.lastName}`;
        const res = await chatApi.addGroupChat({
            groupName: `${userInfo?.firstName} ${userInfo?.lastName}` + ' - ' + staffName,
            userList: [staff.users.id],
            type: GroupChatType.PERSONAL,
            maxMember: 2,
        });

        if (res.status && res.data) {
            const groupChat = res.data;
            navigate(`${PATHS.PATIENT_CHAT}?group=${groupChat.id}`);
        }
        else {
            notifications.show({
                title: 'Thất bại',
                message: 'Đã có lỗi xảy ra',
                color: 'red.5',
            })
        }
    }


    return (
        <div className='max-w-screen-xl mx-auto my-5 w-full'>
            <Grid>
                <GridCol span={4}>
                    <Paper w="100%" withBorder shadow="md" radius="md">
                        <Center py={20}>
                            <Stack align='center'>
                                <Box w={150} h={150}>
                                    <Image
                                        src={staff?.users.avatar}
                                        fallbackSrc={StaffAvatarDefault}
                                        h={150}
                                        radius={'xl'}
                                    />
                                </Box>
                                <Stack align='center' gap={'xs'}>
                                    <Text fw={700}>{staff?.role.name}</Text>
                                    <Text>{staff?.users.firstName} {staff?.users.lastName}</Text>
                                    <Stack>
                                        <Divider w={'100%'} />
                                        {staff?.users.address ? (
                                            <Flex>
                                                <Box w={20} h={20}>
                                                    <HiOutlineLocationMarker size={'20px'} />
                                                </Box>
                                                <Text ml={16}>
                                                    {staff.users.address}
                                                </Text>
                                            </Flex>) : null}
                                        {staff?.users.email ? (<Group>
                                            <FiMail size={'20px'} />
                                            <Text>
                                                {staff.users.email}
                                            </Text>
                                        </Group>) : null}
                                        {staff?.users.phone ? (<Group>
                                            <FiPhone size={'20px'} />
                                            <Text>
                                                {staff.users.phone}
                                            </Text>
                                        </Group>) : null}
                                    </Stack>
                                    <Button onClick={() => handleChatWithDoctor()}
                                        variant="outline" radius="xl" w={'100%'} mt={10}>
                                        Nhắn tin
                                    </Button>
                                </Stack>
                            </Stack>
                        </Center>
                    </Paper>
                </GridCol>
                <GridCol span={8}>
                    <Stack h={'100%'}>
                        <Paper w="100%" h={'25%'} withBorder shadow="md" radius="md">
                            <Stack ml={10} mt={10} gap={'xs'}>
                                {staff?.specialize ? (<Group><Text fw={700}>Chuyên khoa: </Text><Text>{staff.specialize}</Text></Group>) : null}
                                {staff?.experience ? (<Group><Text fw={700}>Năm kinh nghiệm: </Text><Text>{staff.experience}</Text></Group>) : null}
                            </Stack>
                        </Paper>
                        <Paper w="100%" h={'100%'} withBorder shadow="md" radius="md">
                            <Stack ml={10} mt={10}>
                                <Text fw={700}>Mô tả</Text>
                                <TypographyStylesProvider>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: staff?.description ?? '' }}
                                    />
                                </TypographyStylesProvider>
                            </Stack>
                        </Paper>
                    </Stack>
                </GridCol>
            </Grid>
        </div>
    );
};

export default StaffDetail;

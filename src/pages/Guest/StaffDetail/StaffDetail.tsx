import { Text, Center, Stack, Grid, GridCol, Button, Paper, Image, Group, Anchor, Box, Divider, Badge, TypographyStylesProvider, Flex } from '@mantine/core';
import { PATHS } from '@/config';
import { NewsCard } from '@/components';
import { useQuery } from 'react-query';
import { staffApi } from '@/services';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import StaffAvatarDefault from '@/assets/images/doctor-avatar.png';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FiMail, FiPhone } from 'react-icons/fi';

const StaffDetail = () => {
    const { id: staffId } = useParams();
    const { data: staff, isFetching } = useQuery(['staffs', staffId], () =>
        getStaffDetail()
    );

    const getStaffDetail = async () => {
        try {
            const response = await staffApi.getStaff(staffId ?? '');
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };


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
                                    <Divider w={'100%'}/> 
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
                                    <Button variant="outline" radius="xl" w={'100%'} mt={10}>Nhắn tin</Button>
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
                            {staff?.experience? (<Group><Text fw={700}>Năm kinh nghiệm: </Text><Text>{staff.experience}</Text></Group>) : null}
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

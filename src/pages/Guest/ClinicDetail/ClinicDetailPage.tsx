import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text, Group, Image, Flex, Stack, Button, Center, Divider, Grid, TextInput, Paper, GridCol, Table, Card, Badge } from '@mantine/core';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { IClinic } from '@/types';
import ClinicLogoDefault from '@/assets/images/hospital-logo.png';
import DoctorAvatarDefault from '@/assets/images/doctor-avatar.png';
import NewsLogoDefault from '@/assets/images/news-logo.png';
import { useParams } from 'react-router-dom';
import { clinicApi, staffApi, clinicServiceApi, newsApi } from '@/services';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiMail, FiPhone } from "react-icons/fi";
import { CurrencyFormatter } from '@/components';

const ClinicDetailPage = () => {
    const { id: clinicId } = useParams();
    const { data: clinic, isLoading } = useQuery(['clinic', clinicId], () => getClinicDetail());
    const { data: doctors } = useQuery(['doctors', clinicId], () => getDoctorDetail());
    const { data: services } = useQuery(['services', clinicId], () => getClinicServices());
    const { data: news } = useQuery(['news', clinicId], () => getClinicNews());

    const getClinicDetail = async () => {
        try {
            const response = await clinicApi.getClinicDetail(clinicId ?? '');
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const getDoctorDetail = async () => {
        try {
            const response = await staffApi.getStaffs({ clinicId: clinicId });
            const data = response.data;
            // if (data) {
            //     const doctorDetails = data && data.filter(item => item.role && item.role.name === 'doctor');
            //     return doctorDetails;
            // }
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const getClinicServices = async () => {
        try {
            const response = await clinicServiceApi.getClinicServices(clinicId ?? '');
            if (response.data?.length === 0) return null
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const getClinicNews = async () => {
        try {
            const response = await newsApi.getNews({
                clinicId: clinicId,
                isShow: true,
                pageSize: '4',
                pageIndex: '0',
            });
            return response.data?.data;
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='max-w-screen-xl mx-auto'>
            <Center m={20}>
                <Grid>
                    <GridCol w={200} span={5}>
                        <Paper w="100%" h='100%' withBorder shadow="md" radius="md">
                            <Stack justify='center' align='center' pt={20} pb={20}>
                                <Box w={200} h={200}>
                                    <Image
                                        radius="xl"
                                        src={clinic?.logo}
                                        h={200}
                                        fallbackSrc={ClinicLogoDefault}
                                    />
                                </Box>
                                <Text fw={700} size='30px' c={'primary.3'}>
                                    {clinic?.name}
                                </Text>
                            </Stack >
                            <Divider my={'md'} pb={20} />
                            <Center>
                                <Stack pb={20}>
                                    {clinic?.address ? (<Group>
                                        <HiOutlineLocationMarker size={'20px'} />
                                        <Text>
                                            {clinic?.address}
                                        </Text>
                                    </Group>) : null}
                                    {clinic?.email ? (<Group>
                                        <FiMail size={'20px'} />
                                        <Text>
                                            {clinic?.email}
                                        </Text>
                                    </Group>) : null}
                                    {clinic?.phone ? (<Group>
                                        <FiPhone size={'20px'} />
                                        <Text>
                                            {clinic?.phone}
                                        </Text>
                                    </Group>) : null}


                                </Stack>
                            </Center>
                        </Paper>
                    </GridCol>
                    <GridCol w={1200} span={7}>
                        <Stack w={'100%'} h={'100%'}>
                            <Paper w="100%" h='100%' withBorder shadow="md" radius="md">
                                <Stack p={20}>
                                    <Text fw={700} size='25px'>Giới thiệu {clinic?.name}</Text>
                                    <div
                                        className="ml-[8px]"
                                        dangerouslySetInnerHTML={{ __html: clinic?.description || '' }}>
                                    </div>
                                </Stack>
                            </Paper>
                            <Paper w="100%" h='100%' withBorder shadow="md" radius="md">
                                <Stack p={20}>
                                    <Text fw={700} size='25px'>Đội ngũ nhân viên</Text>
                                    <Group>
                                        {doctors && doctors.slice(0, 4).map((doctor) => (

                                            <Stack justify='center' align='center' gap="xs" pr={35}>
                                                <Box w={100} h={100}>
                                                    <Image
                                                        radius="xl"
                                                        src={doctor.users.avatar}
                                                        h={100}
                                                        fallbackSrc={DoctorAvatarDefault}
                                                    />
                                                </Box>

                                                <Text fw={700}>{doctor.role.name}</Text>
                                                <Text mt={-10}>{doctor.users.firstName} {doctor.users.lastName}</Text>
                                                {doctor.users.specialize ? <Text mt={-10} c={'gray'}>Chuyên khoa {doctor.users.specialize}</Text> : null}
                                            </Stack>
                                        ))}
                                        <Stack>
                                        </Stack>
                                    </Group>
                                </Stack>
                            </Paper>
                            <Paper w="100%" h='100%' withBorder shadow="md" radius="md">
                                <Stack p={20} justify='flex-start' align='flex-start'>
                                    <Text fw={700} size='25px'>Dịch vụ</Text>
                                    {services ? (
                                        <Table withTableBorder withColumnBorders>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th>Dịch vụ</Table.Th>
                                                    <Table.Th>Giá</Table.Th>
                                                    <Table.Th>Mô tả</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {services.map((service) => (
                                                    <Table.Tr
                                                    >
                                                        <Table.Td>{service.serviceName}</Table.Td>
                                                        {service.price ? (
                                                        <Table.Td><CurrencyFormatter value={service.price} /></Table.Td>
                                                        ) : 
                                                        (
                                                            <Table.Td></Table.Td>
                                                        )}
                                                        <Table.Td>{service.description}</Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    ) : null}
                                </Stack>
                            </Paper>
                        </Stack>

                    </GridCol>

                </Grid>

            </Center>
            <Paper w="100%" h='100%' withBorder shadow="md" radius="md" mb={30}>
                <Stack p={20}>
                    <Text fw={700} size='25px'>Tin tức, Quảng cáo</Text>
                    <Group>
                        {news && news.slice(0, 4).map((news) => (

                            <Card withBorder radius="md" p="md" mr={27} w={250} h={250} bg={'light-dark(var(--mantine-color-white), var(--mantine-color-dark-7)'}>
                                <Card.Section>
                                    <Image src={news.logo} fallbackSrc={NewsLogoDefault} height={150} />
                                </Card.Section>

                                <Card.Section m={5}>
                                    <Center>
                                    <Text fz="lg" fw={700}>
                                        {news.title}
                                    </Text>
                                    </Center>
                                    {/* <Divider/>
                                    
                                    <Text fz="sm" mt="md" >
                                        {advertise.content}
                                    </Text> */}
                                </Card.Section>
                            </Card>
                        ))}
                    </Group>
                </Stack>
            </Paper>
        </div>
    );
};

export default ClinicDetailPage;

import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text, Group, Image, Flex, Stack, Button, Center, Divider, Grid, TextInput, Paper, GridCol } from '@mantine/core';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { IClinic } from '@/types';
import ClinicLogoDefault from '@/assets/images/hospital-logo.png';
import { useParams } from 'react-router-dom';
import { clinicApi } from '@/services';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiMail, FiPhone } from "react-icons/fi";

const ClinicDetailPage = () => {
    const { id: clinicId } = useParams();
    const { data: clinic, isLoading } = useQuery('clinic', () => getClinicDetail());

    const getClinicDetail = async () => {
        try {
            const response = await clinicApi.getClinicDetail(clinicId ?? '');
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Center m={20}>
            <Grid>
                <GridCol w={200} span={5}>
                    <Paper w="100%" h='100%' withBorder shadow="md" radius="md">
                        <Stack justify='center' align='center'>
                            <Box w={250} h={250} pt={30}>
                                <Image
                                    pl={20}
                                    pr={30}
                                    radius="xl"
                                    src={clinic?.logo}
                                    h={200}
                                    fallbackSrc={ClinicLogoDefault}
                                />
                            </Box>
                            <Text fw={700} size='30px' c={'primary.3'}>{clinic?.name}</Text>
                        </Stack >
                        <Divider my={'md'} />
                        <Center>
                            <Stack >
                                <Group pt={20}>
                                    <HiOutlineLocationMarker size={'20px'} />
                                    <Text>
                                        {clinic?.address}
                                    </Text>
                                </Group>
                                <Group>
                                    <FiMail size={'20px'} />
                                    <Text>
                                        {clinic?.email}
                                    </Text>
                                </Group>
                                <Group pb={20}>
                                    <FiPhone size={'20px'} />
                                    <Text>
                                        {clinic?.phone}
                                    </Text>
                                </Group>
                            </Stack>
                        </Center>



                    </Paper>
                </GridCol>
                <GridCol w={1200} span={7}>
                    <Paper w="100%" h='100%' withBorder shadow="md" radius="md">
                        <Stack p={20}>
                            <Text fw={700} size='25px'>Giới thiệu {clinic?.name}</Text>
                            <Text>{clinic?.description}</Text>
                        </Stack>



                    </Paper>
                </GridCol>

            </Grid>
        </Center>
    );
};

export default ClinicDetailPage;

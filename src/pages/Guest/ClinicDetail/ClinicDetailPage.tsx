import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import { Box, Title, Text, Group, Image, Flex, Stack, Button, Center, Divider, Grid, TextInput, Paper, GridCol, Table, Card, Badge, TypographyStylesProvider } from '@mantine/core';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { IClinic } from '@/types';
import ClinicLogoDefault from '@/assets/images/hospital-logo.png';
import DoctorAvatarDefault from '@/assets/images/doctor-avatar.png';
import NewsLogoDefault from '@/assets/images/news-logo.png';
import { Link, Navigate, useParams } from 'react-router-dom';
import { clinicApi, staffApi, clinicServiceApi, newsApi } from '@/services';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiMail, FiPhone } from "react-icons/fi";
import { CurrencyFormatter } from '@/components';
import Map, { Marker, FullscreenControl, NavigationControl, AttributionControl } from 'react-map-gl';
import { IoLocation } from 'react-icons/io5';
import { PATHS } from '@/config';
import { PERMISSION } from '@/enums';

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
      if (!clinicId) return null;
      const response = await clinicServiceApi.getClinicServices(clinicId, false);
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
        pageSize: 4,
        pageIndex: 0,
      });
      return response.data?.data;
    } catch (error) {
      console.log(error);
    }
  }

  const filteredDoctors = doctors
    ?.filter(doctor => doctor?.role?.permissions?.some(p => p?.id === PERMISSION.PERFORM_SERVICE))
    ?.slice(0, 4);

  if (!isLoading && !clinic) return <Navigate to={PATHS.CLINICS} />
  console.log(services?.length)

  return (
    <div className='max-w-screen-xl mx-auto w-full'>
      <Center my={20} w='100%'>
        <Grid w='100%'>
          <GridCol span={5}>
            <Paper w="100%" withBorder shadow="md" radius="md">
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
              <Divider my={'md'} pb={16} />
              <Center px={26}>
                <Stack pb={20}>
                  {clinic?.address ? (
                    <Flex>
                      <Box w={20} h={20}>
                        <HiOutlineLocationMarker size={'20px'} />
                      </Box>
                      <Text ml={16}>
                        {clinic?.address}
                      </Text>
                    </Flex>) : null}
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

            <Paper mt={16} w="100%" h={470} withBorder shadow="md" radius="md">
              <Text fw={700} size='18px' ml={10} my={15}>Bản đồ</Text>
              {clinic && clinic.lat && clinic.long && (
                <Map
                  mapboxAccessToken="pk.eyJ1IjoiY29uZ3R1YW4wMTA0IiwiYSI6ImNsczF2eXRxYTBmbmcya2xka3B6cGZrMnQifQ.AHAzE7JIHyehx-m1YJbzFg"
                  initialViewState={{
                    zoom: 15,
                    latitude: clinic.lat,
                    longitude: clinic.long
                  }}
                  scrollZoom={true}
                  style={{ width: '96%', height: 400, marginTop: 10, marginLeft: 8 }}
                  mapStyle="mapbox://styles/mapbox/streets-v12"
                  attributionControl={false}
                >
                  <FullscreenControl />
                  <NavigationControl />
                  <Marker latitude={clinic.lat} longitude={clinic.long}>
                    <IoLocation style={{ color: 'red' }} size={40} />
                  </Marker>
                  <AttributionControl customAttribution={clinic.name} />
                </Map>)}
            </Paper>
          </GridCol>
          <GridCol span={7}>
            <Stack w={'100%'} h={'100%'}>
              <Paper w="100%" h='100%' withBorder shadow="md" radius="md">
                <Stack p={20}>
                  <Text fw={700} size='18px'>Giới thiệu</Text>
                  <TypographyStylesProvider>
                    <div
                      className="ml-[8px]"
                      dangerouslySetInnerHTML={{ __html: clinic?.description || '' }} />
                  </TypographyStylesProvider>
                </Stack>
              </Paper>
              <Paper w="100%" h='100%' withBorder shadow="md" radius="md">
                <Stack p={20}>
                  <Text fw={700} size='18px'>Đội ngũ bác sĩ</Text>
                  <Group>
                    {filteredDoctors?.length === 0 ?
                      (<Text>Chưa có thông tin về bác sĩ phòng khám</Text>)
                      : (filteredDoctors && filteredDoctors.map((doctor) => (

                        <Stack justify='center' align='center' gap="xs" pr={35}>
                          <Box w={100} h={100} component={Link} to={`${doctor.id}`}>
                            <Image
                              radius="50%"
                              src={doctor.users.avatar}
                              h={100}
                              fallbackSrc={DoctorAvatarDefault}
                            />
                          </Box>

                          <Text fw={700}>{doctor.role.name}</Text>
                          <Text mt={-10}>{doctor.users.firstName} {doctor.users.lastName}</Text>
                          {doctor.specialize ? <Text mt={-10} c={'gray.5'}>{doctor.specialize}</Text> : null}
                        </Stack>
                      )))}
                    <Stack>
                    </Stack>
                  </Group>
                </Stack>
              </Paper>
              <Paper w="100%" h='100%' withBorder shadow="md" radius="md">
                <Stack p={20} justify='flex-start' align='flex-start'>
                  <Text fw={700} size='18px'>Bảng giá dịch vụ</Text>
                  {services?.length === 0 || services?.length === undefined ?
                    (<Text>Chưa có thông tin về dịch vụ của phòng khám</Text>)
                    :
                    (
                      services ? (
                        <Table withTableBorder withColumnBorders>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Tên dịch vụ</Table.Th>
                              <Table.Th>Giá</Table.Th>
                              <Table.Th>Mô tả</Table.Th>
                              <Table.Th ta='center'>Đăng ký dịch vụ</Table.Th>
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
                                <Table.Td><Button w='100%' variant="white">Đăng ký</Button></Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      ) : null
                    )}

                </Stack>
              </Paper>
              <Paper w="100%" h='100%' withBorder shadow="md" radius="md" mb={30}>
                <Stack p={20}>
                  <Flex justify='space-between' align='center' gap={20}>
                    <Text fw={700} size='18px'>Tin tức, thông báo</Text>
                    <Text fw={500} size='14px' component={Link} to={PATHS.NEWS}>Xem tất cả tin tức</Text>
                  </Flex>


                  {news?.length === 0 ?
                    (<Text>Chưa có thông về tin tức của phòng khám</Text>)
                    :
                    (
                      <Grid>
                        {news && news.map((news) => (

                          <Grid.Col span={4}>
                            <Card withBorder radius="md" p="md" w={'100%'} h={'100%'} bg={'white'} component={Link} to={`${PATHS.NEWS}/${news.id}`}>
                              <Card.Section>
                                <Image src={news.logo} fallbackSrc={NewsLogoDefault} height={150} />
                              </Card.Section>

                              <Card.Section m={5}>
                                <Center>
                                  <Text fz="md" fw={500}>
                                    {news.title}
                                  </Text>
                                </Center>
                              </Card.Section>
                            </Card>
                          </Grid.Col>
                        ))}
                      </Grid>
                    )}
                </Stack>
              </Paper>
            </Stack>
          </GridCol>
        </Grid>
      </Center>
    </div>
  );
};

export default ClinicDetailPage;

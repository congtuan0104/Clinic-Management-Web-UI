import { ClinusTable, ModalAppointmentDetail } from "@/components";
import { Calendar } from '@mantine/dates';
import { PATHS } from "@/config";
import { APPOINTMENT_STATUS, Gender, MEDICO_PAYMENT_STATUS, MEDICO_RECORD_STATUS } from "@/enums";
import { useAppSelector } from "@/hooks";
import { appointmentApi, medicalRecordApi, patientApi } from "@/services";
import { userInfoSelector } from "@/store";
import { IAppointment, IMedicalRecord } from "@/types";
import { Paper, Text, Image, Flex, Grid, TextInput as MantineTextInput, Button, Avatar, Badge, Tooltip, ActionIcon, Indicator, Tabs } from "@mantine/core";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { FaCalendarDays, FaEye } from "react-icons/fa6";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { FaHistory } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";

const PatientOverviewPage = () => {

  const userInfo = useAppSelector(userInfoSelector);

  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | undefined>();
  const [openedDetail, { open: openDetail, close: closeDetail }] = useDisclosure(false);

  // lấy dữ liệu từ api
  const { data } = useQuery(
    ['medical_records'],
    () => medicalRecordApi.getMedicalRecords({ puid: userInfo?.id })
      .then(res => res.data),
    {
      enabled: !!userInfo?.id,
    }
  );

  const { data: data2 } = useQuery(
    ['appointments'],
    () => appointmentApi.getAppointmentList({
      puid: userInfo?.id,
    }).then(res => res.data), {
    enabled: !!userInfo?.id,
  })

  const records = data?.filter(record =>
    record.examinationStatus === MEDICO_RECORD_STATUS.DONE &&
    record.paymentStatus === MEDICO_PAYMENT_STATUS.PAID)

  const appointments = data2?.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))

  const columns = useMemo<MRT_ColumnDef<IMedicalRecord>[]>(
    () => [
      {
        header: "Ngày khám",
        id: 'dateCreated',
        accessorFn: (dataRow) => dayjs(dataRow.dateCreated).format('DD/MM/YYYY'),
      },
      {
        header: 'Nơi khám',
        id: 'clinic',
        accessorFn: (dataRow) =>
          <div className='flex items-center'>
            <Avatar
              src={dataRow.clinic.logo}
              size={40}
              alt={dataRow.clinic.name}
              radius="xl" >
              {dataRow.clinic.name?.charAt(0)}
            </Avatar>
            <div className='flex flex-col flex-1 ml-2'>
              <Tooltip label='Xem thông tin phòng khám'>
                <Link to={`${PATHS.CLINICS}/${dataRow.clinic.id}`} className='text-primary-300'>
                  {dataRow.clinic.name}
                </Link>
              </Tooltip>
              {/* <p className='text-gray-500'>{dataRow.clinic.address}</p> */}
            </div>
          </div>,
      },
      {
        header: 'Bác sĩ khám',
        id: 'doctor',
        accessorFn: (dataRow) =>
          <div className='flex items-center'>
            <Avatar
              src={dataRow.doctor.avatar}
              size={40}
              alt={dataRow.doctor.lastName}
              radius="xl" >
              {dataRow.doctor.lastName?.charAt(0)}
            </Avatar>
            <div className='flex flex-col flex-1 ml-2'>
              <p className='text-primary-300'>{dataRow.doctor.firstName} {dataRow.doctor.lastName}</p>
              <p className='text-gray-500'>{dataRow.doctor.email}</p>
            </div>
          </div>,
      },
      {
        header: 'Lý do khám',
        accessorKey: 'note',
        enableSorting: false,
      },
      {
        header: 'Kết luận khám',
        accessorKey: 'result',
        enableSorting: false,
      },

    ],
    [],
  );

  const appointmentColumns = useMemo<MRT_ColumnDef<IAppointment>[]>(
    () => [
      {
        header: 'Người hẹn khám',
        id: 'patient',
        accessorFn: (dataRow) =>
          <div className='flex items-center'>
            <Avatar
              src={dataRow.patient.avatar}
              size={40}
              alt={dataRow.patient.lastName}
              radius="xl" >
              {dataRow.patient.lastName?.charAt(0)}
            </Avatar>
            <div className='flex flex-col flex-1 ml-2'>
              <p className='text-primary-300'>{dataRow.patient.firstName} {dataRow.patient.lastName}</p>
              <p className='text-gray-500'>{dataRow.patient.email}</p>
            </div>
          </div>,
        enableSorting: false,
        enableColumnFilter: false,
      },

      {
        header: 'Bác sĩ khám',
        id: 'doctor',
        accessorFn: (dataRow) =>
          <div className='flex items-center'>
            <Avatar
              src={dataRow.doctor.avatar}
              size={40}
              alt={dataRow.doctor.lastName}
              radius="xl" >
              {dataRow.doctor.lastName.charAt(0)}
            </Avatar>
            <div className='flex flex-col flex-1 ml-2'>
              <p className='text-primary-300'>{dataRow.doctor.firstName} {dataRow.doctor.lastName}</p>
              <p className='text-gray-500'>{dataRow.doctor.email}</p>
            </div>
          </div>,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        header: 'Thời gian hẹn',
        id: 'time',
        accessorFn: (dataRow) => <div className="bg-primary-300 text-13 p-1 rounded-md text-white flex flex-col items-center">
          <p>{dataRow.startTime} - {dataRow.endTime}</p>
          <p>{dayjs(dataRow.date).format('DD MMM YYYY')}</p>
        </div>,
      },
      {
        header: 'Yêu cầu dịch vụ',
        accessorKey: 'clinicServices.serviceName',
      },
      {
        header: 'Trạng thái',
        id: 'status',
        accessorFn: (dataRow) => <Badge
          color={dataRow.status === APPOINTMENT_STATUS.PENDING ? 'yellow.5' :
            dataRow.status === APPOINTMENT_STATUS.CONFIRM ? 'green.5' :
              dataRow.status === APPOINTMENT_STATUS.CHECK_IN ? 'primary.3' : 'red.5'
          }
        >
          {dataRow.status}
        </Badge>
      },
    ],
    [],
  );

  return (
    <div className="max-w-screen-xl mx-auto my-5">
      <Grid>
        <Grid.Col span={9}>
          <Paper p='md' radius='md' shadow="xs">
            <Flex justify='space-between'>
              <Text c='primary.3' fw={600}>Thông tin cá nhân</Text>
              <Button component={Link} to={`${PATHS.PROFILE}?editMode=true`}>
                Cập nhật thông tin
              </Button>
            </Flex>
            <Flex gap={30} mt='md' align='center'>
              <Image
                src={userInfo?.avatar}
                h={220}
                w={220}
                radius='50%'
                alt={userInfo?.lastName}
                fallbackSrc='/assets/images/patient-placeholder.png'
              />
              <Grid>
                <Grid.Col span={5}>
                  <MantineTextInput
                    label="Họ và tên"
                    value={`${userInfo?.firstName} ${userInfo?.lastName}`}
                    readOnly
                    variant='filled'
                    size='md'
                  />
                </Grid.Col>
                <Grid.Col span={3.5}>
                  <MantineTextInput
                    label="Giới tính"
                    value={userInfo?.gender === Gender.Male ? 'Nam'
                      : userInfo?.gender === Gender.Female ? 'Nữ' : 'Chưa có thông tin'}
                    readOnly
                    variant='filled'
                    size='md'
                  />
                </Grid.Col>
                <Grid.Col span={3.5}>
                  <MantineTextInput
                    label="Tuổi"
                    value={userInfo?.birthday
                      ? dayjs().diff(userInfo?.birthday, 'year')
                      : 'Chưa có thông tin'}
                    readOnly
                    variant='filled'
                    size='md'
                  />
                </Grid.Col>


                <Grid.Col span={6}>
                  <MantineTextInput
                    label="Email"
                    value={userInfo?.email}
                    readOnly
                    variant='filled'
                    size='md'
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <MantineTextInput
                    label="Số điện thoại"
                    value={userInfo?.phone || 'Chưa có thông tin'}
                    readOnly
                    variant='filled'
                    size='md'
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <MantineTextInput
                    label="Địa chỉ"
                    value={userInfo?.address || 'Chưa có thông tin'}
                    readOnly
                    variant='filled'
                    size='md'
                  />
                </Grid.Col>

              </Grid>
            </Flex>

          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p='md' radius='md' shadow="xs" h={'100%'}>
            <Calendar
              static
              renderDay={(date) => {
                const day = date.getDate();
                return (
                  <Indicator size={6} color="red" offset={-2} disabled={dayjs().diff(date, 'date') !== 0}>
                    <div className="hover:bg-ray-300">{day}</div>
                  </Indicator>
                );
              }}
            />
          </Paper>
        </Grid.Col>
      </Grid>

      <Tabs defaultValue="appointment" mt={20} variant="pills">
        <Tabs.List>
          <Tabs.Tab value="appointment" leftSection={<FaCalendarDays />}>
            Lịch hẹn khám
          </Tabs.Tab>
          <Tabs.Tab value="record" leftSection={<FaHistory />}>
            Lịch sử khám bệnh
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="appointment">
          <div className="mt-1.5">
            <ClinusTable
              columns={appointmentColumns}
              data={appointments || []}
              enableRowNumbers={false}
              renderTopToolbar={() => (
                <Flex justify='space-between' align='center' mt={16} mb={10} ml={16} mr={10}>
                  <Text c='primary.3' fw={600}>Lịch hẹn khám</Text>
                  <Button color="secondary.3" component={Link} to='/dat-lich-hen'>
                    Đặt lịch hẹn
                  </Button>
                </Flex>
              )}
              getRowId={(row) => row.id.toString()}
              // state={{
              //   isLoading: isLoading,
              // }}
              enableRowActions
              displayColumnDefOptions={{
                'mrt-row-actions': {
                  mantineTableHeadCellProps: {
                    align: 'right',
                  },
                }
              }}
              renderRowActions={({ row }) => (
                <Flex align='center' justify='flex-end' gap={10}>
                  <Tooltip label='Xem chi tiết lịch hẹn'>
                    <ActionIcon
                      variant='outline'
                      color='blue'
                      radius='sm'
                      onClick={() => {
                        setSelectedAppointment(row.original)
                        openDetail()
                      }}
                    >
                      <FaEye />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
              )}
              localization={{
                noRecordsToDisplay: 'Bạn chưa có lịch hẹn nào',
              }}
            />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="record">
          <div className="mt-1.5">
            <ClinusTable
              columns={columns}
              data={records || []}
              enableRowActions
              enableColumnFilters={false}
              enableRowNumbers={false}
              // state={{
              //   isLoading: isLoading,
              // }}
              renderTopToolbar={() => (<Text c='primary.3' fw={600} mt={16} mb={10} ml={16}>Lịch sử khám bệnh</Text>)}

              getRowId={(row) => row.id.toString()}
              displayColumnDefOptions={{
                'mrt-row-actions': {
                  mantineTableHeadCellProps: {
                    align: 'right',
                  },
                }
              }}
              renderRowActions={({ row }) => (
                <Flex align='center' justify='flex-end' gap={10}>
                  <Tooltip label='Xem chi tiết hồ sơ'>
                    <ActionIcon
                      variant='outline'
                      color='blue'
                      radius='sm'
                      component={Link}
                      to={`${PATHS.MEDICAL_RECORDS}/${row.id}`}
                    // onClick={() => handleOpenUpdateModal(row.original)} // xử lý khi chọn sửa dịch vụ
                    >
                      <FaEye />
                    </ActionIcon>
                  </Tooltip>

                </Flex>
              )}
            />
          </div>
        </Tabs.Panel>

      </Tabs>



      {selectedAppointment &&
        <ModalAppointmentDetail
          isOpen={openedDetail}
          onClose={closeDetail}
          onUpdateSuccess={() => { }}
          data={selectedAppointment} />
      }
    </div>
  );
};

export default PatientOverviewPage;
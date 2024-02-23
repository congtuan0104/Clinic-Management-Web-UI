import { Calendar, ClinusTable, ModalAddAppointment, ModalAppointmentDetail } from "@/components"
import { CalendarEvent, IAppointment } from "@/types";
import { ActionIcon, Avatar, Badge, Button, Flex, Select, Text, Title, Tooltip } from "@mantine/core"
import { useEffect, useMemo, useState } from "react"
import { FaCalendarDays, FaUserDoctor } from "react-icons/fa6";
import { FaEye, FaRegCalendarPlus, FaRegEdit, FaThList, FaTrash } from "react-icons/fa";
import { GrStatusInfo } from "react-icons/gr";
import { APPOINTMENT_STATUS, PERMISSION } from "@/enums";
import { useDisclosure } from "@mantine/hooks";
import { DateInput } from '@mantine/dates';
import { SlotInfo } from "react-big-calendar";
import { useQuery } from "react-query";
import { appointmentApi, staffApi } from "@/services";
import { useAppSelector } from "@/hooks";
import { currentClinicSelector } from "@/store";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";

interface ISearchTerm {
  doctor?: number | null;
  date?: Date | null;
  status?: string | null;
}

const AppointmentPage = () => {
  const [openedAdd, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [openedDetail, { open: openDetail, close: closeDetail }] = useDisclosure(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | undefined>();
  const [mode, setMode] = useState<'list' | 'calendar'>('list')
  const [searchTerm, setSearchTerm] = useState<ISearchTerm>({
    doctor: undefined,
    date: new Date(),
    status: undefined,
  })

  const currentClinic = useAppSelector(currentClinicSelector);

  const { data: appointments, isLoading, refetch } = useQuery(
    ['appointments', currentClinic?.id, dayjs().format('YYYY-MM-DD')],
    () => appointmentApi.getAppointmentList({
      clinicId: currentClinic?.id,
      doctorId: searchTerm.doctor ?? undefined,
      date: searchTerm.date ? dayjs(searchTerm.date).format('YYYY-MM-DD') : undefined,
      status: searchTerm.status || undefined,
    }).then(res => res.data), {
    refetchOnWindowFocus: false,
    enabled: !!currentClinic?.id,
  })

  const { data: staffs } = useQuery(
    ['doctors'],
    () => staffApi.getStaffs({ clinicId: currentClinic?.id })
      .then(
        res => res.data?.
          filter(staff => staff.role.permissions.
            map(p => p.id).
            includes(PERMISSION.PERFORM_SERVICE))
      ),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const handleSelectAppointment = (event: CalendarEvent<IAppointment>) => {
    const appointment = event.resource;
    if (appointment) {
      setSelectedAppointment(appointment)
      openDetail();
    }
  }

  useEffect(() => {
    refetch();
  }, [searchTerm])

  const columns = useMemo<MRT_ColumnDef<IAppointment>[]>(
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

  const events = useMemo(() => {
    if (!appointments) return undefined;
    const appointmentEvents: Array<CalendarEvent<IAppointment>> = appointments.map(appointment => {
      const startTime = dayjs(`${appointment.date} ${appointment.startTime}`).toDate();
      const endTime = dayjs(`${appointment.date} ${appointment.endTime}`).toDate();
      return {
        title: `${appointment.clinicServices.serviceName} (Bs. ${appointment.doctor.firstName} ${appointment.doctor.lastName})`,
        start: startTime,
        end: endTime,
        resource: appointment,
      }
    })
    return appointmentEvents;
  }, [appointments])


  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (slotInfo.start < new Date()) return;
    setSelectedDate(slotInfo.start)
    openAdd();
  }

  const renderCalendarViewMode = () => {
    return (
      <div className="h-[900px] bg-white p-3 rounded-md">
        <Calendar
          defaultView='week'
          events={events}
          popup={true}
          // timeslots={4}
          step={15}
          dayLayoutAlgorithm='no-overlap'
          onSelectEvent={handleSelectAppointment}
          onSelectSlot={handleSelectSlot}
          // views={['week', 'day']}
          // toolbar={false}
          // resourceTitleAccessor={event => event.title}
          // min={new Date('2027-01-09T22:00:00-05:00')}
          // max={new Date('2023-01-09T06:00:00-05:00')}
          selectable
          eventPropGetter={event => {
            const status = event.resource && event.resource.status
            let bgColor;
            switch (status) {
              case APPOINTMENT_STATUS.PENDING:
                bgColor = '#FFC107'
                break;
              case APPOINTMENT_STATUS.CONFIRM:
                bgColor = '#28A745'
                break;
              case APPOINTMENT_STATUS.CHECK_IN:
                bgColor = '#007BFF'
                break;
              case APPOINTMENT_STATUS.CANCEL:
                bgColor = '#DC3545'
                break;
              default:
                bgColor = '#FFC107'
                break;
            }
            return {
              style: {
                backgroundColor: bgColor,
              }
            }
          }}
        />
      </div>
    )
  }

  const renderListViewMode = () => {
    return <ClinusTable
      columns={columns}
      data={appointments || []}
      enableRowNumbers={false}
      enableTopToolbar={false}
      mantineSearchTextInputProps={
        {
          placeholder: 'Tìm kiếm người đặt lịch hẹn, bác sĩ khám bệnh',
          styles: { wrapper: { width: '300px' } },
          radius: 'md',
        }
      }
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
        noRecordsToDisplay: 'Không có lịch hẹn nào trong khoảng thời gian này',
      }}
    />
  }

  return (
    <>
      <div className="p-3">
        <div className="mb-3 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <Title order={4}>Lịch hẹn khám</Title>
            {/* {selectedAppointment && <Text>Lịch hẹn được chọn là: {selectedAppointment.id}</Text>} */}
            <Button.Group>
              <Tooltip label='Xem theo dạng danh sách' position="bottom">
                <Button
                  variant={mode === 'list' ? 'filled' : 'outline'}
                  color="primary.3"
                  h={38}
                  onClick={() => setMode('list')}
                >
                  <FaThList size={20} />
                </Button>
              </Tooltip>
              <Tooltip label='Xem theo dạng lịch' position="bottom">
                <Button
                  variant={mode === 'calendar' ? 'filled' : 'outline'}
                  h={38}
                  color="primary.3"
                  onClick={() => setMode('calendar')}
                >
                  <FaCalendarDays size={22} />
                </Button>
              </Tooltip>
            </Button.Group>
          </div>
          <div className="flex gap-2">
            <Select
              w={250}
              placeholder="Bác sĩ khám bệnh"
              leftSection={<FaUserDoctor size={18} />}
              clearable
              allowDeselect
              data={staffs?.map(staff => {
                return {
                  value: staff.id.toString(),
                  label: `${staff.users.firstName} ${staff.users.lastName}`
                }
              })}
              styles={{
                input: {
                  height: 40,
                },
              }}
              value={searchTerm.doctor?.toString()}
              onChange={(value) => value && setSearchTerm({ ...searchTerm, doctor: Number(value) })}
            />
            <DateInput
              w={200}
              placeholder="Ngày hẹn khám"
              valueFormat="DD-MM-YYYY"
              leftSection={<FaCalendarDays size={18} />}
              value={searchTerm.date}
              onChange={(value) => setSearchTerm({ ...searchTerm, date: value })}
              allowDeselect
              clearable
              styles={{
                input: {
                  height: 40,
                },
              }}
            />

            <Select
              w={200}
              placeholder="Trạng thái lịch hẹn"
              data={[
                APPOINTMENT_STATUS.PENDING,
                APPOINTMENT_STATUS.CONFIRM,
                APPOINTMENT_STATUS.CHECK_IN,
                APPOINTMENT_STATUS.CANCEL,

              ]}
              allowDeselect
              clearable
              leftSection={<GrStatusInfo size={18} />}
              value={searchTerm.status}
              onChange={(value) => setSearchTerm({ ...searchTerm, status: value })}
              styles={{
                input: {
                  height: 40,
                },
              }}
            />


          </div>

          <Button
            h={40}
            color="secondary.3"
            onClick={() => openAdd()}
            leftSection={<FaRegCalendarPlus size={20} />}
          >
            Lịch hẹn mới
          </Button>
        </div>

        {mode === 'calendar' ? renderCalendarViewMode() : renderListViewMode()}

      </div>

      <ModalAddAppointment
        isOpen={openedAdd}
        onClose={closeAdd}
        date={selectedDate}
        onSuccess={() => refetch()}
      />

      {selectedAppointment &&
        <ModalAppointmentDetail
          isOpen={openedDetail}
          onClose={closeDetail}
          onUpdateSuccess={() => refetch()}
          data={selectedAppointment} />
      }
    </>
  )
}

export default AppointmentPage
import { Calendar, ModalAddAppointment, ModalAppointmentDetail } from "@/components"
import { CalendarEvent, IAppointment } from "@/types";
import { ActionIcon, Button, Select, Text, Title, Tooltip } from "@mantine/core"
import { useMemo, useState } from "react"
import { FaCalendarDays } from "react-icons/fa6";
import { FaRegCalendarPlus, FaThList } from "react-icons/fa";
import { APPOINTMENT_STATUS } from "@/enums";
import { useDisclosure } from "@mantine/hooks";
import { DateInput } from '@mantine/dates';
import { SlotInfo } from "react-big-calendar";

const appointments: Array<IAppointment> = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Doctor 1',
    patientId: '1',
    patientName: 'Patient 1',
    startTime: new Date('2024-01-09T13:45:00-05:00'),
    endTime: new Date('2024-01-09T14:00:00-05:00'),
    note: 'Note 1',
    status: APPOINTMENT_STATUS.BOOK,
  },
  {
    id: '2',
    doctorId: '2',
    doctorName: 'Doctor 2',
    patientId: '2',
    patientName: 'Patient 2',
    startTime: new Date('2024-01-09T15:45:00-05:00'),
    endTime: new Date('2024-01-09T16:00:00-05:00'),
    note: 'Note 2',
    status: APPOINTMENT_STATUS.CANCEL,
  },
  {
    id: '3',
    doctorId: '3',
    doctorName: 'Doctor 3',
    patientId: '3',
    patientName: 'Patient 3',
    startTime: new Date('2024-01-09T15:45:00-05:00'),
    endTime: new Date('2024-01-09T16:15:00-05:00'),
    note: 'Note 3',
    status: APPOINTMENT_STATUS.CHECK_IN,
  },
  {
    id: '4',
    doctorId: '4',
    doctorName: 'Doctor 4',
    patientId: '4',
    patientName: 'Patient 4',
    startTime: new Date('2024-01-09T16:45:00-05:00'),
    endTime: new Date('2024-01-09T17:00:00-05:00'),
    note: 'Note 4',
    status: APPOINTMENT_STATUS.CHECK_OUT,
  },
  {
    id: '5',
    doctorId: '5',
    doctorName: 'Doctor 5',
    patientId: '5',
    patientName: 'Patient 5',
    startTime: new Date('2024-01-09T17:45:00-05:00'),
    endTime: new Date('2024-01-09T18:00:00-05:00'),
    note: 'Note 5',
    status: APPOINTMENT_STATUS.BOOK,
  }
]

const AppointmentPage = () => {
  const [openedAdd, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [openedDetail, { open: openDetail, close: closeDetail }] = useDisclosure(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | undefined>();
  const [mode, setMode] = useState<'list' | 'calendar'>('calendar')

  const handleSelectAppointment = (event: CalendarEvent<IAppointment>) => {
    console.log(event)
    const appointment = event.resource;
    if (appointment) {
      setSelectedAppointment(appointment)
      openDetail();
    }
  }

  const events: Array<CalendarEvent<IAppointment>> = useMemo(() => {
    return appointments.map(appointment => {
      return {
        title: appointment.patientName,
        start: appointment.startTime,
        end: appointment.endTime,
        resource: appointment,
      }
    })
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
              case APPOINTMENT_STATUS.BOOK:
                bgColor = '#FFC107'
                break;
              case APPOINTMENT_STATUS.CHECK_IN:
                bgColor = '#28A745'
                break;
              case APPOINTMENT_STATUS.CHECK_OUT:
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
    return <>
      Table
    </>
  }

  return (
    <>
      <div className="p-3">
        <div className="mb-3 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <Title order={3}>Lịch hẹn khám</Title>
            {/* {selectedAppointment && <Text>Lịch hẹn được chọn là: {selectedAppointment.id}</Text>} */}
            <Button.Group>
              <Tooltip label='Xem theo dạng lịch' position="bottom">
                <Button
                  variant={mode === 'calendar' ? 'filled' : 'outline'}
                  h={40}
                  color="primary"
                  onClick={() => setMode('calendar')}
                >
                  <FaCalendarDays size={22} />
                </Button>
              </Tooltip>

              <Tooltip label='Xem theo dạng danh sách' position="bottom">
                <Button
                  variant={mode === 'list' ? 'filled' : 'outline'}
                  color="primary"
                  h={40}
                  onClick={() => setMode('list')}
                >
                  <FaThList size={20} />
                </Button>
              </Tooltip>

            </Button.Group>
          </div>
          <div className="flex gap-2">
            <Select
              w={250}
              placeholder="Bác sĩ khám bệnh"
              data={['Tất cả bác sĩ', 'Angular', 'Vue', 'Svelte']}
              searchable
              styles={{
                input: {
                  height: 40,
                },
              }}
            />
            <DateInput
              w={200}
              placeholder="Ngày hẹn khám"
              valueFormat="DD-MM-YYYY"
              rightSection={<FaCalendarDays size={18} />}
              styles={{
                input: {
                  height: 40,
                },
              }}
            />

            <Select
              w={200}
              placeholder="Trạng thái lịch hẹn"
              data={['Chưa xác nhận', 'Đã xác nhận', 'Đã đến hẹn', 'Hủy hẹn']}
              searchable
              styles={{
                input: {
                  height: 40,
                },
              }}
            />


          </div>

          <Button
            h={40}
            color="secondary"
            onClick={() => openAdd()}
            leftSection={<FaRegCalendarPlus size={20} />}
          >
            Lịch hẹn mới
          </Button>
        </div>

        {mode === 'calendar' ? renderCalendarViewMode() : renderListViewMode()}

      </div>

      <ModalAddAppointment isOpen={openedAdd} onClose={closeAdd} date={selectedDate} />

      {selectedAppointment &&
        <ModalAppointmentDetail isOpen={openedDetail} onClose={closeDetail} data={selectedAppointment} />
      }
    </>
  )
}

export default AppointmentPage
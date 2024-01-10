import { Calendar, ModalAppointmentDetail } from "@/components"
import { CalendarEvent, IAppointment } from "@/types";
import { ActionIcon, Button, Text, Title, Tooltip } from "@mantine/core"
import { useMemo, useState } from "react"
import { FaCalendarDays } from "react-icons/fa6";
import { FaThList } from "react-icons/fa";
import { APPOINTMENT_STATUS } from "@/enums";
import { useDisclosure } from "@mantine/hooks";

const AppointmentPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
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
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | undefined>();
  const [mode, setMode] = useState<'list' | 'calendar'>('calendar')

  const handleSelectAppointment = (event: CalendarEvent<IAppointment>) => {
    console.log(event)
    const appointment = event.resource;
    if (appointment) {
      setSelectedAppointment(appointment)
      open()
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
          // views={['week', 'day']}
          // toolbar={false}
          // resourceTitleAccessor={event => event.title}
          // min={new Date('2027-01-09T22:00:00-05:00')}
          // max={new Date('2023-01-09T06:00:00-05:00')}
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
          <Title order={3}>Lịch hẹn khám</Title>
          {/* {selectedAppointment && <Text>Lịch hẹn được chọn là: {selectedAppointment.id}</Text>} */}
          <div className="flex gap-2">
            <Tooltip label='Xem theo dạng lịch' position="bottom">
              <ActionIcon
                variant={mode === 'calendar' ? 'filled' : 'outline'}
                size={40}
                color="primary"
                onClick={() => setMode('calendar')}
              >
                <FaCalendarDays size={22} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label='Xem theo dạng danh sách' position="bottom">
              <ActionIcon
                variant={mode === 'list' ? 'filled' : 'outline'}
                color="primary"
                size={40}
                onClick={() => setMode('list')}
              >
                <FaThList size={20} />
              </ActionIcon>
            </Tooltip>

            <Button
              h={40}
            // onClick={() => { }}
            >
              Tạo lịch hẹn mới
            </Button>
          </div>
        </div>

        {mode === 'calendar' ? renderCalendarViewMode() : renderListViewMode()}

      </div>

      {selectedAppointment &&
        <ModalAppointmentDetail isOpen={opened} onClose={close} data={selectedAppointment} />
      }
    </>
  )
}

export default AppointmentPage
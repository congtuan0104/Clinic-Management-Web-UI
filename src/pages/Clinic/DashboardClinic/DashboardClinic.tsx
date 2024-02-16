import { useAppSelector } from '@/hooks';
import { currentClinicSelector, userInfoSelector } from '@/store';
import { Flex, Title, Text, ActionIcon, Tooltip, Badge, ThemeIcon } from '@mantine/core';
import { Sparkline } from '@mantine/charts';
import { PATHS } from '@/config';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { appointmentApi } from '@/services';
import dayjs from 'dayjs';
import { ModalAppointmentDetail } from '@/components';
import { useState } from 'react';
import { IAppointment } from '@/types';
import { FaArrowRight, FaBedPulse, FaCalendarDays, FaHospitalUser, FaUserDoctor } from 'react-icons/fa6';
import { APPOINTMENT_STATUS } from '@/enums';

const DashboardAdmin = () => {
  const userInfo = useAppSelector(userInfoSelector);
  const currentClinic = useAppSelector(currentClinicSelector);
  const navigate = useNavigate();

  const { data: appointments, isLoading, refetch } = useQuery(['appointments', dayjs().format('YYYY-MM-DD')],
    () => appointmentApi.getAppointmentList({
      clinicId: currentClinic?.id,
      date: dayjs().format('YYYY-MM-DD'),
    }).then(res => res.data), {
    enabled: !!currentClinic?.id,
  })

  const [appointment, setAppointment] = useState<IAppointment | undefined>(undefined);

  return (
    <div className='p-3'>
      <Title mb={15} order={3}>Tổng quan</Title>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[130px]">
        <div className='h-full bg-white rounded-xl p-6 flex gap-4'>
          <ThemeIcon color='red.5' variant='light' size={80} radius='md'>
            <FaHospitalUser size={55} />
          </ThemeIcon>
          <div className='flex flex-col'>
            <Text c='gray.7'>Bệnh nhân mới</Text>
            <Text c='primary.3' fz={40} fw={700}>0</Text>
          </div>

        </div>
        <div className='h-full bg-white rounded-xl p-6 flex gap-4'>
          <ThemeIcon color='teal.5' variant='light' size={80} radius='md'>
            <FaUserDoctor size={55} />
          </ThemeIcon>
          <div className='flex flex-col'>
            <Text c='gray.7'>Số nhân viên</Text>
            <Text c='primary.3' fz={40} fw={700}>10</Text>
          </div>
        </div>
        <div className='h-full bg-white rounded-xl p-6 flex gap-4'>
          <ThemeIcon color='yellow.5' variant='light' size={80} radius='md'>
            <FaBedPulse size={55} />
          </ThemeIcon>
          <div className='flex flex-col'>
            <Text c='gray.7'>Số ca khám bệnh</Text>
            <Text c='primary.3' fz={40} fw={700}>105</Text>
          </div>
        </div>
        <div className='h-full bg-white rounded-xl p-6 flex gap-4'>
          <ThemeIcon color='blue.5' variant='light' size={80} radius='md'>
            <FaCalendarDays size={55} />
          </ThemeIcon>
          <div className='flex flex-col'>
            <Text c='gray.7'>Số lịch hẹn</Text>
            <Text c='primary.3' fz={40} fw={700}>{appointments?.length || 0}</Text>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-2 rounded-lg">
          Doanh thu tháng 01/2024
          <Sparkline
            w={'100%'}
            h={400}
            data={[10, 20, 40, 20, 40, 10, 50]}
            curveType="bump"
            color="blue"
            fillOpacity={0.45}
            strokeWidth={1.7}
          />
        </div>
        <div className="col-span-1 py-2 px-3 rounded-lg bg-white">
          <div className='flex justify-between items-center'>
            <Text c='primary.3'>Lịch hẹn sắp diễn ra</Text>
            <Tooltip label='Xem tất cả lịch hẹn khám'>
              <ActionIcon variant='light' radius='xl' onClick={() => navigate(PATHS.CLINIC_APPOINTMENT)}>
                <FaArrowRight size={20} />
              </ActionIcon>
            </Tooltip>
          </div>

          <div className='flex flex-col mt-1'>
            {appointments?.slice(0, 4)?.map(appointment => (
              <div
                key={appointment.id}
                className='flex cursor-pointer hover:opacity-80 my-2 border-0 border-b border-solid border-gray-300 pb-2'
                onClick={() => setAppointment(appointment)}>
                <div className='flex flex-col border-solid border-red-500 rounded-md w-14 mr-3'>
                  <div className='bg-red-500 text-white text-12 text-center'>
                    {dayjs(appointment.date).format('MMM')}
                  </div>
                  <div className='text-gray-500 text-22 font-bold h-full flex items-center justify-center'>
                    {dayjs(appointment.date).format('DD')}
                  </div>
                </div>
                <div className='flex-1'>
                  <div>
                    Lịch hẹn bác sĩ {appointment.doctor.lastName}
                  </div>
                  <div className='flex justify-between w-full'>
                    <div className='flex-1'>
                      <div className='text-gray-600 text-13'>
                        {appointment.clinicServices.serviceName}
                      </div>
                      <div className='text-gray-600 text-13'>
                        Thời gian {appointment.startTime} - {appointment.endTime}
                      </div>
                    </div>
                    <Badge
                      color={appointment.status === APPOINTMENT_STATUS.PENDING ? 'yellow.5' :
                        appointment.status === APPOINTMENT_STATUS.CONFIRM ? 'green.5' :
                          appointment.status === APPOINTMENT_STATUS.CHECK_IN ? 'primary.3' : 'red.5'
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>

      {appointment && (
        <ModalAppointmentDetail
          isOpen={!!appointment}
          onClose={() => setAppointment(undefined)}
          data={appointment}
          onUpdateSuccess={() => {
            setAppointment(undefined);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default DashboardAdmin;

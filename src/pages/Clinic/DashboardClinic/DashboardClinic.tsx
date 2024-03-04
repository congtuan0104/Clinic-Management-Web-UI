import { useAppSelector } from '@/hooks';
import { currentClinicSelector, userInfoSelector } from '@/store';
import { Flex, Title, Text, ActionIcon, Tooltip, Badge, ThemeIcon, Paper } from '@mantine/core';
import { BarChart, Sparkline } from '@mantine/charts';
import { PATHS } from '@/config';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { appointmentApi, staffApi, statisticApi } from '@/services';
import dayjs from 'dayjs';
import { CurrencyFormatter, ModalAppointmentDetail } from '@/components';
import { useState } from 'react';
import { IAppointment } from '@/types';
import { FaArrowRight, FaBedPulse, FaCalendarDays, FaHospitalUser, FaUserDoctor } from 'react-icons/fa6';
import { APPOINTMENT_STATUS } from '@/enums';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { GrMoney } from 'react-icons/gr';
import { IoCalendarClearOutline } from 'react-icons/io5';
import classNames from 'classnames';

const DashboardClinic = () => {
  const userInfo = useAppSelector(userInfoSelector);
  const currentClinic = useAppSelector(currentClinicSelector);
  const navigate = useNavigate();

  const { data: appointments, refetch } = useQuery(
    ['appointments', currentClinic?.id, dayjs().format('YYYY-MM-DD')],
    () => appointmentApi.getAppointmentList({
      clinicId: currentClinic?.id,
      date: dayjs().format('YYYY-MM-DD'),
    }).then(res => res.data), {
    enabled: !!currentClinic?.id,
  })

  const { data: staffs } = useQuery(
    ['staffs', currentClinic?.id],
    () => staffApi.getStaffs({ clinicId: currentClinic?.id }).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
    }
  );

  const { data: statistic } = useQuery(
    ['statistic', currentClinic?.id],
    () => statisticApi.getStatistic({
      clinicId: currentClinic!.id,
      date: dayjs().format('YYYY-MM-DD'),
      // days: '10',
    })
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id,
    }
  );

  const { data } = useQuery(
    ['statistics', currentClinic?.id,
      dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD')],
    () => statisticApi.getStatisticByDate({
      clinicId: currentClinic!.id,
      startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
    })
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id,
    }
  );

  const statistics = data?.map((item) => ({
    date: dayjs(item.date).format('DD MMM'),
    revenue: item.revenue,
  }));

  const [appointment, setAppointment] = useState<IAppointment | undefined>(undefined);

  return (
    <div className='p-3'>
      <Title mb={15} order={3}>Tổng quan</Title>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[130px]">
        <div className='h-full bg-white rounded-xl p-6 pr-3 flex gap-4'>
          <ThemeIcon color='red.5' variant='light' size={80} radius='md'>
            <FaHospitalUser size={55} />
          </ThemeIcon>
          <div className='flex flex-col'>
            <Tooltip label='Số bệnh nhân mới đăng ký trong ngày hôm nay'>
              <div className='flex items-center text-gray-700 gap-1'>
                Bệnh nhân mới <FaRegQuestionCircle />
              </div>
            </Tooltip>
            <Text c='red.5' fz={40} fw={700}>{statistic?.totalPatients || 0}</Text>
          </div>

        </div>
        <div className='h-full bg-white rounded-xl p-6 pr-3 flex gap-4'>
          <ThemeIcon color='teal.5' variant='light' size={80} radius='md'>
            <FaUserDoctor size={55} />
          </ThemeIcon>
          <div className='flex flex-col'>
            <Tooltip label='Số nhân viên làm việc trong phòng khám này'>
              <div className='flex items-center text-gray-700 gap-1'>
                Nhân viên <FaRegQuestionCircle />
              </div>
            </Tooltip>
            <Text c='teal.5' fz={40} fw={700}>{staffs?.length || 0}</Text>
          </div>
        </div>
        <div className='h-full bg-white rounded-xl p-6 pr-3 flex gap-4'>
          <ThemeIcon color='yellow.5' variant='light' size={80} radius='md'>
            <GrMoney size={55} />
          </ThemeIcon>
          <div className='flex flex-col'>
            <Tooltip label='Doanh thu nhận được trong ngày'>
              <div className='flex items-center text-gray-700 gap-1'>
                Doanh thu <FaRegQuestionCircle />
              </div>
            </Tooltip>
            <Text c='yellow.5' fz={40} fw={700}>
              <CurrencyFormatter value={statistic?.totalRevenue || 0} />
            </Text>
          </div>
        </div>
        <div className='h-full bg-white rounded-xl p-6 flex gap-4'>
          <ThemeIcon color='blue.5' variant='light' size={80} radius='md'>
            <FaCalendarDays size={55} />
          </ThemeIcon>
          <div className='flex flex-col'>
            <Tooltip label='Số lịch hẹn khám trong ngày hôm nay'>
              <div className='flex items-center text-gray-700 gap-1'>
                Lịch hẹn <FaRegQuestionCircle />
              </div>
            </Tooltip>
            <Text c='blue.5' fz={40} fw={700}>{appointments?.length || 0}</Text>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-2 rounded-lg">
          <div className='flex justify-between'>
            <Text c='primary.3'>Doanh thu tháng 7 ngày vừa qua</Text>
            <Tooltip label='Xem chi tiết thống kê'>
              <ActionIcon variant='light' radius='xl' onClick={() => navigate(PATHS.CLINIC_REPORT)}>
                <FaArrowRight size={20} />
              </ActionIcon>
            </Tooltip>
          </div>
          <BarChart
            w={'100%'}
            h={400}
            mt={10}
            dataKey="date"
            data={statistics || []}
            tooltipAnimationDuration={200}
            tooltipProps={{
              content: ({ payload }) => {
                if (!payload?.length) return null;
                return (
                  <div className="p-2 bg-white rounded-lg shadow-md">
                    <div className="text-gray-600">
                      Ngày {payload[0]?.payload?.date}
                    </div>
                    <div className="text-primary-300">
                      Doanh thu: <CurrencyFormatter value={payload[0]?.payload?.revenue} />
                    </div>
                  </div>
                )
              }
            }}
            series={[
              { name: 'revenue', color: 'primary.3' },
            ]}
          />
        </div>
        <div className="col-span-1 py-2 px-3 rounded-lg bg-white">
          <div className='flex justify-between items-center'>
            <Text c='primary.3'>Lịch hẹn hôm nay</Text>
            <Tooltip label='Xem tất cả lịch hẹn khám'>
              <ActionIcon variant='light' radius='xl' onClick={() => navigate(PATHS.CLINIC_APPOINTMENT)}>
                <FaArrowRight size={20} />
              </ActionIcon>
            </Tooltip>
          </div>

          <div className={classNames(
            'flex flex-col mt-1 h-full',
            appointments?.length === 0 && 'justify-center'
          )}>
            {appointments?.length === 0 && (
              <div className='flex flex-col items-center'>
                <ThemeIcon color='gray.6' size={100} radius='xl' variant='white'>
                  <IoCalendarClearOutline size={90} />
                </ThemeIcon>
                <p className='text-gray-600 text-center w-[200px] text-14'>Chưa có lịch hẹn nào trong ngày hôm nay</p>
              </div>
            )}
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

export default DashboardClinic;

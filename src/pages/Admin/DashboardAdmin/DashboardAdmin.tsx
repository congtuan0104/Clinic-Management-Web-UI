import { useAppSelector } from '@/hooks';
import { currentClinicSelector, userInfoSelector } from '@/store';
import { Flex, Title, Text, ActionIcon, Tooltip, Badge, ThemeIcon, Paper, Table, ScrollArea, Group } from '@mantine/core';
import { BarChart, LineChart, Sparkline } from '@mantine/charts';
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
import { DateInput } from '@mantine/dates';
import { dateParser } from '@/utils';
import { GoMoveToEnd } from "react-icons/go";
import { LuArrowRightFromLine } from "react-icons/lu";

const DashboardAdmin = () => {

  const [startDate, setStartDate] = useState<Date | null>(dayjs().subtract(7, 'day').toDate());
  const [endDate, setEndDate] = useState<Date | null>(dayjs().toDate());

  const { data } = useQuery(
    ['statistics', dayjs(startDate).format('YYYY-MM-DD'), dayjs(endDate).format('YYYY-MM-DD')],
    () => statisticApi.getAdminStatisticByDate({
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
    })
      .then(res => res.data),
    {}
  );

  const statistics = data?.details.map((item) => ({
    date: dayjs(item.date).format('DD MMM'),
    revenue: item.revenue,
  }));

  return (
    <div className='p-3'>
      <div className='flex justify-between items-center mb-4'>
        <Title order={3}>Thống kê, báo cáo</Title>
        <div className='flex items-center gap-2'>
          <Text>Từ ngày</Text>
          <DateInput
            value={startDate}
            size='md'
            valueFormat='DD/MM/YYYY'
            dateParser={dateParser}
            onChange={setStartDate}
            rightSection={<LuArrowRightFromLine />}
          />
          <Text ml={15}>Đến ngày</Text>
          <DateInput
            value={endDate}
            size='md'
            valueFormat='DD/MM/YYYY'
            dateParser={dateParser}
            maxDate={dayjs().toDate()}
            onChange={setEndDate}
            rightSection={<GoMoveToEnd />}
          />
        </div>
      </div>
      <Group>
      <Text fw={700} pl={2}>Số lượng phòng khám đăng ký vào hệ thống: {data?.summary.totalClinics}</Text>
      </Group>


      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-2 rounded-lg">
          <Text c='primary.3'>Biểu đồ doanh thu</Text>
          <BarChart
            w={'100%'}
            h={470}
            mt={20}
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
            <Text c='primary.3'>Chi tiết doanh thu</Text>
          </div>

          <ScrollArea h={500} mt={20}>
            <Table verticalSpacing="sm" striped withTableBorder stickyHeader stickyHeaderOffset={0}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Ngày</Table.Th>
                  <Table.Th>Doanh thu</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {statistics?.map((item) => (
                  <Table.Tr key={item.date}>
                    <Table.Td>{item.date}</Table.Td>
                    <Table.Td><CurrencyFormatter value={item.revenue} /></Table.Td>
                  </Table.Tr>
                ))}
                <Table.Tr>
                  <Table.Td><b>Tổng doanh thu</b></Table.Td>
                  <Table.Td><CurrencyFormatter value={statistics?.reduce(
                    (acc, item) => acc + item.revenue,
                    0
                  ) || 0} />
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </ScrollArea>

        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;

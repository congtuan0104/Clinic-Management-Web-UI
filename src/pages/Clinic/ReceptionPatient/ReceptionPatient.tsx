import { useMemo, useState } from 'react';
import {
  Flex,
  Button,
  ActionIcon,
  Title,
  Text,
  Image,
  Avatar,
  Badge,
  Tooltip,
} from '@mantine/core';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { authApi, medicalRecordApi } from '@/services';
import { ClinusTable, ModalNewMedicalRecord } from "@/components";
import { useQuery } from 'react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import { IMedicalRecord } from '@/types';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import { PATHS } from '@/config';
import { MdEmail, MdOutlineAttachMoney, MdOutlineMoneyOff } from 'react-icons/md';
import { Gender, MEDICO_RECORD_STATUS } from '@/enums';
import dayjs from 'dayjs';
import { TiDocumentAdd } from 'react-icons/ti';

const ReceptionPatientPage = () => {

  const columns = useMemo<MRT_ColumnDef<IMedicalRecord>[]>(
    () => [
      {
        header: 'Bệnh nhân',
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
      },
      {
        header: 'Bác sĩ',
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
        header: 'Trạng thái',
        id: 'status',
        enableSorting: false,
        accessorFn: (dataRow) => <div className='flex flex-col gap-2'>
          {
            (dataRow.examinationStatus === MEDICO_RECORD_STATUS.WAITING) ?
              <Badge color='gray.5'>Chờ khám</Badge>
              : (dataRow.examinationStatus === MEDICO_RECORD_STATUS.EXAMINATING) ?
                <Badge color='blue'>Đang khám</Badge>
                : (dataRow.examinationStatus === MEDICO_RECORD_STATUS.DONE) ?
                  <Badge color='green'>Đã khám</Badge>
                  : (dataRow.examinationStatus === MEDICO_RECORD_STATUS.PAUSE) ?
                    <Badge color='yellow'>Tạm dừng</Badge>
                    : (dataRow.examinationStatus === MEDICO_RECORD_STATUS.CANCEL) ?
                      <Badge color='red.5'>Hủy khám</Badge> : <></>
          }
          {dataRow.paymentStatus === 0 ? <Badge leftSection={<MdOutlineMoneyOff />} color='gray.5'>Chưa thanh toán</Badge> :
            dataRow.paymentStatus === 1 ? <Badge leftSection={<MdOutlineAttachMoney />} color='green'>Đã thanh toán</Badge> : <></>
          }
        </div>

      },
      {
        header: "Ngày tạo",
        id: 'dateCreated',
        accessorFn: (dataRow) => dayjs(dataRow.dateCreated).format('DD/MM/YYYY'),
      }

    ],
    [],
  );

  const currentClinic = useAppSelector(currentClinicSelector);
  const [isOpenCreateModal, setOpenCreateModal] = useState(false);


  // lấy dữ liệu từ api
  const { data: patients, refetch, isLoading } = useQuery(
    ['medical_records', currentClinic?.id],
    () => medicalRecordApi.getMedicalRecords({ clinicId: currentClinic?.id })
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id,
    }
  );

  return (
    <>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Title order={4}>Hồ sơ khám bệnh</Title>
          <Button
            color='secondary.3'
            onClick={() => setOpenCreateModal(true)}
            leftSection={<TiDocumentAdd size={18} />}
          >
            Tạo hồ sơ mới
          </Button>
        </Flex>

        <ClinusTable
          columns={columns}
          data={patients || []}
          enableRowActions
          enableColumnFilters={false}
          enableRowNumbers={false}
          // state={{
          //   isLoading: isLoading,
          // }}
          mantineSearchTextInputProps={
            {
              placeholder: 'Tìm kiếm bệnh nhân',
              styles: { wrapper: { width: '300px' } },
              radius: 'md',
            }
          }
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
              <Tooltip label='Xem hồ sơ bệnh nhân'>
                <ActionIcon
                  variant='outline'
                  color='blue'
                  radius='sm'
                  component={Link}
                  to={`${PATHS.CLINIC_PATIENT_MANAGEMENT}/${row.id}`}
                // onClick={() => handleOpenUpdateModal(row.original)} // xử lý khi chọn sửa dịch vụ
                >
                  <FaRegEdit />
                </ActionIcon>
              </Tooltip>
              {/* <ActionIcon
                variant='outline'
                color='red'
                radius='sm'
              // onClick={() => handleDeleteService(row.id)} // xử lý khi click button xóa dịch vụ
              >
                <FaTrash />
              </ActionIcon> */}
            </Flex>
          )}
        />
      </Flex>

      <ModalNewMedicalRecord
        isOpen={isOpenCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={() => refetch()}
      />
    </>
  );
};

export default ReceptionPatientPage;

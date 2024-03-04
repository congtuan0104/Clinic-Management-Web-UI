import { useEffect, useMemo, useState } from 'react';
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
import { currentClinicSelector, staffInfoSelector, userInfoSelector } from '@/store';
import { FaEye, FaRegEdit, FaTrash } from 'react-icons/fa';
import { authApi, medicalRecordApi } from '@/services';
import { ClinusTable, ModalNewMedicalRecord } from "@/components";
import { useQuery } from 'react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import { IMedicalRecord } from '@/types';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import { PATHS } from '@/config';
import { MdEmail, MdOutlineStart } from 'react-icons/md';
import { AuthModule, Gender, MEDICO_RECORD_STATUS } from '@/enums';
import dayjs from 'dayjs';
import { SlActionRedo } from "react-icons/sl";

const ExaminationPage = () => {

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
      },
      {
        header: 'Trạng thái khám',
        id: 'examinationStatus',
        sortingFn: (rowA, rowB) => rowA.original.examinationStatus - rowB.original.examinationStatus,
        accessorFn: (dataRow) => {
          if (dataRow.examinationStatus === MEDICO_RECORD_STATUS.WAITING) {
            return <Badge color='gray.5'>Chờ khám</Badge>;
          } else if (dataRow.examinationStatus === MEDICO_RECORD_STATUS.EXAMINATING) {
            return <Badge color='blue'>Đang khám</Badge>;
          } else if (dataRow.examinationStatus === MEDICO_RECORD_STATUS.DONE) {
            return <Badge color='green'>Đã khám</Badge>;
          } else if (dataRow.examinationStatus === MEDICO_RECORD_STATUS.PAUSE) {
            return <Badge color='yellow'>Tạm dừng</Badge>;
          } else if (dataRow.examinationStatus === MEDICO_RECORD_STATUS.CANCEL) {
            return <Badge color='red.5'>Hủy khám</Badge>;
          }
        }
      },

    ],
    [],
  );

  const currentClinic = useAppSelector(currentClinicSelector);
  const userInfo = useAppSelector(userInfoSelector);
  const staffInfo = useAppSelector(staffInfoSelector);
  const [isOpenCreateModal, setOpenCreateModal] = useState(false);


  // lấy dữ liệu từ api
  const { data: patients, refetch, isLoading } = useQuery(
    ['medical_records', currentClinic?.id],
    () => medicalRecordApi.getMedicalRecords({
      clinicId: currentClinic?.id,
      doctorId: userInfo?.moduleId === AuthModule.ClinicStaff && staffInfo ? staffInfo.id : undefined,
    })
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id && (userInfo?.moduleId === AuthModule.ClinicOwner || !!staffInfo?.id),
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (staffInfo) {
      refetch();
    }
  }, [staffInfo]);

  return (
    <>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Title order={4}>Bệnh nhân chờ khám</Title>
        </Flex>

        <ClinusTable
          columns={columns}
          data={patients || []}
          enableRowActions
          enableColumnFilters={false}
          enableRowNumbers={true}
          enableGlobalFilter={true}
          state={{
            // isLoading: isLoading,
            sorting: [{ id: 'examinationStatus', desc: false }],
          }}
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
              <Tooltip label={
                row.original.examinationStatus === MEDICO_RECORD_STATUS.DONE
                  ? 'Xem hồ sơ khám bệnh'
                  : 'Tiến hành khám bệnh'
              }>
                <ActionIcon
                  variant='outline'
                  color='blue.8'
                  radius='lg'
                  component={Link}
                  to={`${PATHS.CLINIC_EXAMINATION}/${row.id}`}
                // onClick={() => handleOpenUpdateModal(row.original)} // xử lý khi chọn sửa dịch vụ
                >
                  {
                    row.original.examinationStatus === MEDICO_RECORD_STATUS.DONE
                      ? <FaEye /> : <SlActionRedo />
                  }

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

export default ExaminationPage;

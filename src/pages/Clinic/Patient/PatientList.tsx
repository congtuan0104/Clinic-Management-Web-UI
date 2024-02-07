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
import { authApi, patientApi } from '@/services';
import { ClinusTable, ModalNewPatient } from "@/components";
import { useQuery } from 'react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import { IPatient } from '@/types';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import { PATHS } from '@/config';
import { MdEmail } from 'react-icons/md';

const PatientListPage = () => {
  // khai báo thông tin hiển thị của bảng (đọc tài liệu tại https://v2.mantine-react-table.com/)
  const columns = useMemo<MRT_ColumnDef<IPatient>[]>(
    () => [
      {
        header: 'Bệnh nhân',
        id: 'fullName',
        accessorFn: (dataRow) =>
          <div className='flex items-center'>
            <Avatar
              src={dataRow.avatar}
              size={40}
              alt={dataRow.lastName}
              radius="xl" >
              {dataRow.lastName?.charAt(0)}
            </Avatar>
            <div className='flex flex-col flex-1 ml-2'>
              <p className='text-primary-300'>{dataRow.firstName} {dataRow.lastName}</p>
              <p className='text-gray-500'>{dataRow.email}</p>
            </div>
          </div>,
      },
      {
        header: 'Số điện thoại',
        accessorKey: 'phone',
      },
      {
        header: 'Địa chỉ',
        accessorKey: 'address',
      },
      {
        header: 'Trạng thái',
        id: 'status',
        accessorFn: (dataRow) => {
          if (dataRow.emailVerified) return <Badge color='green'>Đã xác thực</Badge>;
          return <Badge color='red'>Chưa xác thực</Badge>;
        }
      },

    ],
    [],
  );

  const currentClinic = useAppSelector(currentClinicSelector);
  const [isOpenCreateModal, setOpenCreateModal] = useState(false);


  // lấy dữ liệu từ api
  const { data: patients, refetch, isLoading } = useQuery(
    ['clinic_patients', currentClinic?.id],
    () => patientApi.getPatients({ clinicId: currentClinic?.id }).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  // const handleDeleteService = async (id: string) => {
  //   modals.openConfirmModal({
  //     title: <Text size='md' fw={700}>Xác nhận</Text>,
  //     children: (
  //       <Text size="sm" lh={1.6}>
  //         Bạn có chắc muốn xóa dịch vụ này không?<br />
  //         Thao tác này không thể hoàn tác sau khi xác nhận
  //       </Text>
  //     ),
  //     confirmProps: { color: 'red.5' },
  //     onCancel: () => console.log('Cancel'),
  //     onConfirm: async () => {
  //       const res = await clinicServiceApi.deleteClinicService(id)
  //       if (res.status) {
  //         notifications.show({
  //           title: 'Thành công',
  //           message: 'Dịch vụ đã được xóa',
  //           color: 'teal.5',
  //         })
  //         refetch();
  //       }
  //       else {
  //         notifications.show({
  //           title: 'Thất bại',
  //           message: 'Đã có lỗi xảy ra',
  //           color: 'red.5',
  //         })
  //       }
  //     },
  //   });

  // }

  const handleResendEmail = async (email: string) => {
    const res = await authApi.sendVerifyEmail(email);

    if (res.status) {
      notifications.show({
        title: 'Thành công',
        message: 'Đã gửi lại mail xác thực',
        color: 'teal.5',
      })
    }
    else {
      notifications.show({
        title: 'Thất bại',
        message: 'Đã có lỗi xảy ra',
        color: 'red.5',
      })
    }
  }

  return (
    <>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Title order={4}>Danh sách bệnh nhân</Title>
          <Button color='secondary.3' onClick={() => setOpenCreateModal(true)}>Bệnh nhân mới</Button>
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
              {(!row.original.emailVerified) && (
                <Tooltip label='Gửi lại mail xác thực'>
                  <ActionIcon
                    variant='outline'
                    color='gray.8'
                    radius='sm'
                    onClick={() => handleResendEmail(row.original.email)}
                  >
                    <MdEmail />
                  </ActionIcon>
                </Tooltip>
              )}
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

      <ModalNewPatient
        isOpen={isOpenCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={() => refetch()}
      />
    </>
  );
};

export default PatientListPage;

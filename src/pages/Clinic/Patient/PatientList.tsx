import { useMemo, useState } from 'react';
import {
  Flex,
  Button,
  ActionIcon,
  Title,
  Text,
  Image,
  Avatar,
} from '@mantine/core';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { patientApi } from '@/services';
import { ClinusTable, ModalNewPatient } from "@/components";
import { useQuery } from 'react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import { IPatient } from '@/types';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import { PATHS } from '@/config';

const PatientListPage = () => {
  // khai báo thông tin hiển thị của bảng (đọc tài liệu tại https://v2.mantine-react-table.com/)
  const columns = useMemo<MRT_ColumnDef<IPatient>[]>(
    () => [
      {
        header: 'Ảnh',
        id: 'avatar',
        accessorFn: (row) => <Avatar src={row.avatar} alt={row.lastName} radius="xl" >{row.lastName.charAt(0)}</Avatar>,
      },
      {
        header: 'Tên bệnh nhân',
        accessorFn: (dataRow) => `${dataRow.firstName} ${dataRow.lastName}`,
        enableClickToCopy: true,
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Số điện thoại',
        accessorKey: 'phone',
      },
      {
        header: 'Địa chỉ',
        accessorKey: 'address',
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

  return (
    <>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Title order={4}>Danh sách bệnh nhân</Title>
          <Button color='secondary.3' onClick={() => setOpenCreateModal(true)}>Tạo hồ sơ</Button>
        </Flex>

        <ClinusTable
          columns={columns}
          data={patients || []}
          enableRowActions
          enableColumnFilters={false}
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

import { useMemo, useState } from 'react';
import {
  Flex,
  Button,
  ActionIcon,
  Title,
  Text,
} from '@mantine/core';
import { useAppSelector, useAuth } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { clinicApi, clinicServiceApi } from '@/services';
import { ClinusTable, CurrencyFormatter, ModalNewClinicService, ModalUpdateClinicService } from "@/components";
import { useQuery } from 'react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import { IClinicService } from '@/types';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';

const ServicePricePage = () => {
  // khai báo thông tin hiển thị của bảng (đọc tài liệu tại https://v2.mantine-react-table.com/)
  const columns = useMemo<MRT_ColumnDef<IClinicService>[]>(
    () => [
      {
        header: 'Dịch vụ',
        accessorKey: 'serviceName',
        enableClickToCopy: true,
      },
      {
        accessorKey: 'price',
        header: 'Giá dịch vụ',
        // <CurrencyFormatter value={row.price} />,
        Cell: ({ cell }) => (
          <CurrencyFormatter value={cell.getValue<number>()} />
        ),
      },
      {
        header: 'Mô tả',
        accessorKey: 'description',
      },
      {
        header: 'Loại dịch vụ',
        accessorKey: 'categoryName',
      },
      {
        header: 'Trạng thái',
        accessorKey: 'isDisabled',
        Cell: ({ cell }) => (
          <div>{cell.getValue<boolean>() ? 'Không hoạt động' : 'Đang hoạt động'}</div>
        ),
      }

    ],
    [],
  );

  const currentClinic = useAppSelector(currentClinicSelector);
  const [isOpenCreateModal, setOpenCreateModal] = useState(false);
  const [selectedService, setSelectedService] = useState<IClinicService | undefined>(undefined);


  // lấy dữ liệu từ api
  const { data: services, refetch, isLoading } = useQuery(
    ['clinic_service', currentClinic?.id],
    () => clinicServiceApi.getClinicServices(currentClinic!.id).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const handleOpenUpdateModal = (service: IClinicService) => {
    setSelectedService(service);
  }

  const handleDeleteService = async (id: string) => {
    modals.openConfirmModal({
      title: <Text size='md' fw={700}>Xác nhận</Text>,
      children: (
        <Text size="sm" lh={1.6}>
          Bạn có chắc muốn xóa dịch vụ này không?<br />
          Thao tác này không thể hoàn tác sau khi xác nhận
        </Text>
      ),
      confirmProps: { color: 'red.5' },
      onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        const res = await clinicServiceApi.deleteClinicService(id)
        if (res.status) {
          notifications.show({
            title: 'Thành công',
            message: 'Dịch vụ đã được xóa',
            color: 'teal.5',
          })
          refetch();
        }
        else {
          notifications.show({
            title: 'Thất bại',
            message: 'Đã có lỗi xảy ra',
            color: 'red.5',
          })
        }
      },
    });

  }

  return (
    <>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Title order={4}>Bảng giá dịch vụ</Title>
          <Button color='primary.3' onClick={() => setOpenCreateModal(true)}>Thêm dịch vụ</Button>
        </Flex>

        <ClinusTable  // component custom từ mantine-react-table
          columns={columns}   // thông tin hiển thị của bảng (định nghĩa ở trên)
          data={services ?? []}      // dữ liệu được đổ vào bảng
          enableRowActions  // cho phép hiển thị các button xóa, sửa trên mỗi dòng
          enableColumnFilters={false}
          // state={{
          //   isLoading: isLoading,
          // }}
          mantineSearchTextInputProps={
            {
              placeholder: 'Tìm kiếm dịch vụ',
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
                onClick={() => handleOpenUpdateModal(row.original)} // xử lý khi chọn sửa dịch vụ
              >
                <FaRegEdit />
              </ActionIcon>
              <ActionIcon
                variant='outline'
                color='red'
                radius='sm'
                onClick={() => handleDeleteService(row.id)} // xử lý khi click button xóa dịch vụ
              >
                <FaTrash />
              </ActionIcon>
            </Flex>
          )}
        />
      </Flex>

      <ModalNewClinicService
        isOpen={isOpenCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={() => refetch()}
      />

      {selectedService && (<ModalUpdateClinicService
        isOpen={!!selectedService}
        onClose={() => setSelectedService(undefined)}
        service={selectedService}
        onSuccess={() => refetch()}
      />)}
    </>
  );
};

export default ServicePricePage;

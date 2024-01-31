import { useMemo, useState } from 'react';
import {
  Flex,
  Button,
  ActionIcon,
  Title,
} from '@mantine/core';
import { useAppSelector, useAuth } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { clinicApi, clinicServiceApi } from '@/services';
import { ClinusTable, CurrencyFormatter, ModalNewClinicService } from "@/components";
import { useQuery } from 'react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import { IClinicService } from '@/types';

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

    ],
    [],
  );

  const currentClinic = useAppSelector(currentClinicSelector);
  const [isOpenCreateModal, setOpenCreateModal] = useState(false);


  // lấy dữ liệu từ api
  const { data: services, refetch, isLoading } = useQuery(
    ['clinic_service', currentClinic?.id],
    () => clinicServiceApi.getClinicServices(currentClinic!.id).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );


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
                onClick={() => { console.log('ServiceID: ', row.id) }} // xử lý khi chọn sửa dịch vụ
              >
                <FaRegEdit />
              </ActionIcon>
              <ActionIcon
                variant='outline'
                color='red'
                radius='sm'
                onClick={() => { }} // xử lý khi click button xóa dịch vụ
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
    </>
  );
};

export default ServicePricePage;

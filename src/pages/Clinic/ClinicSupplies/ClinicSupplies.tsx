import { useMemo, useState } from 'react';
import {
  Flex,
  Button,
  ActionIcon,
  Title,
  Text,
  NumberFormatter,
} from '@mantine/core';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { ClinusTable, CurrencyFormatter, ModalNewSupplies, ModalUpdateSupplies } from "@/components";
import { useQuery } from 'react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import { IMedicalSupplies } from '@/types';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { suppliesApi } from '@/services';
import { TiPlus } from 'react-icons/ti';

const ClinicSuppliesPage = () => {
  // khai báo thông tin hiển thị của bảng (đọc tài liệu tại https://v2.mantine-react-table.com/)
  const columns = useMemo<MRT_ColumnDef<IMedicalSupplies>[]>(
    () => [
      {
        header: 'Tên vật tư',
        accessorKey: 'medicineName',
        enableClickToCopy: true,
      },
      {
        header: 'Số lượng tồn',
        id: 'stock',
        accessorFn: (dataRow) => <><NumberFormatter value={dataRow.stock} thousandSeparator /> {dataRow.unit}</>,
      },
      {
        header: 'Loại vật tư',
        accessorKey: 'categoryName',
      },
      {
        header: 'Nhà sản xuất',
        accessorKey: 'vendor',
      },
      {
        header: 'Hạn sử dụng',
        id: 'expiry',
        accessorFn: (dataRow) => dataRow.expiry ? dataRow.expiry : 'Không có',
      },

    ],
    [],
  );

  const currentClinic = useAppSelector(currentClinicSelector);
  const [isOpenCreateModal, setOpenCreateModal] = useState(false);
  const [selectedSupplies, setSelectedSupplies] = useState<IMedicalSupplies | undefined>(undefined);


  // lấy dữ liệu từ api
  const { data: supplies, refetch, isLoading } = useQuery(
    ['clinic_supplies', currentClinic?.id],
    () => suppliesApi.getSupplies({ clinicId: currentClinic!.id }).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const handleOpenUpdateModal = (supplies: IMedicalSupplies) => {
    setSelectedSupplies(supplies);
  }

  const handleDeleteSupplies = async (supplies: IMedicalSupplies) => {
    console.log('Delete supplies', supplies);
    modals.openConfirmModal({
      title: <Text size='md' fw={700}>Xác nhận</Text>,
      children: (
        <Text size="sm" lh={1.6}>
          Bạn có chắc muốn xóa <b>{supplies.medicineName}</b>?<br />
          Thao tác này không thể hoàn tác sau khi xác nhận
        </Text>
      ),
      confirmProps: { color: 'red.5' },
      onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        const res = await suppliesApi.deleteSupplies(supplies.id)
        if (res.status) {
          notifications.show({
            title: 'Thành công',
            message: `${supplies.medicineName} đã được xóa khỏi danh sách vật tư`,
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
          <Title order={4}>Thiết bị, vật tư</Title>
          <Button
            color='secondary.3'
            leftSection={<TiPlus size={18} />}
            // FaSuitcaseMedical 
            onClick={() => setOpenCreateModal(true)}>
            Thêm mới
          </Button>
        </Flex>

        <ClinusTable  // component custom từ mantine-react-table
          columns={columns}   // thông tin hiển thị của bảng (định nghĩa ở trên)
          data={supplies ?? []}      // dữ liệu được đổ vào bảng
          enableRowActions  // cho phép hiển thị các button xóa, sửa trên mỗi dòng
          enableColumnFilters={false}
          // state={{
          //   isLoading: isLoading,
          // }}
          mantineSearchTextInputProps={
            {
              placeholder: 'Tìm kiếm thiết bị, vật tư',
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
                onClick={() => handleDeleteSupplies(row.original)} // xử lý khi click button xóa dịch vụ
              >
                <FaTrash />
              </ActionIcon>
            </Flex>
          )}
        />
      </Flex>

      <ModalNewSupplies
        isOpen={isOpenCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={() => refetch()}
      />

      {selectedSupplies && (<ModalUpdateSupplies
        isOpen={!!selectedSupplies}
        onClose={() => setSelectedSupplies(undefined)}
        supplies={selectedSupplies}
        onSuccess={() => refetch()}
      />)}
    </>
  );
};

export default ClinicSuppliesPage;

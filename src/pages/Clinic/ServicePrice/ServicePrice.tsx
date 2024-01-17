import { useMemo } from 'react';
import {
  Flex,
  Button,
  ActionIcon,
  Title,
} from '@mantine/core';
import { useAppSelector, useAuth } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { clinicApi } from '@/services';
import { ClinusTable } from "@/components";
import { useQuery, useQueryClient } from 'react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import { IClinicMember } from '@/types';

const ServicePricePage = () => {
  // khai báo thông tin hiển thị của bảng (đọc tài liệu tại https://v2.mantine-react-table.com/)
  const columns = useMemo<MRT_ColumnDef<IClinicMember>[]>(
    () => [
      {
        header: 'Email',    // tên cột
        accessorKey: 'email',  // key của dữ liệu (field tương ứng trả về từ api)
        enableClickToCopy: true,  // cho phép click để copy dữ liệu
        enableSorting: false, // không cho phép sắp xếp dữ liệu
      },
      {
        header: 'Họ tên nhân viên',
        id: 'fullName',
        accessorFn: (dataRow) => `${dataRow.firstName} ${dataRow.lastName}`,  // dữ của cột được xử lý trước khi hiển thị thay cho accessorKey
      },
      {
        header: 'Vai trò',
        accessorKey: 'role.name',
        filterFn: 'equals',
        mantineFilterSelectProps: {
          data: [
            { value: 'admin', label: 'Quản trị viên' },
            { value: 'Bác sĩ', label: 'Bác sĩ' },
            { value: 'Y tá', label: 'Y tá' },
          ],
        },
        mantineTableHeadCellProps: {
          align: 'right',
        },
        mantineTableBodyCellProps: {
          align: 'right',
        },
      },
    ],
    [],
  );
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  const currentClinic = useAppSelector(currentClinicSelector);


  // lấy dữ liệu từ api
  const { data: services, isLoading } = useQuery(
    ['clinic_service', currentClinic?.id],
    () => clinicApi.getAllClinicService(currentClinic!.id).then(res => res.data),
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
          <Button color='primary.3'>Thêm dịch vụ</Button>
        </Flex>

        {/* <ClinusTable  // component custom từ mantine-react-table
          columns={columns}   // thông tin hiển thị của bảng (định nghĩa ở trên)
          data={services}      // dữ liệu được đổ vào bảng
          enableRowActions  // cho phép hiển thị các button xóa, sửa trên mỗi dòng
          mantineSearchTextInputProps={
            {
              placeholder: 'Tìm kiếm dịch vụ',
              styles: { wrapper: { width: '300px' } },
              radius: 'md',
            }
          }
          getRowId={(row) => row.id}
          state={{
            isLoading: isLoading
          }}
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
        /> */}
      </Flex>
    </>
  );
};

export default ServicePricePage;

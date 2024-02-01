import React, { useEffect, useMemo, useState } from 'react';
import {
  Text,
  Flex,
  Paper,
  Button,
  Input,
  Badge,
  Box,
  ActionIcon,
  Title,
} from '@mantine/core';
import { useAppSelector, useAuth } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { IoSearch } from 'react-icons/io5';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { staffApi } from '@/services';
import { useDisclosure, useHover } from '@mantine/hooks';
import { ClinusTable, ModalAddStaff } from "@/components";
import { useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { MRT_ColumnDef } from 'mantine-react-table';
import { IClinicStaff } from '@/types';
import { PATHS } from '@/config';
import { Gender } from '@/enums';


const StaffManagementPage = () => {
  const columns = useMemo<MRT_ColumnDef<IClinicStaff>[]>(
    () => [
      {
        header: 'Email',
        accessorKey: 'users.email',
        enableClickToCopy: true,
        enableSorting: false,
      },
      {
        header: 'Họ và tên',
        id: 'fullName',
        accessorFn: (dataRow) => `${dataRow.users.firstName} ${dataRow.users.lastName}`,
      },
      {
        header: 'Giới tính',
        id: 'gender',
        accessorFn: (dataRow) =>
          dataRow.users.gender === Gender.Male ? 'Nam' :
            dataRow.users.gender === Gender.Female ? 'Nữ' :
              '',
      },
      {
        header: 'Số điện thoại',
        accessorKey: 'users.phone',
      },
      // {
      //   header: 'Đã xác thực',
      //   accessorKey: 'users.emailVerified',
      // },
      {
        header: 'Vai trò',
        accessorKey: 'role.name',
        enableSorting: false,
        enableColumnFilter: false,
        // filterFn: 'equals',
        // mantineFilterSelectProps: {
        //   data: [
        //     { value: 'Admin', label: 'Quản trị viên' },
        //     { value: 'Bác sĩ', label: 'Bác sĩ' },
        //     { value: 'Y tá', label: 'Y tá' },
        //   ],
        // },
        // filterVariant: 'select',
        // mantineTableHeadCellProps: {
        //   align: 'right',
        // },
        // mantineTableBodyCellProps: {
        //   align: 'right',
        // },
      },
    ],
    [],
  );
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();
  const currentClinic = useAppSelector(currentClinicSelector);
  const [opened, { open, close }] = useDisclosure(false);

  // const navigate = useNavigate();

  const { data: staffs, refetch } = useQuery(
    ['staffs'],
    () => staffApi.getStaffs({ clinicId: currentClinic?.id }).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  console.log(staffs);


  return (
    <>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Title order={4}>Danh sách nhân viên</Title>
          <Button color='secondary.3' onClick={open}>Thêm nhân viên</Button>
        </Flex>

        <ClinusTable
          columns={columns}
          data={staffs || []}
          // enableRowSelection
          mantineSearchTextInputProps={
            {
              placeholder: 'Tìm kiếm nhân viên',
              styles: { wrapper: { width: '300px' } },
              radius: 'md',
            }
          }
          getRowId={(row) => row.id.toString()}
          // state={{
          //   isLoading: isLoading,
          // }}
          enableRowActions
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
                to={`/clinic/nhan-vien/${row.id}`}
              >
                <FaRegEdit />
              </ActionIcon>
              <ActionIcon
                variant='outline'
                color='red'
                radius='sm'
                onClick={() => { }}
              >
                <FaTrash />
              </ActionIcon>
            </Flex>
          )}
          localization={{
            noRecordsToDisplay: 'Không có nhân viên nào trong phòng khám',
          }}

        />


      </Flex>

      <ModalAddStaff
        isOpen={opened}
        onClose={close}
        onSuccess={() => {
          refetch();
        }}
      />
    </>
  );
};

export default StaffManagementPage;

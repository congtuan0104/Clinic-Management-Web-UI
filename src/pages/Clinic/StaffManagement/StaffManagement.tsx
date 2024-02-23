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
  Avatar,
  Tooltip,
} from '@mantine/core';
import { useAppSelector, useAuth } from '@/hooks';
import { currentClinicSelector, userInfoSelector } from '@/store';
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
import { MdEmail } from 'react-icons/md';
import { FaUserPlus } from 'react-icons/fa6';


const StaffManagementPage = () => {
  const columns = useMemo<MRT_ColumnDef<IClinicStaff>[]>(
    () => [
      {
        header: 'Nhân viên',
        id: 'fullName',
        accessorFn: (dataRow) =>
          <div className='flex items-center'>
            <Avatar
              src={dataRow.users.avatar}
              size={40}
              alt={dataRow.users.lastName}
              radius="xl" >
              {dataRow.users?.lastName?.charAt(0)}
            </Avatar>
            <div className='flex flex-col flex-1 ml-2'>
              <p className='text-primary-300'>{dataRow.users.firstName} {dataRow.users.lastName}</p>
              <p className='text-gray-500'>{dataRow.users.email}</p>
            </div>
          </div>,
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
        enableClickToCopy: true,
      },
      {
        header: 'Vai trò',
        accessorKey: 'role.name',
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        header: 'Trạng thái',
        id: 'status',
        accessorFn: (dataRow) => {
          if (dataRow.users.emailVerified) return <Badge color='green'>Đã xác thực</Badge>;
          return <Badge color='red'>Chưa xác thực</Badge>;
        }
      },
    ],
    [],
  );
  const currentClinic = useAppSelector(currentClinicSelector);
  const userInfo = useAppSelector(userInfoSelector);
  const [opened, { open, close }] = useDisclosure(false);

  // const navigate = useNavigate();

  const { data, refetch } = useQuery(
    ['staffs', currentClinic?.id],
    () => staffApi.getStaffs({ clinicId: currentClinic?.id }).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
    }
  );

  const staffs = data?.filter(staff => staff.users.id !== userInfo?.id)

  return (
    <>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Title order={4}>Danh sách nhân viên</Title>
          <Button
            color='secondary.3'
            leftSection={<FaUserPlus />}
            onClick={open}>
            Nhân viên mới
          </Button>
        </Flex>

        <ClinusTable
          columns={columns}
          data={staffs || []}
          enableRowNumbers={false}
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
              {(!row.original.isAcceptInvite || !row.original.users.emailVerified) && (
                <Tooltip label='Gửi lại mail xác thực'>
                  <ActionIcon
                    variant='outline'
                    color='gray.8'
                    radius='sm'
                    onClick={() => { }}
                  >
                    <MdEmail />
                  </ActionIcon>
                </Tooltip>
              )}
              <Tooltip label='Xem thông tin nhân viên'>
                <ActionIcon
                  variant='outline'
                  color='blue'
                  radius='sm'
                  component={Link}
                  to={`${PATHS.CLINIC_STAFF_MANAGEMENT}/${row.id}`}
                >
                  <FaRegEdit />
                </ActionIcon>
              </Tooltip>
              <Tooltip label='Xóa nhân viên'>
                <ActionIcon
                  variant='outline'
                  color='red'
                  radius='sm'
                  onClick={() => { }}
                >
                  <FaTrash />
                </ActionIcon>
              </Tooltip>
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

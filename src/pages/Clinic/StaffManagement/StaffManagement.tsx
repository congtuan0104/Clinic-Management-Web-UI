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
import { clinicApi } from '@/services';
import { useDisclosure, useHover } from '@mantine/hooks';
import { ClinusTable, ModalInviteClinicMember } from "@/components";
import { useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { MRT_ColumnDef } from 'mantine-react-table';
import { IClinicMember } from '@/types';


const StaffManagementPage = () => {
  const columns = useMemo<MRT_ColumnDef<IClinicMember>[]>(
    () => [
      {
        header: 'Email',
        accessorKey: 'email',
        enableClickToCopy: true,
        enableSorting: false,
      },
      {
        header: 'Họ tên nhân viên',
        id: 'fullName',
        accessorFn: (dataRow) => `${dataRow.firstName} ${dataRow.lastName}`,
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
        filterVariant: 'select',
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
  const [opened, { open, close }] = useDisclosure(false);

  const currentClinic = useAppSelector(currentClinicSelector);
  // const navigate = useNavigate();


  const { data: members, isLoading } = useQuery(
    ['clinics_user', currentClinic?.id],
    () => clinicApi.getClinicMembers(currentClinic!.id)
      .then(res => res.data?.filter((member) => member.id !== userInfo?.id)),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Title order={4}>Danh sách nhân viên</Title>
          <Button color='secondary.3' onClick={open}>Thêm nhân viên</Button>
        </Flex>

        <ClinusTable
          columns={columns}
          data={members || []}
          // enableRowSelection
          mantineSearchTextInputProps={
            {
              placeholder: 'Tìm kiếm nhân viên',
              styles: { wrapper: { width: '300px' } },
              radius: 'md',
            }
          }
          getRowId={(row) => row.id}
          state={{
            isLoading: isLoading
          }}
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

        // enableStickyHeader
        // mantineTableProps={{
        //   striped: true,
        // }}
        />


      </Flex>

      <ModalInviteClinicMember
        isOpen={opened}
        onClose={close}
        onSuccess={() => {
          queryClient.invalidateQueries('clinics_user');
        }}
      />
    </>
  );
};

export default StaffManagementPage;

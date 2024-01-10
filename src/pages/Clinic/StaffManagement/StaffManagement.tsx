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
} from '@mantine/core';
import { useAppSelector, useAuth } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { IoSearch } from 'react-icons/io5';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { clinicApi } from '@/services';
import { useDisclosure, useHover } from '@mantine/hooks';
import { ModalInviteClinicMember, ModalRoleManagement } from "@/components";
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/config';
import { MRT_ColumnDef, MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { IClinicMember } from '@/types';
import { DataTable } from 'mantine-datatable';


const StaffManagementPage = () => {
  const currentClinic = useAppSelector(currentClinicSelector);
  const { userInfo } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery(
    ['clinics_user', currentClinic?.id],
    () => clinicApi.getClinicMembers(currentClinic!.id)
      .then(res => res.data?.filter((member) => member.id !== userInfo?.id)),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <div>Loading...</div>;

  if (!members) return <div>Không có dữ liệu</div>;

  if (members.length === 0)
    return <div className='rounded-md flex flex-col justify-center items-center bg-white h-[600px] m-3'>
      <Text>Phòng khám chưa có nhân viên</Text>
      <Button onClick={open} mt={15}>Thêm nhân viên</Button>
      <ModalInviteClinicMember
        isOpen={opened}
        onClose={close}
        onSuccess={() => {
          queryClient.invalidateQueries('clinics_user');
        }}
      />
    </div>;

  const columns = useMemo<MRT_ColumnDef<IClinicMember>[]>(
    () => [
      {
        header: 'Email',
        accessorKey: 'email', //simple recommended way to define a column
        //more column options can be added here to enable/disable features, customize look and feel, etc.
      },
      {
        header: 'Họ tên nhân viên',
        accessorFn: (dataRow) => dataRow.firstName + dataRow.lastName, //alternate way to access data if processing logic is needed
      },
    ],
    [],
  );

  //pass table options to useMantineReactTable
  const table = useMantineReactTable({
    columns,
    data: members, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowSelection: true, //enable some features
    enableColumnOrdering: true,
    enableGlobalFilter: false, //turn off a feature
  });

  return (
    <>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Input
            leftSection={<IoSearch size={16} />}
            placeholder="Tìm kiếm nhân viên"
            className='flex-1'
            maw={300}
          />
          <Button onClick={open}>Thêm nhân viên</Button>
        </Flex>

        <MantineReactTable table={table} />

        {/* <DataTable
      columns={[{ accessor: 'email' }, { accessor: 'firstName' }]}
      records={members}
    /> */}



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

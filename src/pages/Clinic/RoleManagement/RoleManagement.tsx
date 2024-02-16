import React, { useEffect, useMemo, useState } from 'react';
import {
  Text,
  Flex,
  Paper,
  Button,
  Input,
  Badge,
  Stack,
  Title,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { IoSearch } from 'react-icons/io5';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { clinicApi } from '@/services';
import { IUserGroupRole } from '@/types';
import { useDisclosure, useHover } from '@mantine/hooks';
import { ClinusTable, ModalRoleManagement } from "@/components";
import { modals } from '@mantine/modals';
import { TiPlus } from 'react-icons/ti';
import { MRT_ColumnDef } from 'mantine-react-table';

const RoleManagement = () => {
  const currentClinic = useAppSelector(currentClinicSelector);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [opened, { open, close }] = useDisclosure(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [roles, setRoles] = useState<IUserGroupRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<IUserGroupRole | undefined>(undefined);

  const columns = useMemo<MRT_ColumnDef<IUserGroupRole>[]>(
    () => [
      {
        header: 'Vai trò',
        id: 'name',
        enableColumnFilter: false,
        accessorFn: (dataRow) => <div className='flex flex-col'>
          <Text size="md" fw={500}>{dataRow.name}</Text>
          <Text size="sm" c="gray.6">{dataRow.description}</Text>
        </div>,
      },
      {
        header: 'Quyền',
        id: 'description',
        enableSorting: false,
        enableColumnFilter: false,
        accessorFn: (dataRow) =>
          dataRow.rolePermissions.map
            ((permission, index) => <Badge
              key={permission.id}
              color={index % 2 === 0 ? 'primary.3' : 'gray.6'}
              size='lg'
              tt='capitalize'
              className='m-1'
            >
              {permission.optionName}
            </Badge>),
      },
    ],
    [],
  );


  const fetchData = async () => {
    try {
      if (!currentClinic) return;
      const response = await clinicApi.getClinicRoles(currentClinic.id);
      if (response.data) {
        setRoles(response.data);
      } else {
        console.error("Lỗi không thể nhận được dữ liệu");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentClinic?.id]);

  const updateRole = async () => {
    await fetchData();
  };


  const openDeleteModal = (userGroupRoleId: number, name: string) => {
    modals.openConfirmModal({
      title: `Xóa Role ${name}`,
      centered: true,
      children: (
        <Text size="md">
          Bạn có chắc chắn muốn xóa vai trò {name} không?
        </Text>
      ),
      labels: { confirm: 'Xác nhận xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red.5' },
      onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        try {
          await clinicApi.deleteUserGroupRole(currentClinic?.id, userGroupRoleId);
          await fetchData();
        } catch (error) {
          console.error('Error deleting role:', error);
        }
      },
    });
  };

  return (
    <>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Title order={4}>Danh sách vai trò</Title>
          <Button
            color='secondary.3'
            leftSection={<TiPlus size={18} />}
            onClick={() => {
              open();
              setIsEditMode(false);
            }}>
            Thêm vai trò
          </Button>
        </Flex>

        <ClinusTable
          columns={columns}
          data={roles || []}
          enableColumnFilters={false}
          mantineSearchTextInputProps={
            {
              placeholder: 'Tìm kiếm vai trò',
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
              <Tooltip label={row.original.name === 'Admin' ? 'Role Admin không thể chỉnh sửa' : 'Chỉnh sửa'}>
                <ActionIcon
                  variant='outline'
                  color='blue'
                  radius='sm'
                  disabled={row.original.name === 'Admin'}
                  onClick={() => {
                    open();
                    setSelectedRole(row.original);
                    setIsEditMode(true);
                  }}
                >
                  <FaRegEdit />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={row.original.name === 'Admin' ? 'Role Admin không thể xóa' : 'Xóa'}>
                <ActionIcon
                  variant='outline'
                  color='red'
                  radius='sm'
                  disabled={row.original.name === 'Admin'}
                  onClick={() => openDeleteModal(row.original.id, row.original.name)}
                >
                  <FaTrash />
                </ActionIcon>
              </Tooltip>
            </Flex>
          )}
          localization={{
            noRecordsToDisplay: 'Không có vai trò nào trong phòng khám',
          }}
        />

      </Flex>
      <ModalRoleManagement
        isEditMode={isEditMode}
        isOpen={opened}
        onClose={close}
        updateRole={updateRole}
        selectedRole={selectedRole}
      />
    </>
  );
};

export default RoleManagement;

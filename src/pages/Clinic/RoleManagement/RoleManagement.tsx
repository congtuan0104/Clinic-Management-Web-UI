import React, { useEffect, useState } from 'react';
import {
  Text,
  Flex,
  Paper,
  Button,
  Input,
  Badge,
} from '@mantine/core';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { IoSearch } from 'react-icons/io5';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { clinicApi } from '@/services';
import { IUserGroupRole } from '@/types';
import { useDisclosure, useHover } from '@mantine/hooks';
import { ModalRoleManagement } from "@/components";
import { modals } from '@mantine/modals';

const RoleManagement = () => {
  const currentClinic = useAppSelector(currentClinicSelector);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [opened, { open, close }] = useDisclosure(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [roles, setRoles] = useState<IUserGroupRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<IUserGroupRole | undefined>(undefined);


  const fetchData = async () => {
    try {
      if (!currentClinic) return;
      const response = await clinicApi.getListUserGroupRole(currentClinic.id);
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
        <Text size="sm">
          Bạn có muốn xóa {name} không
        </Text>
      ),
      labels: { confirm: 'Xác nhận xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
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
    <Paper shadow="sm" style={{ background: 'rgba(255, 255, 255, 0)' }}>
      <Flex direction="column" gap="md" p="md">
        <Flex align="center" justify="space-between">
          <Input
            leftSection={<IoSearch size={16} />}
            placeholder="Tìm kiếm vai trò"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className='flex-1'
            maw={300}
          />
          <Button onClick={() => {
            open();
            setIsEditMode(false);
          }}>+ Thêm vai trò</Button>
        </Flex>

        <table style={{ borderCollapse: 'collapse', width: '100%', backgroundColor: 'white' }}>
          <thead style={{ background: '#ccc', color: '#222' }}>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', width: '20%' }}>Vai trò</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quyền</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', width: '10%' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{role.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {role.rolePermissions.map(permission =>
                    <Badge
                      key={`${role.id}-${permission.id}`}
                      color="gray.5"
                      size='lg'
                      className='m-1'
                    >
                      {permission.optionName}
                    </Badge>
                  )}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  <FaRegEdit
                    size={20}
                    onClick={() => {
                      open();
                      setIsEditMode(true);
                      setSelectedRole(role);
                    }}
                    style={{ cursor: 'pointer', marginRight: '6px', color: 'blue' }}
                    onMouseOver={(e: React.MouseEvent<SVGElement, MouseEvent>) => (e.currentTarget.style.color = 'darkblue')}
                    onMouseOut={(e: React.MouseEvent<SVGElement, MouseEvent>) => (e.currentTarget.style.color = 'blue')}
                  />
                  <FaTrash
                    size={20}
                    style={{ cursor: 'pointer', marginLeft: '6px', color: 'red' }}
                    onMouseOver={(e: React.MouseEvent<SVGElement, MouseEvent>) => (e.currentTarget.style.color = 'darkred')}
                    onMouseOut={(e: React.MouseEvent<SVGElement, MouseEvent>) => (e.currentTarget.style.color = 'red')}
                    onClick={() => openDeleteModal(role.id, role.name)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Flex>
      <ModalRoleManagement
        isEditMode={isEditMode}
        isOpen={opened}
        onClose={close}
        updateRole={updateRole}
        selectedRole={selectedRole}
      />
    </Paper>
  );
};

export default RoleManagement;

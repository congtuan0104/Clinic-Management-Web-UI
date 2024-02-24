import React, { useEffect, useState } from 'react';
import {
  Flex,
  TextInput,
  CheckboxGroup,
  Checkbox,
  Button,
  Text,
  Modal,
} from '@mantine/core';
import { IAddUserGroupRoleRequest, IPlanOption, IRolePermission, IUserGroupRole } from '@/types';
import { clinicApi, planApi } from '@/services';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';

interface IProps {
  isEditMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  updateRole: () => void;
  selectedRole?: IUserGroupRole;
}

const ModalRoleManagement = ({ isEditMode, isOpen, onClose, updateRole, selectedRole }: IProps) => {
  const currentClinic = useAppSelector(currentClinicSelector);
  const [newRole, setNewRole] = useState<string>('');
  const [permissions, setPermissions] = useState<IPlanOption[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<IPlanOption[]>([]);
  const [roleDescription, setRoleDescription] = useState<string>('');


  const getPermissionData = async () => {
    try {
      if (currentClinic && currentClinic.subscriptions) {
        const response = await planApi.getPlanById(currentClinic.subscriptions[0].planId);

        if (response.data) {
          setPermissions(response.data.planOptions);
        } else {
          console.error("Lỗi không thể nhận được dữ liệu");
        }
      } else {
        console.error("Lỗi: currentClinic hoặc currentClinic.subscriptions không được xác định hoặc rỗng");
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getPermissionData();
  }, [currentClinic]);

  useEffect(() => {
    if (selectedRole) {
      setNewRole(selectedRole.name || '');
      setRoleDescription(selectedRole.description || '');
      const selectedRolePermissions = permissions.filter((permission) =>
        selectedRole.rolePermissions?.some((rolePermission) => rolePermission.id === permission.id)
      );
      setSelectedPermissions(selectedRolePermissions);
    }
  }, [selectedRole, permissions]);

  const resetModal = () => {
    setNewRole('');
    setSelectedPermissions([]);
    setRoleDescription('');
  };

  const handleSubmit = async () => {
    try {
      if (!currentClinic) return;
      const requestData: IAddUserGroupRoleRequest = {
        name: newRole,
        description: roleDescription,
        permissions: selectedPermissions.map(permission => permission.id),
      };

      if (isEditMode) {
        const response = await clinicApi.updateUserGroupRole(requestData, currentClinic?.id, selectedRole?.id);
      } else {
        const response = await clinicApi.createClinicRole(requestData, currentClinic.id);
      }

      updateRole();
      resetModal();
      onClose();
    } catch (error) {
      console.error('Error handling data:', error);
    }
  };
  return (
    <Modal
      title={<Text fw={700} size='lg'>{isEditMode ? 'Sửa vai trò' : 'Thêm vai trò'}</Text>}
      opened={isOpen}
      onClose={() => {
        resetModal();
        onClose();
      }}
      size='lg'
      radius='lg'
    >
      <Flex direction="column" gap="md">
        <TextInput
          label={<span style={{ fontWeight: 'bold' }}>Tên vai trò</span>}
          value={newRole}
          withAsterisk
          size='md'
          onChange={(event) => setNewRole(event.target.value)}
        />
        <TextInput
          label={<span style={{ fontWeight: 'bold' }}>Mô tả</span>}
          withAsterisk
          size='md'
          value={roleDescription}
          onChange={(event) => setRoleDescription(event.target.value)}
        />

        <CheckboxGroup
          size='md'
          label={<span style={{ fontWeight: 'bold' }}>Các quyền</span>}
          value={selectedPermissions.map((permission) => permission.optionName)}
          onChange={(value) => {
            const selectedRolePermissions = permissions.filter((permission) =>
              value.includes(permission.optionName)
            );
            setSelectedPermissions(selectedRolePermissions);
          }}
        >
          <div className='grid grid-cols-2 gap-y-1 gap-x-3'>
            {permissions.map((permission) => (
              <Checkbox mt={10} key={permission.id} value={permission.optionName} label={permission.optionName} />
            ))}
          </div>
        </CheckboxGroup>

        {/* <div style={{ flex: '0 0 48%', display: 'flex', flexDirection: 'column' }}>
            <CheckboxGroup
              mt={10}
              label="     "
              value={selectedPermissions.map((permission) => permission.optionName)}
              onChange={(value) => {
                const selectedRolePermissions = permissions.filter((permission) =>
                  value.includes(permission.optionName)
                );
                setSelectedPermissions(selectedRolePermissions);
              }}
            >
              {permissions.slice(Math.ceil(permissions.length / 2)).map((permission, index) => (
                <Checkbox key={index} value={permission.optionName} label={permission.optionName} />
              ))}
            </CheckboxGroup>
          </div> */}


        <Button onClick={handleSubmit} size='md'>
          {isEditMode ? 'Lưu' : 'Thêm'}
        </Button>
      </Flex>
    </Modal>
  );
};

export default ModalRoleManagement;

import React, { useEffect, useState } from 'react';
import {
    Flex,
    TextInput,
    CheckboxGroup,
    Checkbox,
    Button,
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
            const requestData: IAddUserGroupRoleRequest = {
                name: newRole,
                description: roleDescription,
                permissions: selectedPermissions.map(permission => permission.id),
            };

            if (isEditMode) {
                const response = await clinicApi.updateUserGroupRole(requestData, currentClinic?.id, selectedRole?.id);
                console.log('API Response (Update):', response);
            } else {
                const response = await clinicApi.addUserGroupRole(requestData, currentClinic?.id);
                console.log('API Response (Add):', response);
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
            title={isEditMode ? 'Chỉnh sửa' : 'Thêm vai trò mới'}
            opened={isOpen}
            onClose={() => {
                resetModal();
                onClose();
            }}
        >
            <Flex direction="column" gap="md">
                <TextInput
                    label={<span style={{ fontWeight: 'bold' }}>Tên vai trò</span>}
                    value={newRole}
                    withAsterisk
                    onChange={(event) => setNewRole(event.target.value)}
                />
                <TextInput
                    label={<span style={{ fontWeight: 'bold' }}>Mô tả</span>}
                    withAsterisk
                    value={roleDescription}
                    onChange={(event) => setRoleDescription(event.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: '0 0 48%', display: 'flex', flexDirection: 'column' }}>
                        <CheckboxGroup
                            label={<span style={{ fontWeight: 'bold' }}>Các quyền</span>}
                            value={selectedPermissions.map((permission) => permission.optionName)}
                            onChange={(value) => {
                                const selectedRolePermissions = permissions.filter((permission) =>
                                    value.includes(permission.optionName)
                                );
                                setSelectedPermissions(selectedRolePermissions);
                            }}
                        >
                            {permissions.slice(0, Math.ceil(permissions.length / 2)).map((permission, index) => (
                                <Checkbox key={index} value={permission.optionName} label={permission.optionName} />
                            ))}
                        </CheckboxGroup>
                    </div>

                    <div style={{ flex: '0 0 48%', display: 'flex', flexDirection: 'column' }}>
                        <CheckboxGroup
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
                    </div>
                </div>

                <Button onClick={handleSubmit}>
                    {isEditMode ? 'Chỉnh sửa' : 'Thêm'}
                </Button>
            </Flex>
        </Modal>
    );
};

export default ModalRoleManagement;

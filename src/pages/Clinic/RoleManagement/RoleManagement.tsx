import React, { useEffect, useState } from 'react';
import {
    Text,
    Flex,
    Paper,
    Button,
    Input,
} from '@mantine/core';
import { useAppSelector } from '@/hooks';
import { currentClinicSelector } from '@/store';
import { IoSearch } from 'react-icons/io5';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { clinicApi } from '@/services';
import { IUserGroupRole } from '@/types';
import { useDisclosure, useHover } from '@mantine/hooks';
import { ModalRoleManagement } from "@/components";

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

    const deleteRole = async (userGroupRoleId: number) => {
        try {
            await clinicApi.deleteUserGroupRole(currentClinic?.id, userGroupRoleId);
            await fetchData();
        } catch (error) {
            console.error("Error deleting role:", error);
        }
    };

    // Permission translation mapping with flexible keys
    const permissionTranslations: Record<string, string> = {
        MANAGE_CLINIC: 'Quản lý phòng khám',
        MANAGE_USER: 'Quản lý người dùng',
        MANAGE_ROLE: 'Quản lý vai trò',
        MANAGE_PLAN: 'Quản lý kế hoạch',
        MANAGE_SERVICE: 'Quản lý dịch vụ',
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
                    />
                    <Button onClick={() => {
                        open();
                        setIsEditMode(false);
                    }}>+ Thêm vai trò</Button>
                </Flex>

                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead style={{ background: '#ccc', color: '#222' }}>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px', width: '20%' }}>Vai trò</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quyền</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', width: '10%' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles
                            .slice() // create a shallow copy to avoid mutating the original array
                            .sort((a, b) => a.id - b.id) // sort roles by ID
                            .map((role, index) => {
                                const sortedPermissions = [...role.rolePermissions].sort((a, b) => a.id - b.id);

                                // Alternate row background colors
                                const rowBackgroundColor = index % 2 === 0 ? '#f9f9f9' : '#e6e6e6';

                                return (
                                    <tr key={index} style={{ background: rowBackgroundColor }}>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{role.name}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            {sortedPermissions.map((permission, permissionIndex) => (
                                                <span
                                                    key={permissionIndex}
                                                    style={{
                                                        //color: permissionIndex % 2 === 0 ? 'purple' : 'orange',
                                                    }}
                                                >
                                                    {permissionTranslations[permission.optionName] || permission.optionName}
                                                    {permissionIndex < sortedPermissions.length - 1 && ', '}
                                                </span>
                                            ))}
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
                                                onClick={() => deleteRole(role.id)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
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

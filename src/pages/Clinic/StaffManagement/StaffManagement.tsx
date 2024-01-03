import React, { useEffect, useState } from 'react';
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

        <table style={{ borderCollapse: 'collapse', width: '100%', backgroundColor: 'white' }}>
          <thead style={{ background: '#ccc', color: '#222' }}>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', width: '30%' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tên nhân viên</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', width: '30%' }}>Vai trò</th>
              {/* <th style={{ border: '1px solid #ddd', padding: '8px', width: '10%' }}>Trạng thái</th> */}
              {/* <th style={{ border: '1px solid #ddd', padding: '8px', width: '10%' }}>Địa chỉ</th> */}
              {/* <th style={{ border: '1px solid #ddd', padding: '8px', width: '10%' }}>Số điện thoại</th> */}
              <th style={{ border: '1px solid #ddd', padding: '8px', width: '10%' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {members?.map((member) => (
              <tr key={member.id}>
                <th style={{ border: '1px solid #ddd', padding: '8px', width: '30%', fontWeight: 400 }}>{member.email}</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 400 }}>{member.firstName} {member.lastName}</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', width: '30%', fontWeight: 400 }}>{member.role.name}</th>
                {/* <th style={{ border: '1px solid #ddd', padding: '8px', width: '10%' }}>Trạng thái</th> */}
                {/* <th style={{ border: '1px solid #ddd', padding: '8px', width: '10%' }}>Địa chỉ</th> */}
                {/* <th style={{ border: '1px solid #ddd', padding: '8px', width: '10%' }}>Số điện thoại</th> */}
                <th style={{ border: '1px solid #ddd', padding: '8px', width: '10%', fontWeight: 400 }}>
                  <ActionIcon mx={5} variant='subtle' aria-label="Update member" onClick={() => navigate(`${PATHS.CLINIC_STAFF_MANAGEMENT}/${member.id}`)}>
                    <FaRegEdit
                      size={20}
                    />
                  </ActionIcon>

                  <ActionIcon mx={5} variant='subtle' color='red.5' aria-label="Delete member">
                    <FaTrash
                      size={20}
                    />
                  </ActionIcon>


                </th>
              </tr>
            ))}
          </tbody>
        </table>

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

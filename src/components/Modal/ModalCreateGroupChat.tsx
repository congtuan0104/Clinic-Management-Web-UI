import { chatApi, clinicApi, planApi, staffApi } from "@/services";
import { Button, Flex, Grid, Modal, ModalBody, ModalCloseButton, ModalHeader } from "@mantine/core";
import { Form, useForm } from "react-hook-form";
import { MultiSelect, NativeSelect, Select, TextInput } from "react-hook-form-mantine";
import { useQuery } from "react-query";
import * as yup from 'yup';
import { CurrencyFormatter } from "..";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useAppSelector, useAuth } from "@/hooks";
import { currentClinicSelector } from "@/store";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormAddGroupChatData {
  groupName: string;
  memberIds: string[];
}

const ModalCreateGroupChat = ({ isOpen, onClose, onSuccess }: IProps) => {
  const { userInfo } = useAuth();
  const currentClinic = useAppSelector(currentClinicSelector);

  const { data: staffs, isLoading } = useQuery(
    ['staffs'],
    () => staffApi.getStaffs({ clinicId: currentClinic?.id }).then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { control, handleSubmit, setValue, reset } = useForm<FormAddGroupChatData>({
    defaultValues: {
      groupName: '',
      memberIds: [],
    },
  });


  const onSubmitAddGroupChat = async (data: FormAddGroupChatData) => {
    try {
      const res = await chatApi.addGroupChat({
        groupName: data.groupName,
        userList: data.memberIds,
      });

      if (res.status) {
        onClose();
        onSuccess();
        notifications.show({
          title: 'Thành công',
          message: 'Tạo nhóm chat thành công',
          color: 'green',
        });
      }
      else {
        notifications.show({
          title: 'Lỗi',
          message: 'Không thể tạo nhóm chat',
          color: 'red',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal.Root opened={isOpen} onClose={onClose} centered size={'md'}>
      <Modal.Overlay />
      <Modal.Content radius='lg'>
        <ModalHeader>
          <Modal.Title fz={18} fw={700}>Tạo nhóm chat mới</Modal.Title>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <TextInput
            label="Tên nhóm chat"
            name="groupName"
            required
            size="md"
            radius="sm"
            control={control}
          />

          <MultiSelect
            label="Thêm thành viên vào nhóm chat"
            data={staffs ? staffs.map((staff) => ({
              value: staff.id.toString(),
              label: staff.users.firstName + ' ' + staff.users.lastName,
            })) : []}
            searchable
            mt={10}
            name="memberIds"
            size="md"
            radius="sm"
            hidePickedOptions
            onChange={(values: string[]) => setValue('memberIds', values)}
            control={control}
            disabled={isLoading}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', }}>
            <Button mt="lg" radius="sm" size="md" type="submit" onClick={handleSubmit(onSubmitAddGroupChat)}>
              Xác nhận
            </Button>
            <Button mt="lg" ml="sm" radius="sm" size="md" variant='outline' color='red.5'
              onClick={() => {
                onClose();
                reset();
              }}>
              Hủy
            </Button>

          </div>

        </ModalBody>
      </Modal.Content>
    </Modal.Root>
  )

}


export default ModalCreateGroupChat;
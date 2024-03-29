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
    ['staffs', currentClinic?.id],
    () => staffApi.getStaffs({ clinicId: currentClinic?.id })
      .then(res => res.data?.filter(staff => !staff.isDisabled)),
    {
      enabled: !!currentClinic?.id,
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
    }
  };

  return (
    <Modal.Root opened={isOpen} onClose={onClose} centered size={'md'}>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3'>
          <Modal.Title c='white' fz="lg" fw={600}>Nhóm chat mới</Modal.Title>
          <ModalCloseButton />
        </Modal.Header>
        <ModalBody>
          <TextInput
            label="Tên nhóm chat"
            name="groupName"
            required
            size="md"
            mt='md'
            control={control}
          />

          <MultiSelect
            label="Thêm thành viên vào nhóm chat"
            data={staffs ? staffs.map((staff) => ({
              value: staff.users.id.toString(),
              label: staff.users.firstName + ' ' + staff.users.lastName,
            })) : []}
            searchable
            mt={10}
            name="memberIds"
            size="md"
            hidePickedOptions
            onChange={(values: string[]) => setValue('memberIds', values)}
            control={control}
            disabled={isLoading}
          />

          <div className="flex justify-end gap-2">
            <Button mt="lg" ml="sm" size="md" color='gray.5'
              onClick={() => {
                onClose();
                reset();
              }}>
              Hủy
            </Button>
            <Button mt="lg" size="md" type="submit" onClick={handleSubmit(onSubmitAddGroupChat)}>
              Xác nhận
            </Button>

          </div>

        </ModalBody>
      </Modal.Content>
    </Modal.Root>
  )

}


export default ModalCreateGroupChat;
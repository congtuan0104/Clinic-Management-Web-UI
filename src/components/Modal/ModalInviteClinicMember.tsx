import { useAppSelector } from "@/hooks";
import { authApi, clinicApi } from "@/services";
import { currentClinicSelector } from "@/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Grid, Modal, ModalBody, ModalCloseButton, ModalHeader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Form, useForm } from "react-hook-form";
import { Select, TextInput } from "react-hook-form-mantine";
import { SiMaildotru } from "react-icons/si";
import { useQuery } from "react-query";
import * as yup from "yup";


interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
}

const validateSchema = yup.object().shape({
  firstName: yup.string().required('Bạn chưa nhập họ'),
  lastName: yup.string().required('Bạn chưa nhập tên nhân viên'),
  email: yup.string().required('Thông tin email là bắt buộc').email('Email không hợp lệ'),
  roleId: yup.string().required('Bạn phải chọn một vai trò cho nhân viên'),
});

const ModalInviteClinicMember = ({
  isOpen,
  onClose,
  onSuccess
}: IModalProps) => {

  const currentClinic = useAppSelector(currentClinicSelector);

  const { data: roles, isLoading: isLoadingRoles } = useQuery(
    ['roles', currentClinic?.id],
    () => clinicApi.getListUserGroupRole(currentClinic!.id).then(res => res.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { control, reset } = useForm<IFormData>({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      roleId: '',
    },
  });

  const handleSubmitForm = async (data: IFormData) => {
    console.log(data);
    if (!currentClinic) return;
    const response = await authApi.inviteClinicMember({
      ...data,
      roleId: parseInt(data.roleId),
      clinicId: currentClinic?.id
    });

    if (response.status) {
      notifications.show({
        message: 'Đã gửi lời mời thành công',
        color: 'green',
      });
      onSuccess();
      reset();
      onClose();
    }
  }

  const handleCancel = () => {
    reset();
    onClose();
  }


  return (
    <Modal.Root opened={isOpen} onClose={handleCancel} centered size={'md'}>
      <Modal.Overlay />
      <Modal.Content>
        <ModalHeader>
          <Modal.Title fz={16} fw={600}>Thêm nhân viên mới</Modal.Title>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Form
            control={control}
            onSubmit={e => handleSubmitForm(e.data)}
            onError={e => console.log(e)}>
            <Grid>
              <Grid.Col span={4}>
                <TextInput
                  label="Họ"
                  name="firstName"
                  placeholder="Nguyễn"
                  required
                  size="md"
                  radius="sm"
                  control={control}
                />
              </Grid.Col>
              <Grid.Col span={8}>
                <TextInput
                  label="Tên"
                  name="lastName"
                  placeholder="Văn A"
                  required
                  size="md"
                  radius="sm"
                  control={control}
                />
              </Grid.Col>
            </Grid>
            <TextInput
              label="Email"
              name="email"
              placeholder="example@gmail.com"
              required
              mt="md"
              size="md"
              radius="sm"
              control={control}
              leftSection={<SiMaildotru size={16} />}
            />

            <Select
              name="roleId"
              control={control}
              label="Chọn vai trò cho nhân viên"
              placeholder={isLoadingRoles ? 'Đang lấy danh sách role có thể gán' : ''}
              withAsterisk
              mt="md"
              size="md"
              radius="sm"
              required
              disabled={isLoadingRoles}
              comboboxProps={{ shadow: 'md', transitionProps: { transition: 'pop', duration: 200 } }}
              checkIconPosition="right"
              data={roles?.map((role) => ({
                value: role.id.toString(),
                label: role.name,
              }))
              }
            />

            <Flex justify='end' gap={10}>
              <Button mt="lg" radius="sm" size="md" type="submit">
                Xác nhận
              </Button>
              <Button mt="lg" radius="sm" size="md" variant='outline' color='red.5' onClick={handleCancel}>
                Hủy
              </Button>
            </Flex>
          </Form>
        </ModalBody>
      </Modal.Content>
    </Modal.Root>
  )
}

export default ModalInviteClinicMember
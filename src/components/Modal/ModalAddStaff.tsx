import { Gender } from "@/enums";
import { useAppSelector } from "@/hooks";
import { authApi, clinicApi, staffApi } from "@/services";
import { currentClinicSelector } from "@/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Grid, Modal, ModalBody, ModalCloseButton, ModalHeader } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
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
  phone?: string;
  address?: string;
  gender?: Gender;
  birthday?: Date;
  specialize?: string;
  experience?: string;
}

const validateSchema = yup.object().shape({
  firstName: yup.string().required('Bạn chưa nhập họ'),
  lastName: yup.string().required('Bạn chưa nhập tên nhân viên'),
  email: yup.string().required('Thông tin email là bắt buộc').email('Email không hợp lệ'),
  roleId: yup.string().required('Bạn phải chọn một vai trò cho nhân viên'),
});

const ModalAddStaff = ({
  isOpen,
  onClose,
  onSuccess
}: IModalProps) => {

  const currentClinic = useAppSelector(currentClinicSelector);

  const { data: roles, isLoading: isLoadingRoles } = useQuery(
    ['roles', currentClinic?.id],
    () => clinicApi.getClinicRoles(currentClinic!.id).then(res => res.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { control, reset, watch, setError, setValue, formState: { errors } } = useForm<IFormData>({
    mode: 'onChange',
    resolver: yupResolver(validateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      roleId: '',
    },
  });

  console.log(errors);


  const [debouncedEmail] = useDebouncedValue(watch('email'), 500);

  /**
   * Kiểm tra nhân viên đã tồn tại chưa
   */
  const checkStaffExists = async (clinicId: string, email: string) => {
    const res = await staffApi.getStaffs({ clinicId, email })
    if (res.data && res.data.length > 0 && res.data[0].users.email === email) {
      const staff = res.data[0];
      setError('email', { message: 'Nhân viên đã tồn tại trong phòng khám' })
      // setValue('firstName', staff.users.firstName);
      // setValue('lastName', staff.users.lastName);
    }
    else {
      setError('email', { message: '' })
    }
  }

  useEffect(() => {
    if (!debouncedEmail || !currentClinic) return;
    checkStaffExists(currentClinic.id, debouncedEmail);
  }, [debouncedEmail])

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

  const isDisabled = !!errors.email?.message || watch('email') === '';


  return (
    <Modal.Root opened={isOpen} onClose={handleCancel} centered size={'md'}>
      <Modal.Overlay />
      <Modal.Content radius='lg'>
        <ModalHeader>
          <Modal.Title fz={16} fw={600}>Thêm nhân viên mới</Modal.Title>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Form
            control={control}
            onSubmit={e => handleSubmitForm(e.data)}
            onError={e => console.log(e)}>
            <TextInput
              label="Email"
              name="email"
              placeholder="Email tài khoản đăng nhập"
              required
              size="md"
              radius="sm"
              control={control}
              leftSection={<SiMaildotru size={16} />}
            />
            <Grid mt="md">
              <Grid.Col span={4}>
                <TextInput
                  label="Họ"
                  name="firstName"
                  required
                  autoComplete="off"
                  size="md"
                  radius="sm"
                  disabled={isDisabled}
                  control={control}
                />
              </Grid.Col>
              <Grid.Col span={8}>
                <TextInput
                  label="Tên"
                  name="lastName"
                  required
                  size="md"
                  autoComplete="off"
                  radius="sm"
                  disabled={isDisabled}
                  control={control}
                />
              </Grid.Col>
            </Grid>


            <Select
              name="roleId"
              control={control}
              label="Vai trò"
              placeholder={isLoadingRoles ? 'Đang lấy danh sách role có thể gán' : ''}
              withAsterisk
              mt="md"
              size="md"
              searchable
              radius="sm"
              required
              disabled={isLoadingRoles || isDisabled}
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

export default ModalAddStaff
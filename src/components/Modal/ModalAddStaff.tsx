import { AuthModule, Gender } from "@/enums";
import { useAppSelector } from "@/hooks";
import { authApi, clinicApi, clinicServiceApi, staffApi } from "@/services";
import { currentClinicSelector } from "@/store";
import { ICreateStaffPayload } from "@/types";
import { phoneRegExp } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Grid, Modal, ModalBody, ModalCloseButton, ModalHeader, TagsInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { DateInput, MultiSelect, Select, TextInput, Textarea } from "react-hook-form-mantine";
import { SiMaildotru } from "react-icons/si";
import { useQuery } from "react-query";
import * as yup from "yup";


interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
interface IFormData {
  userInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    gender?: string;
    birthday?: Date;
  };
  userId?: string;
  roleId: string;
  specialize?: string[];
  experience?: number;
  description?: string;
  services?: string[];
}

const validateSchema = yup.object().shape({
  userInfo: yup.object().shape({
    email: yup.string().required('Vui lòng nhập email').email('Email không hợp lệ'),
    firstName: yup.string().required('Vui lòng nhập họ'),
    lastName: yup.string().required('Vui lòng nhập tên'),
    phone: yup.string()
      .length(10, 'Số điện thoại phải có 10 số')
      .matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
    address: yup.string(),
    gender: yup.string(),
    birthday: yup.date().max(dayjs().toDate(), 'Ngày sinh không hợp lệ')
  }),
  userId: yup.string(),
  roleId: yup.string().required('Vui lòng chọn vai trò'),
  specialize: yup.array().of(yup.string().required('Vui lòng nhập chuyên môn')),
  experience: yup.number().min(0, 'Số năm kinh nghiệm không hợp lệ').typeError('Số năm kinh nghiệm không hợp lệ'),
  description: yup.string(),
  services: yup.array().of(yup.string().required('Vui lòng chọn dịch vụ')),
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
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { data: services, isLoading: isLoadingService } = useQuery(
    ['clinic_service', currentClinic?.id],
    () => clinicServiceApi.getClinicServices(currentClinic!.id, false)
      .then(res => res.data),
    {
      enabled: !!currentClinic?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { control, reset, watch, setError, setValue, formState: { errors } } = useForm<IFormData>({
    mode: 'onChange',
    resolver: yupResolver<IFormData>(validateSchema),
    defaultValues: {
      userInfo: {
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        birthday: undefined,
        gender: Gender.Male.toString(),
      },
      // userId: '',
      roleId: '',
      specialize: undefined,
      description: '',
      services: undefined,
    }
  });

  const email = watch('userInfo.email');
  const specialize = watch('specialize');

  const [debounceEmail] = useDebouncedValue(email, 500);
  const [isDisabled, setIsDisabled] = useState(false);


  /**
   * Kiểm tra nhân viên đã tồn tại chưa
   */
  const handleCheckEmail = async () => {
    if (!debounceEmail || debounceEmail == '') {
      setIsDisabled(false);
      reset();
      return;
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(debounceEmail)) {
      reset({
        userInfo: {
          email: debounceEmail,
          firstName: '',
          lastName: '',
          phone: '',
          address: '',
          birthday: undefined,
        }
      });
      return;
    }

    const res = await authApi.findUserByEmail(debounceEmail);
    if (res.status && res.data) {
      const userInfo = res.data;
      setIsDisabled(true);

      if (userInfo.moduleId !== AuthModule.ClinicStaff) {
        setError('userInfo.email', { message: 'Email đã tồn tại' });
        return;
      }

      const resStaff = await staffApi.getStaffs({
        clinicId: currentClinic?.id,
        email: email
      });

      if (resStaff.status && resStaff.data && resStaff.data.length > 0) {
        setError('userInfo.email', { message: 'Nhân viên đã tồn tại' });
        return;
      }

      setValue('userId', userInfo.id);
      setValue('userInfo.firstName', userInfo.firstName);
      setValue('userInfo.lastName', userInfo.lastName);
      userInfo.phone && setValue('userInfo.phone', userInfo.phone);
      userInfo.address && setValue('userInfo.address', userInfo.address);
      userInfo.birthday && setValue('userInfo.birthday', dayjs(userInfo.birthday).toDate());
      userInfo.gender && setValue('userInfo.gender', userInfo.gender.toString())
    }
    else {
      setIsDisabled(false);
    }

  }

  useEffect(() => {
    handleCheckEmail();
  }, [debounceEmail]);

  const handleSubmitForm = async (data: IFormData) => {
    if (!currentClinic?.id) return;

    const payload: ICreateStaffPayload = {
      clinicId: currentClinic.id,
      userId: data.userId,
      userInfo: {
        email: data.userInfo.email,
        firstName: data.userInfo.firstName,
        lastName: data.userInfo.lastName,
        phone: data.userInfo.phone,
        address: data.userInfo.address,
        gender: Number(data.userInfo.gender)
      },
      roleId: Number(data.roleId),
      specialize: data.specialize?.join(', ') || '',
      experience: data.experience,
      description: data.description,
      services: data.services?.map(Number) || [],
    }

    if (payload.userId && payload.userId !== '') {
      delete payload.userInfo;
    }

    console.log(payload);

    const res = await staffApi.createStaff(payload);

    if (res.status) {
      onSuccess();
      handleClose();
      notifications.show({
        title: 'Thành công',
        message: 'Thông tin nhân viên đã được lưu thành công, một email xác thực sẽ được gửi đến tài khoản nhân viên của bạn',
        color: 'teal.5',
      });
    }
  }

  const handleClose = () => {
    reset();
    setIsDisabled(false);
    onClose();
  }

  return (
    <Modal.Root opened={isOpen} onClose={handleClose} centered size='lg'>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header bg='secondary.3'>
          <Modal.Title c='white' fz="lg" fw={600}>
            Thông tin nhân viên
          </Modal.Title>
          <ModalCloseButton />
        </Modal.Header>
        <ModalBody>
          <Form
            control={control}
            onSubmit={e => handleSubmitForm(e.data)}
            onError={e => console.log(e)}>

            <Grid mt="sm" w='100%'>
              <Grid.Col span={12}>
                <TextInput
                  label="Email"
                  // miw={350}
                  name="userInfo.email"
                  required
                  size="md"
                  mt='sm'
                  radius="md"
                  control={control}
                />

                {isDisabled &&
                  <div className="mt-2 text-teal-700 text-14">
                    Tài khoản nhân viên đã tồn tại, thông tin nhân viên sẽ được cập nhật từ tài khoản này
                  </div>}
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Họ"
                      name="userInfo.firstName"
                      required
                      autoComplete="off"
                      mt='sm'
                      size="md"
                      radius="md"
                      control={control}
                      disabled={isDisabled}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Tên"
                      name="userInfo.lastName"
                      required
                      mt='sm'
                      size="md"
                      autoComplete="off"
                      radius="md"
                      control={control}
                      disabled={isDisabled}
                    />
                  </Grid.Col>
                </Grid>

                <Grid>
                  <Grid.Col span={6}>
                    <Select
                      name="userInfo.gender"
                      control={control}
                      label="Giới tính"
                      placeholder="Chọn giới tính"
                      required
                      mt="sm"
                      size="md"
                      radius="md"
                      disabled={isDisabled}
                      data={[
                        { label: 'Nam', value: Gender.Male.toString() },
                        { label: 'Nữ', value: Gender.Female.toString() },
                      ]}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <DateInput
                      label="Ngày sinh"
                      name="userInfo.birthday"
                      required
                      mt="sm"
                      size="md"
                      disabled={isDisabled}
                      valueFormat="DD/MM/YYYY"
                      maxDate={dayjs().toDate()}
                      radius="md"
                      control={control}
                    />
                  </Grid.Col>
                </Grid>

                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Số điện thoại"
                      name="userInfo.phone"
                      mt="sm"
                      size="md"
                      disabled={isDisabled}
                      radius="md"
                      control={control}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Địa chỉ"
                      name="userInfo.address"
                      mt="sm"
                      disabled={isDisabled}
                      size="md"
                      radius="md"
                      control={control}
                    />
                  </Grid.Col>
                </Grid>

              </Grid.Col>
              <Grid.Col span={12}>
                <Select
                  name="roleId"
                  control={control}
                  label="Vai trò"
                  placeholder={isLoadingRoles ? 'Đang lấy danh sách role có thể gán' : ''}
                  withAsterisk
                  mt="sm"
                  size="md"
                  searchable
                  radius="md"
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

                <TagsInput
                  label="Chuyên môn"
                  name="specialize"
                  mt="sm"
                  size="md"
                  radius="md"
                  clearable
                  value={specialize}
                  onChange={(value) => setValue('specialize', value)}
                />

                <TextInput
                  label="Số năm kinh nghiệm"
                  name="experience"
                  mt="sm"
                  size="md"
                  type="number"
                  radius="md"
                  control={control}
                />

                <MultiSelect
                  label="Dịch vụ"
                  name="services"
                  mt="sm"
                  size="md"
                  placeholder="Những dịch vụ mà nhân viên có thể thực hiện"
                  radius="md"
                  searchable
                  clearable
                  comboboxProps={{ shadow: 'md', transitionProps: { transition: 'pop', duration: 200 } }}
                  checkIconPosition="right"
                  data={services?.map((service) => ({
                    value: service.id.toString(),
                    label: service.serviceName,
                  })) || []}
                  control={control}
                />


                <Textarea
                  label="Mô tả"
                  name="description"
                  mt="sm"
                  size="md"
                  radius="md"
                  rows={3}
                  control={control}
                />

              </Grid.Col>
            </Grid>


            <Flex justify='end' gap={10}>
              <Button mt="lg" radius="md" size="md" type="submit" color="primary.3">
                Lưu thông tin
              </Button>
              <Button mt="lg" radius="md" size="md" variant='outline' color='red.5' onClick={handleClose}>
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
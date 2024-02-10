import { AuthModule, Gender } from "@/enums";
import { useAppSelector } from "@/hooks";
import { authApi, patientApi } from "@/services";
import { currentClinicSelector } from "@/store";
import { ICreatePatientPayload } from "@/types";
import { phoneRegExp } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Grid, Modal, ModalBody, ModalCloseButton, ModalHeader, ScrollArea } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import classNames from "classnames";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { DateInput, Select, TextInput, Textarea } from "react-hook-form-mantine";
import { SiMaildotru } from "react-icons/si";
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
  bloodGroup?: string;
  anamnesis?: string;
  idCard?: string;
  healthInsuranceCode?: string;
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
  bloodGroup: yup.string(),
  anamnesis: yup.string(),
  idCard: yup.string(),
  healthInsuranceCode: yup.string(),
});


const ModalNewPatient = ({
  isOpen,
  onClose,
  onSuccess
}: IModalProps) => {

  const currentClinic = useAppSelector(currentClinicSelector);

  const { control, reset, watch, setError, setValue, formState: { errors, isValid } } = useForm<IFormData>({
    resolver: yupResolver(validateSchema),
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
      bloodGroup: '',
      anamnesis: '',
      idCard: '',
      healthInsuranceCode: '',
    }
  });

  const email = watch('userInfo.email');
  const [debounceEmail] = useDebouncedValue(email, 500);
  const [isDisabled, setIsDisabled] = useState(false);

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

      if (userInfo.moduleId !== AuthModule.Patient) {
        setError('userInfo.email', { message: 'Email đã tồn tại' });
        return;
      }

      // const patient = await patientApi.getPatients();
      // if(patient){
      //   setError('userInfo.email', { message: 'Hồ sơ bệnh nhân đã tồn tại' });
      //   return;
      // }

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

  const handleSubmitForm = async (data: IFormData) => {
    if (!currentClinic?.id) return;

    const payload: ICreatePatientPayload = {
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
      bloodGroup: data.bloodGroup,
      anamnesis: data.anamnesis,
      idCard: data.idCard,
      healthInsuranceCode: data.healthInsuranceCode,
    }

    if (payload.userId && payload.userId !== '') {
      delete payload.userInfo;
    }

    console.log(payload);

    const res = await patientApi.createPatient(payload);

    if (res.status) {
      onSuccess();
      handleClose();
      notifications.show({
        title: 'Thành công',
        message: 'Hồ sơ bệnh nhân đã được lưu thành công',
      });
    }
  }

  const handleClose = () => {
    onClose();
    setIsDisabled(false);
    reset();
  }

  useEffect(() => {
    handleCheckEmail();
  }, [debounceEmail]);

  console.log('errors', errors.userInfo);
  return <Modal.Root opened={isOpen} onClose={handleClose} centered size={'auto'} scrollAreaComponent={ScrollArea.Autosize}>
    <Modal.Overlay blur={7} />
    <Modal.Content radius='lg'>
      <Modal.Header bg='secondary.3'>
        <Modal.Title c='white' fz="lg" fw={600}>
          Bệnh nhân mới
        </Modal.Title>
        <ModalCloseButton />
      </Modal.Header>
      <ModalBody>
        <Form
          control={control}
          onSubmit={e => handleSubmitForm(e.data)}
          onError={e => console.log(e)}>
          <TextInput
            label="Email"
            miw={350}
            name="userInfo.email"
            required
            size="md"
            mt='md'
            radius="md"
            control={control}
          />

          {isDisabled &&
            <div className="mt-2 text-teal-700 text-14">
              Tài khoản bệnh nhân đã tồn tại, thông tin bệnh nhân sẽ được cập nhật từ tài khoản này
            </div>}

          <Grid mt="sm">
            <Grid.Col span={4.5}>
              <TextInput
                label="Họ"
                name="userInfo.firstName"
                required
                autoComplete="off"
                size="md"
                radius="md"
                control={control}
                disabled={isDisabled}
              />
            </Grid.Col>
            <Grid.Col span={7.5}>
              <TextInput
                label="Tên"
                name="userInfo.lastName"
                required
                size="md"
                autoComplete="off"
                radius="md"
                control={control}
                disabled={isDisabled}
              />
            </Grid.Col>
          </Grid>


          <Grid>
            <Grid.Col span={4.5}>
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
            <Grid.Col span={4.5}>
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
            <Grid.Col span={3}>
              <Select
                label="Nhóm máu"
                name="bloodGroup"
                mt="sm"
                data={[{ label: 'Không rõ', value: '' }, "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                size="md"
                radius="md"
                control={control}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={4.5}>
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
            <Grid.Col span={7.5}>
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


          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="CMND/CCCD"
                name="idCard"
                mt="sm"
                size="md"
                radius="md"
                control={control}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Mã thẻ BHYT"
                name="healthInsuranceCode"
                mt="sm"
                size="md"
                radius="md"
                control={control}
              />
            </Grid.Col>

          </Grid>


          <Textarea
            label="Tiền sử bệnh (nếu có)"
            name="anamnesis"
            mt="sm"
            rows={3}
            size="md"
            radius="md"
            control={control}
          />


          <Flex justify='end' gap={10}>
            <Button mt="lg" radius="md" size="md" color='gray.5' onClick={handleClose}>
              Hủy
            </Button>
            <Button mt="lg" radius="md" size="md" type="submit" color="primary.3">
              Lưu hồ sơ
            </Button>
          </Flex>
        </Form>
      </ModalBody>
    </Modal.Content>
  </Modal.Root >
}

export default ModalNewPatient;
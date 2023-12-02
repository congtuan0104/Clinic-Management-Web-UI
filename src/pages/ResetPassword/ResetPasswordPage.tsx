import { Anchor, Paper, Title, Text, Container, Group, Button } from '@mantine/core';
import { TextInput, PasswordInput, Checkbox } from 'react-hook-form-mantine';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Form } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiMaildotru } from 'react-icons/si';
import { Link } from 'react-router-dom';

import * as yup from 'yup';

import { PATHS, FirebaseAuthProvider, firebaseAuth } from '@/config';


interface IResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

// định nghĩa điều kiện xác định input hợp lệ
const ResetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required('Bạn chưa nhập mật khẩu')
    .min(8, 'Mật khẩu phải có tối thiểu 8 ký tự'),
    confirmPassword: yup
    .string()
    .required('Bạn chưa nhập mật khẩu')
    .oneOf([yup.ref('password'), ''], 'Không trùng với mật khẩu đã nhập'),
});


const ResetPasswordPage = () => {

  // tích hợp react-hook-form với antd form
  const { control: loginControl } = useForm<IResetPasswordFormData>({
    resolver: yupResolver(ResetPasswordSchema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      // giá trị mặc định của các field
      newPassword: '',
      confirmPassword: '',
    },
  });



  return (
    <Container size={570} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title fz="lg">Thiết lập lại mật khẩu</Title>
        <Form control={loginControl}>
          <PasswordInput
            name="newPassword"
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới của bạn"
            required
            mt="md"
            size="md"
            radius="sm"
            control={loginControl}
            leftSection={<RiLockPasswordLine size={18} />}
          />
          <PasswordInput
            name="confirmPassword"
            label="Xác nhận lại mật khẩu của bạn"
            placeholder="Nhập lại mật khẩu vừa nhập"
            required
            mt="md"
            size="md"
            radius="sm"
            control={loginControl}
            leftSection={<RiLockPasswordLine size={18} />}
          />
          <Button fullWidth mt="xl" radius="sm" size="md" type="submit">
            Xác nhận
          </Button>
        </Form>
      </Paper >
    </Container>
  );
};

export default ResetPasswordPage;

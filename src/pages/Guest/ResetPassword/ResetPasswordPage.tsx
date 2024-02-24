// import { useQuery } from 'react-query';
import { PATHS } from '@/config';
import { Button, Container, Paper, Title } from '@mantine/core';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import ClinusLogo from '@/assets/images/logo-2.png';
import { BiArrowBack, BiMailSend } from 'react-icons/bi';
import { IoMdHome } from 'react-icons/io';
import { jwtDecode } from 'jwt-decode';
import * as yup from 'yup';
import { authApi } from '@/services';
import { PasswordInput, TextInput } from 'react-hook-form-mantine';
import { SiMaildotru } from 'react-icons/si';
import { RiLockPasswordLine } from 'react-icons/ri';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Form } from 'react-hook-form';
import { notifications } from '@mantine/notifications';

interface IResetFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const decodeToken = (token: string) => {
  // function to decode token
  const decoded: {
    email: string;
    iat: number;
    exp: number;
    id: string;
    password: string;
  } = jwtDecode(token);
  return decoded;
};

const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Bạn chưa nhập email'),
  password: yup
    .string()
    .required('Bạn chưa nhập mật khẩu')
    .min(8, 'Mật khẩu phải có tối thiểu 8 ký tự'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận lại mật khẩu')
    .oneOf([yup.ref('password'), ''], 'Không trùng với mật khẩu đã nhập'),
});

const ResetPasswordPage = () => {
  // get query params from url react router dom
  let [searchParams, _setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  if (!token) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  const { email, id: userId } = decodeToken(token);

  const { control } = useForm<IResetFormData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      // giá trị mặc định của các field
      email: email,
      password: '',
      confirmPassword: '',
    },
  });

  const handleResetPassword = async (data: IResetFormData) => {
    try {
      const res = await authApi.changePassword({
        userId,
        newPassword: data.password,
        isReset: true,
      });
      if (res.status) {
        notifications.show({
          message: 'Đặt lại mật khẩu thành công',
          color: 'green',
        })
        navigate(PATHS.LOGIN);
      } else {
        notifications.show({
          message: res.message || 'Có lỗi xảy ra. Vui lòng thử lại',
          color: 'red.5',
        });
      }
    }
    catch (err) {
      notifications.show({
        message: 'Có lỗi xảy ra. Vui lòng thử lại',
        color: 'red.5',
      });
    }
  }

  return (
    <Container size={570} my={40} className='min-h-[calc(100vh_-_145px)]'>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title>Đặt lại mật khẩu</Title>
        <Form control={control} onSubmit={e => handleResetPassword(e.data)} onError={e => console.log(e)}>
          <TextInput
            label="Email"
            name="email"
            required
            readOnly
            size="md"
            mt="md"
            control={control}
            leftSection={<SiMaildotru size={16} />}
          />
          <PasswordInput
            name="password"
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            required
            mt="md"
            size="md"
            control={control}
            autoFocus
            leftSection={<RiLockPasswordLine size={18} />}
          />
          <PasswordInput
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu một lần nữa"
            required
            mt="md"
            size="md"
            control={control}
            leftSection={<RiLockPasswordLine size={18} />}
          />

          <Button fullWidth mt="xl" size="md" type="submit">
            Đặt lại mật khẩu
          </Button>

        </Form>
      </Paper >
    </Container>
  );
};

export default ResetPasswordPage;

import { yupResolver } from '@hookform/resolvers/yup';
import { Anchor, Button, Container, Flex, Grid, Image, Paper, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Form, useForm } from 'react-hook-form';
import { PasswordInput, TextInput } from 'react-hook-form-mantine';
import { FaFacebookF } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiMaildotru } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import MicrosoftLogo from '@/assets/icons/microsoft.svg'
import { FirebaseAuthProvider, PATHS } from '@/config';
import { COOKIE_KEY } from '@/constants';
import { useAppDispatch, useAuth } from '@/hooks';
import { authApi } from '@/services';
import { setUserInfo } from '@/store';
import { cookies } from '@/utils';
import { AuthModule } from '@/enums';

interface IRegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  moduleId: number;
}

const schema = yup.object().shape({
  firstName: yup.string().required('Bạn chưa nhập họ'),
  lastName: yup.string().required('Bạn chưa nhập tên'),
  email: yup.string().required('Thông tin email là bắt buộc').email('Email không hợp lệ'),
  password: yup
    .string()
    .required('Bạn chưa nhập mật khẩu')
    .min(8, 'Mật khẩu phải có tối thiểu 8 ký tự'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận lại mật khẩu')
    .oneOf([yup.ref('password'), ''], 'Không trùng với mật khẩu đã nhập'),
  moduleId: yup.number().required(),
});

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loginByOAuth } = useAuth();

  // tích hợp react-hook-form với mantine form
  const { control } = useForm<IRegisterFormData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      // giá trị mặc định của các field
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      moduleId: AuthModule.Guest,
      // emailVerified: false,
    },
  });
  console.log('control: ',control)
  const handleRegister = (data: IRegisterFormData) => {
    const registerData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      moduleId: data.moduleId,
    };

    // gọi api đăng ký
    authApi
      .register(registerData)
      .then(res => {
        if (res.status && !res.errors && res.data) {
          const userInfo = res.data?.user;
          const token = res.data?.token;

          // lưu vào thông tin user vào cookie
          cookies.set(COOKIE_KEY.USER_INFO, userInfo);
          cookies.set(COOKIE_KEY.TOKEN, token);

          // lưu thông tin user vào redux
          dispatch(setUserInfo(userInfo));

          // Hiển thị thông báo
          notifications.show({
            message: 'Đăng ký tài khoản thành công',
            color: 'green',
          });

          // chuyển hướng về trang chủ
          navigate(PATHS.HOME);
        } else {
          console.log('Đăng ký không thành công:', res.message);
          notifications.show({
            message: res.message,
            color: 'red',
          });
        }
      })
      .catch(error => {
        console.log(error.message);
        notifications.show({
          message: error.response.data.message,
          color: 'red',
        });
      });
  };

  return (
    <Container size={570} py={30}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title>Đăng ký</Title>
        <Text c="dimmed" size="sm" mt={5} mb={15}>
          Đã có tài khoản?{' '}
          <Anchor size="sm" component={Link} to={PATHS.LOGIN}>
            Đăng nhập
          </Anchor>
        </Text>
        <Form
          control={control}
          onSubmit={e => handleRegister(e.data)}
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
          <PasswordInput
            name="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu của bạn"
            required
            mt="md"
            size="md"
            radius="sm"
            control={control}
            leftSection={<RiLockPasswordLine size={18} />}
          />
          <PasswordInput
            name="confirmPassword"
            label="Xác nhận Mật khẩu"
            placeholder="Xác nhận mật khẩu của bạn"
            required
            mt="md"
            size="md"
            radius="sm"
            control={control}
            leftSection={<RiLockPasswordLine size={18} />}
          />
          <Button fullWidth mt="xl" radius="sm" size="md" type="submit">
            Đăng ký
          </Button>
          <Text mt='md' mb='sm' fw='500' c='gray.7' ta='center'>Hoặc đăng nhập bằng tài khoản</Text>
          <Flex gap='md' justify='space-between'>
            <Button
              radius='sm'
              size='md'
              variant="outline"
              fullWidth
              leftSection={<FcGoogle size={20} />}
              onClick={() => loginByOAuth(FirebaseAuthProvider.Google)}
            >
              Google
            </Button>
            <Button
              radius='sm'
              size='md'
              variant="outline"
              fullWidth
              leftSection={<FaFacebookF size={20} />}
              onClick={() => loginByOAuth(FirebaseAuthProvider.Facebook)}
            >
              Facebook
            </Button>
            <Button
              radius='sm'
              size='md'
              variant="outline"
              fullWidth
              leftSection={<Image src={MicrosoftLogo} width={20} height={20} />}
              onClick={() => loginByOAuth(FirebaseAuthProvider.Microsoft)}
            >
              Microsoft
            </Button>
          </Flex>
        </Form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;

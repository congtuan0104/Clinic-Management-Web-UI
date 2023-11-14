import { Anchor, Paper, Title, Text, Container, Group, Button, Flex, Divider, ActionIcon, Image } from '@mantine/core';
import { TextInput, PasswordInput, Checkbox } from 'react-hook-form-mantine';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Form } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { RiGithubFill, RiLockPasswordLine } from 'react-icons/ri';
import { FaFacebookF, FaApple } from 'react-icons/fa6';
import { SiMaildotru } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';

import * as yup from 'yup';

import { authApi } from '@/services';
import { cookies } from '@/utils';
import { PATHS, FirebaseAuthProvider, firebaseAuth } from '@/config';
import { useAppDispatch, useAuth } from '@/hooks';
import { setUserInfo } from '@/store';
import { COOKIE_KEY } from '@/constants';
import { notifications } from '@mantine/notifications';
import MicrosoftLogo from '@/assets/icons/microsoft.svg'

interface ILoginFormData {
  email: string;
  password: string;
  isRemember?: boolean;
}

// định nghĩa điều kiện xác định input hợp lệ
const schema = yup.object().shape({
  email: yup.string().required('Bạn chưa nhập email').email('Email không hợp lệ'),
  password: yup
    .string()
    .required('Bạn chưa nhập mật khẩu')
    .min(8, 'Mật khẩu phải có tối thiểu 8 ký tự'),
  isRemember: yup.boolean(),
});

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loginByOAuth } = useAuth(); // xử lý đăng nhập bằng tài khoản bên thứ 3 (Google, Facebook, ...)

  // tích hợp react-hook-form với antd form
  const { control, handleSubmit } = useForm<ILoginFormData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      // giá trị mặc định của các field
      email: '',
      password: '',
      isRemember: false,
    },
  });

  const handleLogin = (data: ILoginFormData) => {
    // gọi api đăng nhập
    // nếu thành công, lưu access token vào cookie và thông tin user vào redux -> chuyển hướng về trang chủ
    // nếu thất bại, hiển thị thông báo lỗi
    authApi
      .login({ email: data.email, password: data.password })
      .then(res => {
        if (res.status && !res.errors && res.data) {
          const userInfo = res.data?.user;
          const token = res.data?.token;

          // lưu vào token và thông tin user vào cookie
          cookies.set(COOKIE_KEY.TOKEN, token);
          cookies.set(COOKIE_KEY.USER_INFO, userInfo);

          // lưu thông tin user vào redux
          dispatch(setUserInfo(userInfo));

          // Hiển thị thông báo
          notifications.show({
            message: 'Đăng nhập thành công',
            color: 'green',
          });

          // chuyển hướng về trang chủ
          // navigate(PATHS.HOME);
          navigate(PATHS.ADMIN_DASHBOARD);

        } else {
          notifications.show({
            message: res.message,
            color: 'red',
          });
          console.log('Loi dang nhap:', res.message);
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
    <Container size={500} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title>Đăng nhập</Title>
        <Text c="dimmed" size="sm" mt={5} mb={15}>
          hoặc{' '}
          <Anchor size="sm" component={Link} to={PATHS.REGISTER}>
            Tạo tài khoản mới
          </Anchor>
        </Text>
        <Form control={control} onSubmit={e => handleLogin(e.data)} onError={e => console.log(e)}>
          <TextInput
            label="Email"
            name="email"
            placeholder="example@gmail.com"
            required
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
          <Group justify="space-between" mt="lg">
            <Checkbox
              label="Lưu thông tin đăng nhập"
              radius="sm"
              control={control}
              name="isRemember"
            />
            <Anchor component={Link} size="sm" to='#'>
              Quên mật khẩu?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" radius="sm" size="md" type="submit">
            Đăng nhập
          </Button>

          <Divider my='md' />

          <Text c='gray' ta='center' mt='md' mb='sm'>Hoặc đăng nhập bằng</Text>
          <Flex gap='md' justify='space-between' px={70}>
            <ActionIcon
              radius="xl"
              size="xl"
              color='primary'
              variant="outline"
              onClick={() => loginByOAuth(FirebaseAuthProvider.Google)}
            >
              <FcGoogle size={30} />
            </ActionIcon>

            <ActionIcon
              radius="xl"
              size="xl"
              color='primary'
              variant="outline"
              onClick={() => loginByOAuth(FirebaseAuthProvider.Facebook)}
            >
              <FaFacebookF size={30} />
            </ActionIcon>

            {/* <ActionIcon
              radius="xl"
              size="xl"
              color='gray'
              variant="outline"
              onClick={() => loginByOAuth(FirebaseAuthProvider.Apple)}
            >
              <FaApple size={30} />
            </ActionIcon> */}

            <ActionIcon
              radius="xl"
              size="xl"
              color='primary'
              variant="outline"
              onClick={() => loginByOAuth(FirebaseAuthProvider.Microsoft)}
            >
              <Image src={MicrosoftLogo} width={25} height={25} />
            </ActionIcon>

            <ActionIcon
              radius="xl"
              size="xl"
              color='black'
              variant="outline"
              onClick={() => loginByOAuth(FirebaseAuthProvider.Github)}
            >
              <RiGithubFill size={30} />
            </ActionIcon>
          </Flex>
        </Form>
      </Paper>
    </Container>
  );
};

export default LoginPage;

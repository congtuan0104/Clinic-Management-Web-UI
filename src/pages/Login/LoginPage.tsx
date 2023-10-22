import { Anchor, Paper, Title, Text, Container, Group, Button } from '@mantine/core';
import { TextInput, PasswordInput, Checkbox } from 'react-hook-form-mantine';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Form } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiMaildotru } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';

import * as yup from 'yup';

import { authApi } from '@/services/auth.service';
import { cookies } from '@/utils';
import { PATHS } from '@/config';
import { useAppDispatch } from '@/hooks';
import { setUserInfo } from '@/store';
import { COOKIE_KEY } from '@/constants';
import { notifications } from '@mantine/notifications';

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
        if (res.success && !res.errors && res.data) {
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
          navigate(PATHS.HOME);
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
            <Anchor component="button" size="sm">
              Quên mật khẩu?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" radius="sm" size="md" type="submit">
            Đăng nhập
          </Button>
          <Button
            fullWidth
            mt="sm"
            radius="sm"
            size="md"
            variant="outline"
            leftSection={<FcGoogle size={20} />}>
            Đăng nhập bằng tài khoản Google
          </Button>
        </Form>
      </Paper>
    </Container>
  );
};

export default LoginPage;

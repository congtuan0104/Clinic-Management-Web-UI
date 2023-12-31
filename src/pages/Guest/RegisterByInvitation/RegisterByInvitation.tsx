import { yupResolver } from '@hookform/resolvers/yup';
import { PATHS } from '@/config';
import { Container, Paper, Title, Text, Anchor, Button, Grid } from '@mantine/core';
import { useForm, Form } from 'react-hook-form';
import { PasswordInput, TextInput } from 'react-hook-form-mantine';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiMaildotru } from 'react-icons/si';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { authApi } from '@/services';
import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';
import { setUserInfo } from '@/store';
import { useAppDispatch } from '@/hooks';
import { notifications } from '@mantine/notifications';
import React, { useEffect } from 'react';
import { JwtPayload, jwtDecode } from 'jwt-decode';

interface IRegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  emailVerified: boolean;
  role: string;
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
  emailVerified: yup.boolean().required(),
  role: yup.string().required(),
});

const decodeToken = (token: string) => {
  // function to decode token
  const decoded: {
    email: string;
    role: string;
    iat: number;
    exp: number;
  } = jwtDecode(token);
  const result = {
    email: decoded?.email,
    role: decoded?.role,
  };
  return result;
};

const RegisterByInvitation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let token_email: string = '';
  let token_role: string = '';

  // get token from param and decode token to get email and role
  let [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  if (token) {
    const { email, role } = decodeToken(token);
    token_email = email;
    token_role = role;
  }

  // tích hợp react-hook-form với mantine form
  const { control } = useForm<IRegisterFormData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      // giá trị mặc định của các field
      firstName: '',
      lastName: '',
      email: token_email,
      password: '',
      confirmPassword: '',
      role: token_role,
      emailVerified: true,
    },
  });

  const handleRegister = (data: IRegisterFormData) => {
    const { confirmPassword, ...registerData } = data; // xóa thông tin xác nhận mật khẩu trước khi gửi api
    console.log(registerData);
    // gọi api đăng ký
    authApi
      .register(registerData)
      .then(res => {
        if (res.status && !res.errors && res.data) {
          const userInfo = res.data?.user;

          // lưu vào thông tin user vào cookie
          cookies.set(COOKIE_KEY.USER_INFO, userInfo);

          // lưu thông tin user vào redux
          dispatch(setUserInfo(userInfo));

          // Hiển thị thông báo
          notifications.show({
            message: 'Đăng ký tài khoản thành công',
            color: 'green',
          });

          // Nếu đăng ký thành công thì sẽ cần đưa về trang Login
          navigate(PATHS.LOGIN);
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
    <Container size={570} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title>Đăng ký</Title>
        {/* <Text c="dimmed" size="sm" mt={5} mb={15}>
          Đã có tài khoản?{' '}
          <Anchor size="sm" component={Link} to={PATHS.LOGIN}>
            Đăng nhập
          </Anchor>
        </Text> */}
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
            required
            readOnly
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
        </Form>
      </Paper>
    </Container>
  );
};

export default RegisterByInvitation;

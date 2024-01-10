import { yupResolver } from '@hookform/resolvers/yup';
import { Anchor, Button, Container, Flex, Grid, Image, Paper, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Form, useForm } from 'react-hook-form';
import { Chip, PasswordInput, Radio, TextInput } from 'react-hook-form-mantine';
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
import classNames from 'classnames';

interface IRegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  moduleId: string;
  emailVerified?: boolean;
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
  moduleId: yup.string().required('Bạn cần chọn mục đích sử dụng'),
});

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loginByOAuth } = useAuth();

  // tích hợp react-hook-form với mantine form
  const { control, getValues, setValue, register } = useForm<IRegisterFormData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      // giá trị mặc định của các field
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      moduleId: '',
      emailVerified: import.meta.env.MODE === 'development' ? true : false, // bỏ qua gửi mail xác thực khi chạy local
    },
  });

  const handleRegister = async (data: IRegisterFormData) => {
    try {
      const registerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        moduleId: parseInt(data.moduleId),
      };

      // gọi api đăng ký
      const res = await authApi.register(registerData)

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
      }
      else {
        notifications.show({
          title: 'Lỗi',
          message: res.message || 'Đăng ký tài khoản không thành công!',
          color: 'red.5',
        });
      }
    }
    catch (error: any) {
      notifications.show({
        title: 'Lỗi',
        message: error.response.data.message || 'Đăng ký tài khoản không thành công!',
        color: 'red.5',
      });
    }
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
            placeholder="Nhập lại mật khẩu một lần nữa"
            required
            mt="md"
            size="md"
            radius="sm"
            control={control}
            leftSection={<RiLockPasswordLine size={18} />}
          />
          {/* Phân hệ */}
          <Text mt='md' mb='sm'>Mục đích sử dụng của bạn là gì?</Text>

          {/* <div className="flex gap-3">
            <input type="hidden" {...control.register('moduleId')} />
            <button
              type='button'
              onClick={() => setValue('moduleId', AuthModule.Patient.toString())}
              className={classNames(
                'cursor-pointer w-full text-center py-2 bg-transparent border-solid border-gray-300 rounded',
                getValues('moduleId') === AuthModule.Patient.toString() ? 'bg-primary-400 text-white' : 'hover:bg-primary-100'
              )}>
              Khám chữa bệnh
            </button>
            <button
              type='button'
              onClick={() => setValue('moduleId', AuthModule.Clinic.toString())}
              className={classNames(
                'cursor-pointer w-full text-center py-2 bg-transparent border-solid border-gray-300 rounded',
                getValues('moduleId') === AuthModule.Clinic.toString() ? 'bg-primary-400 text-white' : 'hover:bg-primary-100'
              )}>
              Quản lý phòng khám
            </button>
          </div> */}

          <Chip.Group
            name="moduleId"
            control={control}
          >
            <Flex gap={15}>
              <Chip.Item
                value={AuthModule.Patient.toString()}
                size='md'
                variant='light'
                radius='md'
                w='100%'
                className='!text-14'
                color='secondary.4'
                styles={{ label: { width: '100%', height: '40px' } }}
              >
                Khám chữa bệnh
              </Chip.Item>
              <Chip.Item
                value={AuthModule.Clinic.toString()}
                size='md'
                variant='light'
                radius='md'
                w='100%'
                color='secondary.4'
                styles={{ label: { width: '100%', height: '40px' } }}
              >
                Quản lý phòng khám
              </Chip.Item>

            </Flex>
          </Chip.Group>
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

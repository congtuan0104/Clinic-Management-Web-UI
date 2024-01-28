import { yupResolver } from '@hookform/resolvers/yup';
import { Anchor, Button, Container, Flex, Grid, Image, Modal, Paper, Text, Title, TextInput as MantineTextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Form, useForm } from 'react-hook-form';
import { Chip, PasswordInput, TextInput } from 'react-hook-form-mantine';
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
import { AuthProvider } from 'firebase/auth';
import classNames from 'classnames';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

interface IRegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  moduleId: string;
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
  const { getUserInfoByProvider } = useAuth(); // xử lý đăng nhập bằng tài khoản bên thứ 3 (Google, Facebook, ...)

  const [providerLogin, setProviderLogin] = useState<string>('');
  const [userIdFromProvider, setUserIdFromProvider] = useState<string>('');
  const [emailChoose, setEmailChoose] = useState<string>(''); // email được chọn để đăng ký tài khoản
  const [emailFromProvider, setEmailFromProvider] = useState<string | null>(''); // email được chọn để đăng ký tài khoản
  const [openedModalChooseEmail, { open, close }] = useDisclosure(false);

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
        emailVerified: import.meta.env.MODE === 'development' ? true : false, // bỏ qua gửi mail xác thực khi chạy local,
      };

      // gọi api đăng ký
      const res = await authApi.register(registerData)

      if (res.status && !res.errors && res.data) {
        // const userInfo = res.data?.user;
        // const token = res.data?.token;

        // // lưu vào thông tin user vào cookie
        // cookies.set(COOKIE_KEY.USER_INFO, userInfo);
        // cookies.set(COOKIE_KEY.TOKEN, token);

        // // lưu thông tin user vào redux
        // dispatch(setUserInfo(userInfo));
        if (import.meta.env.MODE === 'development')
          navigate(PATHS.LOGIN); // bỏ qua gửi mail xác thực khi chạy local
        else
          navigate(`${PATHS.VERIFY}?email=${data.email}`);

        // Hiển thị thông báo
        notifications.show({
          message: 'Đăng ký tài khoản thành công',
          color: 'green',
        });

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

  const loginByOAuth = async (provider: AuthProvider) => {
    // lấy thông tin user từ provider
    try {
      const userInfoFromProvider = await getUserInfoByProvider(provider);
      let providerStr;

      switch (provider) {
        case FirebaseAuthProvider.Google:
          providerStr = 'google';
          break;
        case FirebaseAuthProvider.Facebook:
          providerStr = 'facebook';
          break;
        case FirebaseAuthProvider.Microsoft:
          providerStr = 'microsoft';
          break;
        default:
          providerStr = 'google';
          break;
      }

      if (!userInfoFromProvider) {
        notifications.show({
          message: 'Đăng nhập không thành công',
          color: 'red',
        });
        return;
      }

      // gửi thông tin user lên server để lấy token (đang chờ api)
      console.log(`user info from: `, userInfoFromProvider);
      setUserIdFromProvider(userInfoFromProvider.uid);
      setProviderLogin(providerStr);

      // kiểm tra account có tồn tại, nếu có thì lưu thông tin user và token
      const res = await authApi.getUserByAccountId(userInfoFromProvider.uid, providerStr);

      if (res.data && res.data.user) {
        const userInfo = res.data.user;
        cookies.set(COOKIE_KEY.TOKEN, res.data.token);
        cookies.set(COOKIE_KEY.USER_INFO, JSON.stringify(userInfo));
        dispatch(setUserInfo(userInfo));
        notifications.show({
          message: 'Đăng nhập thành công',
          color: 'green',
        });
        switch (userInfo.moduleId) {
          case AuthModule.Admin:
            navigate(PATHS.ADMIN_DASHBOARD);
            break;
          case AuthModule.Clinic:
            navigate(PATHS.CLINIC_DASHBOARD);
            break;
          case AuthModule.Patient:
            navigate(PATHS.PROFILE);
            break;
          default:
            navigate(PATHS.PROFILE);
            break;
        }
        return;
      } else {
        // chưa có tài khoản, chọn email để đăng ký tài khoản 
        setEmailFromProvider(userInfoFromProvider.email || userInfoFromProvider.providerData[0].email);
        open(); // mở modal chọn email để đăng ký tài khoản
      }
    } catch (err) {
      console.error(err);
      notifications.show({
        message: 'Đăng nhập không thành công',
        color: 'red',
      });
    }
  };

  const sendEmailVerifyLinkAccount = async (email: string) => {
    try {
      const res = await authApi.sendEmailVerifyUser({ email, key: userIdFromProvider, provider: providerLogin });
      if (res.status) {
        notifications.show({
          message: `Chúng tôi đã gửi mail xác thực đến ${email}.\n Vui lòng kiểm tra mail và xác thực tài khoản`,
          color: 'green',
        });
        close();
      }
      setEmailChoose('');
    }
    catch (err) {
      console.error(err);
      notifications.show({
        message: 'Gửi mail xác thực không thành công',
        color: 'red',
      });
    }
  }

  return (
    <Container size={570} py={30} className='min-h-[calc(100vh_-_145px)]'>
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
      <Modal opened={openedModalChooseEmail} onClose={close} title="Tài khoản của bạn chưa được liên kết, vui lòng chọn email muốn liên kết">
        {emailFromProvider &&
          <>
            <Text size='sm'>Chọn email để liên kết tài khoản</Text>
            <Button fullWidth variant='outline' color='orange.6' onClick={() => {
              setEmailChoose(emailFromProvider)
              sendEmailVerifyLinkAccount(emailFromProvider);
            }}>
              <Text>{emailFromProvider}</Text>
            </Button>
          </>
        }

        <Flex align='flex-end' gap={10}>
          <MantineTextInput
            mt='md'
            className='flex-1'
            label="Hoặc nhập email của bạn"
            placeholder="Nhập tài khoản mà bạn muốn liên kết"
            value={emailChoose}
            name='email-register'
            onChange={(e) => setEmailChoose(e.currentTarget.value)}
          />
          <Button mt='md' onClick={() => sendEmailVerifyLinkAccount(emailChoose)}>Tiếp tục</Button>
        </Flex>
      </Modal>
    </Container>
  );
};

export default RegisterPage;

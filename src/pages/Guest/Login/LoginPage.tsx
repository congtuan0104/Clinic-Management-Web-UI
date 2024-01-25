import { Anchor, Paper, Title, Text, Container, Group, Button, Flex, Divider, ActionIcon, Image, Box, Modal, TextInput as MantineTextInput } from '@mantine/core';
import { TextInput, PasswordInput, Checkbox } from 'react-hook-form-mantine';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Form } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { RiGithubFill, RiLockPasswordLine } from 'react-icons/ri';
import { FaFacebookF, FaApple } from 'react-icons/fa6';
import { SiMaildotru } from 'react-icons/si';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import * as yup from 'yup';

import { authApi } from '@/services';
import { cookies } from '@/utils';
import { PATHS, FirebaseAuthProvider, firebaseAuth } from '@/config';
import { useAppDispatch, useAuth } from '@/hooks';
import { setUserInfo } from '@/store';
import { COOKIE_KEY } from '@/constants';
import { notifications } from '@mantine/notifications';
import MicrosoftLogo from '@/assets/icons/microsoft.svg'
import { AuthProvider } from 'firebase/auth';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { AuthModule } from '@/enums';

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
  const [searchParams] = useSearchParams();
  const callback = searchParams.get('callback');
  const [emailChoose, setEmailChoose] = useState<string>(''); // email được chọn để đăng ký tài khoản
  const [emailFromProvider, setEmailFromProvider] = useState<string | null>(''); // email được chọn để đăng ký tài khoản
  const [openedModalChooseEmail, { open, close }] = useDisclosure(false);
  const { getUserInfoByProvider } = useAuth(); // xử lý đăng nhập bằng tài khoản bên thứ 3 (Google, Facebook, ...)
  const [providerLogin, setProviderLogin] = useState<string>('');
  const [userIdFromProvider, setUserIdFromProvider] = useState<string>('');

  // tích hợp react-hook-form với antd form
  const { control } = useForm<ILoginFormData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      // giá trị mặc định của các field
      email: '',
      password: '',
      isRemember: false,
    },
  });

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
      console.log(`userAccount: `, res.data.user);
      if (res.data.user) {
        cookies.set(COOKIE_KEY.TOKEN, res.data.token);
        cookies.set(COOKIE_KEY.USER_INFO, JSON.stringify(res.data.user));
        dispatch(setUserInfo(res.data.user));
        notifications.show({
          message: 'Đăng nhập thành công',
          color: 'green',
        });
        navigate(PATHS.PROFILE);
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

  const handleLogin = (data: ILoginFormData) => {
    // gọi api đăng nhập
    // nếu thành công, lưu access token vào cookie và thông tin user vào redux -> chuyển hướng về trang chủ
    // nếu thất bại, hiển thị thông báo lỗi
    authApi
      .login({ email: data.email, password: data.password })
      .then(res => {

        if (res.data) {
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

          switch (userInfo.moduleId) {
            case AuthModule.Admin:
              navigate(PATHS.ADMIN_DASHBOARD);
              break;
            case AuthModule.Clinic:
              navigate(PATHS.CLINIC_DASHBOARD);
              break;
            default:
              navigate(PATHS.PROFILE);
              break;
          }


        } else {
          notifications.show({
            message: res.message,
            color: 'red',
          });
        }
      })
      .catch(error => {
        if (error.response.data.message === 'Email chưa được xác thực') {
          navigate(`${PATHS.VERIFY}?email=${data.email}`); // chuyển hướng đến trang xác thực tài khoản
        }
        else {
          notifications.show({
            message: error.response.data.message,
            color: 'red',
          });
        }
      });
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
    <Container size={570} my={40} className='min-h-[calc(100vh_-_145px)]'>
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
            autoFocus
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
            <Anchor component={Link} size="sm" to={PATHS.FORGET_PASSWORD}>
              Quên mật khẩu?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" radius="sm" size="md" type="submit">
            Đăng nhập
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
      </Paper >
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

export default LoginPage;

import { Paper, Text, Group, Avatar, Input, Divider, Button, Flex, Modal } from '@mantine/core';
import { PasswordInput } from 'react-hook-form-mantine';
import { useDisclosure } from '@mantine/hooks';

import { useForm, Form } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useState, useEffect } from 'react';
import { authApi } from '@/services/auth.service';
import { notifications } from '@mantine/notifications';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@/hooks';
import { FirebaseAuthProvider } from '@/config';

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const schema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Bạn chưa nhập mật khẩu hiện tại')
    .min(8, 'Mật khẩu phải có tối thiểu 8 ký tự'),
  newPassword: yup
    .string()
    .required('Bạn chưa nhập mật khẩu mới')
    .min(8, 'Mật khẩu phải có tối thiểu 8 ký tự'),
  confirmNewPassword: yup
    .string()
    .required('Vui lòng xác nhận lại mật khẩu')
    .oneOf([yup.ref('newPassword'), ''], 'Không trùng với mật khẩu đã nhập'),
});


const UserProfilePage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const { userInfo, linkAccount } = useAuth();

  const [googleAccoutId, setgoogleAccoutId] = useState<string>('')
  const [fbAccoutId, setfbAccoutId] = useState('')
  const [micAccoutId, setmicAccoutId] = useState('')

  const [isGoogleLink, setisGoogleLink] = useState(false)
  const [isFacebookLink, setisFacebookLink] = useState(false)
  const [isMicrosoftLink, setisMicrosoftLink] = useState(false)

  const { control, reset } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      const res = await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (res.status) {
        // Password change successful
        notifications.show({
          message: 'Đổi mật khẩu thành công',
          color: 'green',
        })
        close();  // Đóng modal đổi mật khẩu
        reset();  // reset value form đổi mật khẩu
      } else {
        notifications.show({
          message: res.message || 'Đổi mật khẩu không thành công',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        message: 'Đổi mật khẩu không thành công',
        color: 'red',
      });
    }
  };

  // Kiểm tra và lấy danh sách tài khoản google liên kết
  const checkAccountIsLinked = async () => {
    if (userInfo?.id) {
      authApi.getAccountByUser(userInfo.id)
        .then(res => {
          res.data.forEach((item: any) => {
            if (item.provider === 'google') {
              setgoogleAccoutId(item.id)
              setisGoogleLink(true)
            }
            if (item.provider === 'facebook') {
              setfbAccoutId(item.id)
              setisFacebookLink(true)
            }
            if (item.provider === 'microsoft') {
              setmicAccoutId(item.id)
              setisMicrosoftLink(true)
            }
          });
        });
    }
  }

  useEffect(() => {
    checkAccountIsLinked();
  }, []);

  const handleConnectGoogle = async () => {
    const res = await linkAccount(FirebaseAuthProvider.Google, 'google');
    checkAccountIsLinked();
  }

  const handleConnectFacebook = async () => {
    const res = await linkAccount(FirebaseAuthProvider.Facebook, 'facebook');
    checkAccountIsLinked();
  }

  const handleConnectMicrosoft = async () => {
    const res = await linkAccount(FirebaseAuthProvider.Microsoft, 'microsoft');
    checkAccountIsLinked();
  }

  const handleDisConnectFacebook = () => {
    if (userInfo?.id) {
      authApi.unlinkAccount(userInfo.id, fbAccoutId)
        .then(() => {
          setisFacebookLink(false)
          // Hiển thị thông báo
          notifications.show({
            message: 'Hủy liên kết tài khoản thành công',
            color: 'green',
          });
        })
    }
  }
  const handleDisConnectGoogle = () => {
    if (userInfo?.id) {
      authApi.unlinkAccount(userInfo.id, googleAccoutId)
        .then(() => {
          setisGoogleLink(false)
          // Hiển thị thông báo
          notifications.show({
            message: 'Hủy liên kết tài khoản thành công',
            color: 'green',
          });
        })
    }
  }

  const handleDisConnectMicrosoft = () => {
    if (userInfo?.id) {
      authApi.unlinkAccount(userInfo.id, micAccoutId)
        .then(() => {
          setisMicrosoftLink(false)
          // Hiển thị thông báo
          notifications.show({
            message: 'Hủy liên kết tài khoản thành công',
            color: 'green',
          });
        })
    }
  }

  return (
    <Flex my={30} gap={20} direction={{ base: 'column', md: 'row' }} className='max-w-screen-xl mx-auto'>
      <Paper w='100%' withBorder shadow="md" p={30} radius="md">
        <div>
          {/* <Group wrap="nowrap">
            <Avatar
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
              size={94}
              radius="md"
            />
            <div>
              <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                Bệnh nhân
              </Text>
              <Text fz="lg" fw={500} className={classes.name}>
                Vo Hoai An
              </Text>
            </div>
          </Group> */}

          <div style={{ margin: '1rem 0' }}>
            <Text fz="lg" fw={700}>
              Thông tin cá nhân
            </Text>
            <Divider />
          </div>

          <Input.Wrapper label="Email" style={{ margin: '1rem 0' }}>
            <Input placeholder={userInfo?.email} readOnly />
          </Input.Wrapper>

          <Input.Wrapper label="SĐT" style={{ margin: '1rem 0' }}>
            <Input placeholder="098938696" readOnly />
          </Input.Wrapper>
          <Modal.Root opened={opened} onClose={close} centered>
            <Modal.Overlay />
            <Modal.Content>
              <Modal.Header>
                <Modal.Title fz="lg" fw={600}>Đổi mật khẩu</Modal.Title>
                <Modal.CloseButton />
              </Modal.Header>
              <Modal.Body><Form
                control={control} onSubmit={e => handleChangePassword(e.data)} onError={e => console.log(e)}>
                <PasswordInput
                  name="currentPassword"
                  label="Mật khẩu hiện tại"
                  placeholder="Nhập mật khẩu hiện tại của bạn"
                  required
                  mt="md"
                  size="md"
                  radius="sm"
                  control={control}
                  leftSection={<RiLockPasswordLine size={18} />}
                />
                <PasswordInput
                  name="newPassword"
                  label="Mật khẩu mới"
                  placeholder="Nhập mật khẩu mới của bạn"
                  required
                  mt="md"
                  size="md"
                  radius="sm"
                  control={control}
                  leftSection={<RiLockPasswordLine size={18} />}
                />
                <PasswordInput
                  name="confirmNewPassword"
                  label="Xác nhận lại mật khẩu"
                  placeholder="Xác nhận lại mật khẩu bạn vừa nhập"
                  required
                  mt="md"
                  size="md"
                  radius="sm"
                  control={control}
                  leftSection={<RiLockPasswordLine size={18} />}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', }}>
                  <Button mt="xl" radius="sm" size="md" type="submit">
                    Xác nhận
                  </Button>
                  <Button mt="xl" ml="sm" radius="sm" size="md" variant='outline' color='red.5'
                    onClick={() => {
                      close();
                      reset();
                    }}>
                    Hủy
                  </Button>
                </div>
              </Form>
              </Modal.Body>
            </Modal.Content>
          </Modal.Root>

        </div>
      </Paper>

      <Paper w='100%' withBorder shadow="md" p={30} radius="md">
        <Text fz="xl" fw={700}>
          Quản lý tài khoản đăng nhập
        </Text>
        <div className='flex justify-between items-center w-full'>
          <Text pt={30} fz="md" fw={700}>
            Mật khẩu
          </Text>

          <Button mt={30} radius="sm" variant='subtle' onClick={open}>
            Đổi mật khẩu
          </Button>

        </div>
        <Divider />
        <Text pt={30} fz="xl" fw={700}>
          Tài khoản mạng xã hội
        </Text>
        <div>
          <Text pt={30} fz="md" fw={700}>
            Facebook
          </Text>
          <div className="flex justify-between">
            <Text pt={20} pb={20} c="grey" fz="md" fw={200}>
              {isFacebookLink ? `Đã kết nối` : 'Chưa kết nối'}
            </Text>
            {isFacebookLink ? (
              <Button color='red.5' variant="subtle" onClick={handleDisConnectFacebook}>Hủy kết nối</Button>
            ) : (
              <Button variant="subtle" onClick={handleConnectFacebook}>Kết nối</Button>
            )}
          </div>
          <Divider />
        </div>
        <div>
          <Text pt={30} fz="md" fw={700}>
            Microsoft
          </Text>
          <div className="flex justify-between">
            <Text pt={20} pb={20} c="grey" fz="md" fw={200}>
              {isMicrosoftLink ? `Đã kết nối` : 'Chưa kết nối'}
            </Text>
            {isMicrosoftLink ? (
              <Button color='red.5' variant="subtle" onClick={handleDisConnectMicrosoft}>Hủy kết nối</Button>
            ) : (
              <Button variant="subtle" onClick={handleConnectMicrosoft}>Kết nối</Button>
            )}
          </div>
          <Divider />
        </div>
        <div>
          <Text pt={30} fz="md" fw={700}>
            Google
          </Text>
          <div className="flex justify-between">
            <Text pt={20} pb={20} c="grey" fz="md" fw={200}>
              {isGoogleLink ? `Đã kết nối` : 'Chưa kết nối'}
            </Text>
            {isGoogleLink ? (
              <Button color='red.5' variant="subtle" onClick={handleDisConnectGoogle}>Hủy kết nối</Button>
            ) : (
              <Button variant="subtle" onClick={handleConnectGoogle}>Kết nối</Button>
            )}
          </div>
          <Divider />
        </div>
      </Paper>
    </Flex>
  );
}

export default UserProfilePage;

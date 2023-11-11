import { Paper, Text, Group, Avatar, Input, Divider, Button, Flex, Modal } from '@mantine/core';
import { PasswordInput } from 'react-hook-form-mantine';
import { useDisclosure } from '@mantine/hooks';

import { useForm, Form } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import React, { useState, useEffect } from 'react';
import { authApi } from '@/services/auth.service';
import { notifications } from '@mantine/notifications';
import { useSelector } from 'react-redux';
import { CommonState, RootState } from '@/store';
import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import classes from './UserInfoIcons.module.css';
import { IUserInfo } from '@/types';

const isGoogleLink = true;
const isFacebookLink = false;

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const schema = yup.object().shape({
  currentPassword: yup.string().required('Bạn chưa nhập mật khẩu hiện tại'),
  newPassword: yup
    .string()
    .required('Bạn chưa nhập mật khẩu mới')
    .min(8, 'Mật khẩu phải có tối thiểu 8 ký tự'),
  confirmNewPassword: yup
    .string()
    .required('Vui lòng xác nhận lại mật khẩu')
    .oneOf([yup.ref('password'), ''], 'Không trùng với mật khẩu đã nhập'),
});


const ProFilePage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  // const userInfo = useAppSelector(userInfoSelector);

  const [googleAccout, setgoogleAccout] = useState('')
  //const userInforedux = useSelector((state: RootState) => state.common.user);

  /* console.log('user info redux: ', userInforedux);
  if (userInforedux){
    console.log('user id: ', userInforedux.id);
  } */
  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>();

  const { control } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  useEffect(() => {
    const userInfo_cookies = cookies.get(COOKIE_KEY.USER_INFO);

    console.log('user Info cookies: ', userInfo_cookies)
    // Kiểm tra nếu userInfo tồn tại
    if (userInfo_cookies) {
      // Xử lý userInfo
      const userInfoObject = JSON.parse(userInfo_cookies);
      console.log('User Info id:', userInfoObject.id);
      setUserInfo(userInfoObject);
    }
  }, []);

  const handleConnectGoogle = () => {

    signInWithPopup(auth, provider.google).then((data) => {
      /* setValue(data.user.email)
      localStorage.setItem("email",data.user.email) */

      const userInfo = cookies.get(COOKIE_KEY.USER_INFO);

      console.log('user Info cookies: ', userInfo)
      // Kiểm tra nếu userInfo tồn tại
      if (userInfo) {
        // Xử lý userInfo
        const userInfoObject = JSON.parse(userInfo);
        console.log('User Info id:', userInfoObject.id);

        console.log(data)
        if (data.user.email) {
          setgoogleAccout(data.user.email);
        } else {
          console.log("Không nhận được email")
        }
        if (data.user)
          authApi
            .linkAccount({ key: data.user.email, userId: userInfoObject?.id, firstName: data.user.displayName, lastName: data.user.displayName, picture: data.user.photoURL, provider: "Google" })
            .then(res => {

              // Hiển thị thông báo
              notifications.show({
                message: 'Liên kết tài khoản thành công',
                color: 'green',
              });


            }
            )
            .catch(error => {
              console.log(error.message);
              notifications.show({
                message: error.response.data.message,
                color: 'red',
              });
            });
      } else {
        // Xử lý khi không tìm thấy userInfo trong cookies
        console.log('User Info not found in cookies');
      }


    }).catch((error) => {
      console.log(error);
    })
  }

  return (
    <Flex my={30} mx={{ base: 15, md: 0 }} gap={20} direction={{ base: 'column', md: 'row' }}>
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
            <Text fz="lg" fw={700} className={classes.name}>
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
                control={control}>
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
                    Đổi mật khẩu
                  </Button>
                </div>
              </Form>
              </Modal.Body>
            </Modal.Content>
          </Modal.Root>

        </div>
      </Paper>

      <Paper w='100%' withBorder shadow="md" p={30} radius="md">
        <Text fz="xl" fw={700} className={classes.name}>
          Quản lý tài khoản đăng nhập
        </Text>
        <div className='flex justify-between items-center w-full'>
          <Text pt={30} fz="md" fw={700} className={classes.name}>
            Mật khẩu
          </Text>

          <Button mt={30} radius="sm" variant='subtle' onClick={open}>
            Đổi mật khẩu
          </Button>

          <Divider />
        </div>
        <Text pt={30} fz="xl" fw={700} className={classes.name}>
          Tài khoản mạng xã hội
        </Text>
        <div>
          <Text pt={30} fz="md" fw={700} className={classes.name}>
            Facebook
          </Text>
          <div className="flex justify-between">
            <Text pt={20} pb={20} c="grey" fz="md" fw={200} className={classes.name}>
              {isFacebookLink ? ('Đã kết nối') : ('Chưa kết nối')}
            </Text>
            <Button variant="subtle">Kết nối</Button>
          </div>
          <Divider />
        </div>
        <div>
          <Text pt={30} fz="md" fw={700} className={classes.name}>
            Google
          </Text>
          <div className="flex justify-between">
            <Text pt={20} pb={20} c="grey" fz="md" fw={200} className={classes.name}>
              {isGoogleLink ? ('Đã kết nối') : ('Chưa kết nối')}
            </Text>
            <Button variant="subtle" onClick={handleConnectGoogle}>Kết nối</Button>
          </div>
          <Divider />
        </div>
      </Paper>
    </Flex>
  );
}

export default ProFilePage;

import { Paper, Text, Group, Avatar, Input, Divider, Button, Flex, Modal } from '@mantine/core';
import { PasswordInput } from 'react-hook-form-mantine';
import { useDisclosure } from '@mantine/hooks';

import { useForm, Form } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';


import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import classes from './UserInfoIcons.module.css';

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

  const { control } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  return (
    <Flex my={30} mx={{ base: 15, md: 0 }} gap={20} direction={{ base: 'column', md: 'row' }}>
      <Paper w='100%' withBorder shadow="md" p={30} radius="md">
        <div>
          <Group wrap="nowrap">
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
          </Group>

          <div style={{ margin: '1rem 0' }}>
            <Text fz="lg" fw={700} className={classes.name}>
              Thông tin cá nhân
            </Text>
            <Divider />
          </div>

          <Input.Wrapper label="Email" style={{ margin: '1rem 0' }}>
            <Input placeholder="example@gmail.com" readOnly />
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', }}>
            <Button mt="xl" radius="sm" size="md" type="submit" onClick={open}>
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </Paper>

      <Paper w='100%' withBorder shadow="md" p={30} radius="md">
        <Text fz="xl" fw={700} className={classes.name}>
          Quản lý tài khoản đăng nhập
        </Text>
        <div>
          <Text pt={30} fz="md" fw={700} className={classes.name}>
            Mật khẩu
          </Text>
          <Text pt={20} pb={20} c="grey" fz="md" fw={200} className={classes.name}>
            Cập nhật lần cuối 19 phút trước
          </Text>
          <Divider />
        </div>
        <Text pt={30} fz="xl" fw={700} className={classes.name}>
          Tài khoản mạng xã hội
        </Text>
        <div>
          <Text pt={30} fz="md" fw={700} className={classes.name}>
            Facebook
          </Text>
          <Text pt={20} pb={20} c="grey" fz="md" fw={200} className={classes.name}>
            {isFacebookLink ? ('Đã kết nối') : ('Chưa kết nối')}
          </Text>
          <Divider />
        </div>
        <div>
          <Text pt={30} fz="md" fw={700} className={classes.name}>
            Google
          </Text>
          <Text pt={20} pb={20} c="grey" fz="md" fw={200} className={classes.name}>
            {isGoogleLink ? ('Đã kết nối') : ('Chưa kết nối')}
          </Text>
          <Divider />
        </div>
      </Paper>
    </Flex>
  );
}

export default ProFilePage;

import { COOKIE_KEY } from "@/constants";
import { useAppDispatch, useAuth } from "@/hooks";
import { authApi } from "@/services";
import { setUserInfo } from "@/store";
import { cookies } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, Text, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Form, useForm } from "react-hook-form";
import { PasswordInput, TextInput } from "react-hook-form-mantine";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiMaildotru } from "react-icons/si";
import * as yup from 'yup';

interface IInitPasswordFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Bạn chưa nhập email'),
  password: yup
    .string()
    .required('Bạn chưa nhập mật khẩu')
    .min(8, 'Mật khẩu phải có tối thiểu 8 ký tự'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận lại mật khẩu')
    .oneOf([yup.ref('password'), ''], 'Không trùng với mật khẩu đã nhập'),
});

const ModalInitPassword = ({ email }: { email: string }) => {
  const [opened, { close, open }] = useDisclosure(true);
  const dispatch = useAppDispatch();

  const { control } = useForm<IInitPasswordFormData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      email: email,
      password: '',
      confirmPassword: '',
    },
  });

  const handleInitPassword = async (data: IInitPasswordFormData) => {
    try {
      const res = await authApi.initPassword(data.email, data.password);
      if (res.status && res.data) {
        const userInfo = res.data;
        cookies.set(COOKIE_KEY.USER_INFO, JSON.stringify(userInfo));
        dispatch(setUserInfo(userInfo));
        notifications.show({
          title: 'Thành công',
          message: 'Đổi mật khẩu thành công',
          color: 'teal',
        });
        close();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal.Root
      opened={opened}
      onClose={close}
      size='md'
      closeOnClickOutside={false}
      closeOnEscape={false}>
      <Modal.Overlay blur={7} />
      <Modal.Content radius='lg'>
        <Modal.Header>
          <Text>
            Tài khoản của bạn chưa thiết đặt mật khẩu hoặc đang sử dụng mật khẩu mặc định.
            Vui lòng đặt lại mật khẩu để đảm bảo an toàn cho tài khoản.
          </Text>
        </Modal.Header>
        <Modal.Body>

          <Form control={control} onSubmit={e => handleInitPassword(e.data)} onError={e => console.log(e)}>
            <TextInput
              label="Email"
              name="email"
              required
              readOnly
              size="md"
              control={control}
              leftSection={<SiMaildotru size={16} />}
            />
            <PasswordInput
              name="password"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              required
              mt="md"
              size="md"
              control={control}
              autoFocus
              leftSection={<RiLockPasswordLine size={18} />}
            />
            <PasswordInput
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu một lần nữa"
              required
              mt="md"
              size="md"
              control={control}
              leftSection={<RiLockPasswordLine size={18} />}
            />

            <Flex justify='flex-end' gap={10}>
              <Button mt="xl" size="md" type="submit">
                Đổi mật khẩu
              </Button>
              <Button color="gray.5" mt="xl" size="md" onClick={close}>
                Để sau
              </Button>
            </Flex>

          </Form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root >
  );
}

export default ModalInitPassword;
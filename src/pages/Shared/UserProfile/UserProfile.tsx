import {
  Paper, Text, Group, Avatar, Input, Divider,
  Button, Flex, Modal, Center, Stack,
  TextInput as MantineTextInput
} from '@mantine/core';
import { PasswordInput, TextInput, DateInput, Select } from 'react-hook-form-mantine';
import { useDisclosure } from '@mantine/hooks';
import { cookies } from '@/utils';

import { useForm, Form } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useState, useEffect, useMemo } from 'react';
import { authApi } from '@/services/auth.service';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAuth } from '@/hooks';
import { firebaseStorage } from '@/config';
import { FirebaseAuthProvider } from '@/config';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IChangeProfileRequest, IUserInfo } from '@/types';
import { FaCalendarDay } from 'react-icons/fa';
import { BsCake } from "react-icons/bs";
import { PiGenderIntersex } from "react-icons/pi";
import { MdOutlineMail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { v4 } from 'uuid';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { setUserInfo } from '@/store';
import { COOKIE_KEY } from '@/constants';

type ImageUploadType = File | null;


interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const changePasswordSchema = yup.object().shape({
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

const changeProfileSchema = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
  // gender: yup.string(), 
  birthday: yup.date(),
  address: yup.string(),
  phone: yup.string(),
  // avatar: yup.string(),
});


const UserProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const editMode = searchParams.get('editMode') === 'true';
  const [isUpdate, setIsUpdate] = useState<boolean>(editMode);
  const [opened, { open, close }] = useDisclosure(false);

  //Xử lý đẩy ảnh lên firebase
  const [imageUpload, setImageUpload] = useState<ImageUploadType>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(imageUpload ? URL.createObjectURL(imageUpload) : null);
  }, [imageUpload]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userInfo, linkAccount } = useAuth();

  const [googleAccoutId, setgoogleAccoutId] = useState<string>('')
  const [fbAccoutId, setfbAccoutId] = useState('')
  const [micAccoutId, setmicAccoutId] = useState('')

  const [isGoogleLink, setisGoogleLink] = useState(false)
  const [isFacebookLink, setisFacebookLink] = useState(false)
  const [isMicrosoftLink, setisMicrosoftLink] = useState(false)

  const { control: changePasswordControl } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const { control: changeProfileControl, setValue, reset, watch, handleSubmit } = useForm<IChangeProfileRequest>({
    resolver: yupResolver(changeProfileSchema),
    defaultValues: useMemo(() => {
      return {
        firstName: userInfo?.firstName ?? '',
        lastName: userInfo?.lastName ?? '',
        phone: userInfo?.phone ?? '',
        address: userInfo?.address ?? '',
      }
    }, [userInfo]),
  });

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      if (!userInfo) return;
      const res = await authApi.changePassword({
        userId: userInfo.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        isReset: false,
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

  const handleCancelChange = () => {
    setIsUpdate(false);
    setSearchParams({ editMode: 'false' });
    reset();
    // resetForm();
  }

  const handleUpdate = () => {
    setIsUpdate(true);
    setSearchParams({ editMode: 'true' });
  }

  const uploadFile = async () => {
    if (imageUpload == null) return '';
    const imageRef = ref(firebaseStorage, `avatar/${userInfo?.id}/${imageUpload.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload)

    const url = await getDownloadURL(snapshot.ref);
    // setValue('logo', url);
    return url;
  };

  const onSubmit = async (data: IChangeProfileRequest) => {
    // console.log('data', data)
    const avatarUrl = await uploadFile();
    const updateInfo: IChangeProfileRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phone: data.phone,
    }
    if (data.gender) {
      updateInfo.gender = Number(data.gender);
    }
    if (data.birthday) {
      updateInfo.birthday = data.birthday;
    }
    if (imageUrl !== null) {
      updateInfo.avatar = avatarUrl;
    }
    if (userInfo?.id) {
      const res = await authApi.changeProfile(userInfo?.id, updateInfo)

      if (res.status) {
        notifications.show({
          title: 'Thông báo',
          message: 'Cập nhật thông tin cá nhân thành công',
          color: 'green',
        });
      }
      if (res.data) {
        cookies.set(COOKIE_KEY.USER_INFO, res?.data);
        dispatch(setUserInfo(res?.data));
      }
    }
    setIsUpdate(false);
    setSearchParams({ editMode: 'false' });
    navigate(0)
  }

  const resetForm = () => {
    setValue('firstName', userInfo?.firstName || '');
    setValue('lastName', userInfo?.lastName || '');
    setValue('gender', userInfo?.gender);
    setValue('birthday', userInfo?.birthday ? dayjs(userInfo?.birthday, 'DD/MM/YYYY').toDate() : undefined);
    setValue('address', userInfo?.address || '');
    setValue('phone', userInfo?.phone || '');
    setValue('avatar', userInfo?.avatar || '');
    setImageUpload(null)
  }

  useEffect(() => {
    resetForm();
  }, [userInfo]);



  return (
    <Flex my={30} gap={20} direction={{ base: 'column', md: 'row' }} className='max-w-screen-xl mx-auto'>
      <Paper w='100%' withBorder shadow="md" p={30} radius="md">
        {isUpdate ? (
          <div>
            <Form control={changeProfileControl} onSubmit={e => onSubmit(e.data)} onError={e => console.log(e)}>
              <Group>
                <>
                  <label htmlFor="upload-image" className="relative group">
                    <Avatar
                      size={150}
                      // radius={150}
                      mr={10}
                      alt="no image here"
                      color={'primary'}
                      className="cursor-pointer group-hover:opacity-90 rounded-md"
                      src={imageUrl || userInfo?.avatar}
                    />
                    <div className="absolute opacity-90 cursor-pointer top-[50%] left-[8%] text-white bg-gray-500 px-2 py-1.5 rounded-md mx-auto hidden group-hover:block">
                      Chỉnh sửa avatar
                    </div>
                  </label>
                  <input
                    type="file"
                    id="upload-image"
                    className="hidden"
                    onChange={(e) => setImageUpload(e.target.files?.[0] || null)}
                  />
                </>
                {/* <Avatar
                  src={userInfo?.avatar}
                  size={150}
                  radius={150}
                  mr={10}
                  alt="no image here"
                  color={'primary'}
                /> */}
                <Stack>
                  <TextInput
                    label={<Text fw={700}>Họ</Text>}
                    name='firstName'
                    control={changeProfileControl}
                  />
                  <TextInput
                    label={<Text fw={700}>Tên</Text>}
                    name='lastName'
                    control={changeProfileControl}
                  />
                </Stack>
              </Group>

              <div style={{ margin: '1rem 0' }}>
                <Text fz="lg" fw={700}>
                  Thông tin cá nhân
                </Text>
                <Divider />
              </div>
              <Stack gap="sm" h={298}>
                <Group justify="space-between" grow>
                  <DateInput
                    label={<Text fw={700}>Ngày sinh</Text>}
                    name="birthday"
                    valueFormat="DD/MM/YYYY"
                    defaultDate={
                      userInfo?.birthday === null ?
                        dayjs(userInfo?.birthday, 'DD/MM/YYYY').toDate()
                        : undefined
                    }
                    control={changeProfileControl}
                    rightSection={<FaCalendarDay size={18} />}
                  />
                  <Select
                    label={<Text fw={700}>Giới tính</Text>}
                    name='gender'
                    control={changeProfileControl}
                    defaultValue={userInfo?.gender?.toLocaleString()}
                    data={[
                      { label: 'Nam', value: '1' },
                      { label: 'Nữ', value: '0' },
                    ]}
                  />
                </Group>
                <MantineTextInput
                  label={<Text fw={700}>Email</Text>}
                  name='email'
                  value={userInfo?.email}
                  readOnly
                />
                <TextInput
                  label={<Text fw={700}>Số điện thoại</Text>}
                  name='phone'
                  control={changeProfileControl}
                />
                <TextInput
                  label={<Text fw={700}>Địa chỉ</Text>}
                  name='address'
                  control={changeProfileControl}
                />
              </Stack>
              <Stack mt="auto" align="flex-end">
                <Group>
                  <Button type="submit">Lưu thay đổi</Button>
                  <Button variant="outline" onClick={handleCancelChange} color='gray.6'>Hủy thay đổi</Button>
                </Group>
              </Stack>
            </Form>
          </div>
        ) : (
          <div>
            <Center>
              <Stack align='center'>
                <Avatar
                  src={userInfo?.avatar}
                  size={150}
                  radius={150}
                  alt="no image here"
                  color={'primary'}
                />
                <Text fz="lg" fw={700}>
                  {userInfo?.firstName} {userInfo?.lastName}
                </Text>
              </Stack>
            </Center>

            <div style={{ margin: '1rem 0' }}>
              <Text fz="lg" fw={700}>
                Thông tin cá nhân
              </Text>
              <Divider />
            </div>
            <Stack gap="md" h={254}>
              <Group justify="space-between" grow>
                <Group>
                  <BsCake size={25} />
                  <Text fw={700}>Ngày sinh: </Text>
                  {dayjs(userInfo?.birthday).format('DD/MM/YYYY')}
                </Group>
                <Group>
                  <PiGenderIntersex size={25} />
                  <Text fw={700}>Giới tính: </Text>
                  {userInfo?.gender === 0 ? 'Nữ' : (userInfo?.gender === 1 ? 'Nam' : 'Không xác thực')}
                </Group>
              </Group>
              <Group>
                <MdOutlineMail size={25} />
                <Text fw={700}> Email: </Text>
                {userInfo?.email}
              </Group>
              <Group>
                <FiPhone size={25} />
                <Text fw={700}> Số điện thoại: </Text>
                {userInfo?.phone}
              </Group>
              <Group>
                <GrLocation size={25} />
                <Text fw={700}> Địa chỉ: </Text>
                {userInfo?.address}
              </Group>
            </Stack>
            <Stack mt="auto" align="flex-end">
              <Button onClick={handleUpdate}>Chỉnh sửa</Button>

            </Stack>

          </div>
        )}


        <Modal.Root opened={opened} onClose={close} centered>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header>
              <Modal.Title fz="lg" fw={600}>Đổi mật khẩu</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>
            <Modal.Body><Form
              control={changePasswordControl} onSubmit={e => handleChangePassword(e.data)} onError={e => console.log(e)}>
              <PasswordInput
                name="currentPassword"
                label="Mật khẩu hiện tại"
                placeholder="Nhập mật khẩu hiện tại của bạn"
                required
                mt="md"
                size="md"
                control={changePasswordControl}
                leftSection={<RiLockPasswordLine size={18} />}
              />
              <PasswordInput
                name="newPassword"
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới của bạn"
                required
                mt="md"
                size="md"
                control={changePasswordControl}
                leftSection={<RiLockPasswordLine size={18} />}
              />
              <PasswordInput
                name="confirmNewPassword"
                label="Xác nhận lại mật khẩu"
                placeholder="Xác nhận lại mật khẩu bạn vừa nhập"
                required
                mt="md"
                size="md"
                control={changePasswordControl}
                leftSection={<RiLockPasswordLine size={18} />}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', }}>
                <Button mt="xl" size="md" type="submit">
                  Xác nhận
                </Button>
                <Button mt="xl" ml="sm" size="md" variant='outline' color='red.5'
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
      </Paper>

      <Paper w='100%' withBorder shadow="md" p={30} radius="md">
        <Text fz="xl" fw={700}>
          Quản lý tài khoản đăng nhập
        </Text>
        <div className='flex justify-between items-center w-full'>
          <Text pt={30} fz="md" fw={700}>
            Mật khẩu
          </Text>

          <Button mt={30} variant='subtle' onClick={open}>
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

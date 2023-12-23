import { yupResolver } from '@hookform/resolvers/yup';
import { Anchor, Button, Container, Flex, Grid, Image, Paper, Text, Title, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Form, useForm } from 'react-hook-form';
import { TextInput } from 'react-hook-form-mantine';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch, useAuth } from '@/hooks';
import { clinicApi } from '@/services';
import { setClinicId, setUserInfo } from '@/store';
import { IAddClinicRequest, IServicePlan } from '@/types';

interface IAddClinicFormData {
  clinicName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
}

const schema = yup.object().shape({
  clinicName: yup.string().required('Bạn chưa nhập tên phòng khám'),
  email: yup.string().required('Thông tin email là bắt buộc').email('Email không hợp lệ'),
  phone: yup.string().required('Thông tin số điện thoại là bắt buộc'),
  address: yup.string().required('Thông tin địa chỉ phòng khám là bắt buộc'),
  description: yup.string().required('Thông tin mô tả là bắt buộc'),
});

interface AddClinicModalProps {
  plan: IServicePlan;
}

const AddClinicModal: React.FC<AddClinicModalProps> = ({ plan }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loginByOAuth } = useAuth();

  console.log('plan adding: ', plan)
  // tích hợp react-hook-form với mantine form
  const { control } = useForm<IAddClinicFormData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      // giá trị mặc định của các field
      clinicName: '',
      email: '',
      phone: '',
      address: '',
      description: '',
    },
  });

  const handleAddClinic = (data: IAddClinicFormData) => {
    const addClinicData = {
      name: data.clinicName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      logo: '1',
      description: data.description,
      planId: plan.id.toString()
    };
    console.log('data request: ', addClinicData);
    clinicApi
      .createClinic(addClinicData)
      .then(res => {
        if (res.status) {
          // lưu thông tin clinicId vào redux
          // dispatch(setClinicId(res.data?.clinic.id));
          // Hiển thị thông báo
          notifications.show({
            message: 'Đăng ký tạo phòng khám thành công',
            color: 'green',
          });
        }

        else {
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
  }


  return (
    <Box w='440px' h='615px' py={30}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title mx='20%' mb='15px' order={4}>Khởi tạo phòng khám</Title>
        <Form
          control={control}
          onSubmit={e => handleAddClinic(e.data)}
          onError={e => console.log(e)}>
          <TextInput
            label="Tên phòng khám"
            name="clinicName"
            placeholder="Phòng khám An Bình"
            required
            size="md"
            radius="sm"
            control={control}
          />

          <Grid>
            <Grid.Col>
              <TextInput
                label="Email liên hệ"
                name="email"
                placeholder="example@gmail.com"
                required
                mt="md"
                size="md"
                radius="sm"
                control={control}

              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                label="Số điện thoại liên hệ"
                name="phone"
                required
                mt="md"
                size="md"
                radius="sm"
                control={control}

              />
            </Grid.Col>
          </Grid>

          <TextInput
            label="Địa chỉ phòng khám"
            name="address"
            required
            mt="md"
            size="md"
            radius="sm"
            control={control}
          />
          <TextInput
            label="Thêm thông tin mô tả"
            name="description"
            required
            mt="md"
            size="md"
            radius="sm"
            control={control}
          />
          {/* <TextInput disabled
                label="Gói dịch vụ"
                name="planName"
                placeholder={plan.planName}
                required
                mt="md"
                size="md"
                radius="sm"                              
            /> */}
          <Button fullWidth mt="xl" radius="sm" size="md" type="submit">
            Đăng ký
          </Button>

        </Form>
      </Paper>
    </Box>
  );
};

export default AddClinicModal;

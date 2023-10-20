import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Form, Input } from 'antd';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { authApi } from '@/services/auth.service';
import { cookies } from '@/utils';

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
  // tích hợp react-hook-form với antd form
  const { control, handleSubmit } = useForm<ILoginFormData>({
    resolver: yupResolver(schema), // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {
      // giá trị mặc định của các field
      email: '',
      password: '',
      isRemember: false,
    },
  });

  const handleLogin = async (data: ILoginFormData) => {
    // gọi api đăng nhập
    // nếu thành công, lưu access token vào cookie và thông tin user vào redux -> chuyển hướng về trang chủ
    // nếu thất bại, hiển thị thông báo lỗi
    await authApi
      .login({ email: data.email, password: data.password })
      .then(res => {
        if (res.success && !res.errors) {
          const userInfo = res.data?.user;
          const token = res.data?.token;

          // lưu vào cookie
          cookies.set('token', token);
          cookies.set('userInfo', userInfo);

          // lưu thông tin user vào redux
          // dispatch(setUserInfo(userInfo));
        } else {
          console.log('Loi dang nhap:', res.message);
        }
      })
      .catch(err => {
        console.log('Loi dang nhap:', err);
      });
  };

  return (
    <div id="login-page">
      <Form
        name="login-form"
        autoComplete="off"
        size="large"
        onFinish={handleSubmit(data => handleLogin(data))}
        style={{
          padding: '20px 30px',
          maxWidth: '450px',
          width: '100%',
          border: 'groove',
          borderRadius: '15px',
          margin: 'auto',
          backgroundColor: 'white',
        }}>
        <div style={{ marginBottom: '16px' }}>
          <h1>Đăng nhập</h1>
          <span>
            hoặc <Link to={'#'}>Tạo tài khoản mới</Link>
          </span>
        </div>

        <FormItem control={control} name="email">
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Nhập email "
          />
        </FormItem>

        <FormItem control={control} name="password">
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Mật khẩu"
          />
        </FormItem>

        <FormItem control={control} name="isRemember" valuePropName="checked">
          <Checkbox>Ghi nhớ thông tin đăng nhập</Checkbox>
        </FormItem>

        <Form.Item>
          <Button type="primary" block htmlType="submit">
            Đăng nhập
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="button"
            icon={<FcGoogle />}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            Đăng nhập với Google
          </Button>
        </Form.Item>

        <Link style={{ textAlign: 'center', display: 'block' }} to={'#'}>
          Quên mật khẩu
        </Link>
      </Form>
    </div>
  );
};

export default LoginPage;

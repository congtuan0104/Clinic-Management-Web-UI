import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Form, Input } from 'antd';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import * as yup from 'yup';


interface ILoginFormData {
  username: string;
  password: string;
  isRemember?: boolean;
}

// định nghĩa điều kiện xác định input hợp lệ
const schema = yup.object().shape({
  username: yup.string().required('Bạn chưa nhập email').email('Email không hợp lệ'),
  password: yup.string().required('Bạn chưa nhập mật khẩu').min(8,'Mật khẩu phải có tối thiểu 8 ký tự'),
  isRemember: yup.boolean(),
});

const LoginPage = () => {
  // tích hợp react-hook-form với antd form
  const { control, handleSubmit } = useForm<ILoginFormData>({
    resolver: yupResolver(schema),  // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {  // giá trị mặc định của các field
      username:'',
      password:'',
      isRemember:false
    }
  });

  const handleLogin = (data: ILoginFormData) => {
    console.log(data);
    // gọi api đăng nhập
    // nếu thành công, lưu access token vào cookie và thông tin user vào redux -> chuyển hướng về trang chủ
    // nếu thất bại, hiển thị thông báo lỗi
  }
  

  return (
    <div id='login-page'>
      <Form
        name="login-form"
        autoComplete="off"
        size='large'
        onFinish={handleSubmit((data) => handleLogin(data))}
        style={{
          padding: '20px 30px',
          maxWidth: '450px',
          width: '100%',
          border: 'groove',
          borderRadius: '15px',
          margin: 'auto',
          backgroundColor: 'white',
        }}
      >
       
        <div style={{marginBottom: '16px'}}>
          <h1>Đăng nhập</h1>
          <span>hoặc <Link to={'#'}>Tạo tài khoản mới</Link></span>    
        </div>
    
        <FormItem control={control} name="username">
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder='Nhập email của bạn'/>
        </FormItem>

        <FormItem control={control} name="password">
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Mật khẩu' />
        </FormItem>
         
        <FormItem
          control={control}
          name="isRemember"
          valuePropName="checked"
        >
          <Checkbox >Ghi nhớ thông tin đăng nhập</Checkbox>
        </FormItem>
    
        <Form.Item>
          <Button type="primary" block htmlType="submit">
            Đăng nhập
          </Button>
        </Form.Item>
    
        <Form.Item>
          <Button htmlType="button" icon={<FcGoogle/>} style={{display:'flex', justifyContent:'center', alignItems: 'center', width: '100%'}}>
           Đăng nhập với Google
          </Button>
        </Form.Item>

        <Link style={{textAlign:'center', display:'block'}} to={'#'}>Quên mật khẩu</Link>
      </Form>
    </div>
    
  );
};


export default LoginPage;

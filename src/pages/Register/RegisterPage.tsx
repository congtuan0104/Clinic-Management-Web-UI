import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Form, Input } from 'antd';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import * as yup from 'yup';


interface IRegisterFormData {
  fullname: string;
  username: string;
  password: string;
  confirmPassword: string;
  isRemember?: boolean;
}


const schema = yup.object().shape({
  fullname: yup.string().required('Bạn chưa nhập họ và tên'),
  username: yup.string().required('Bạn chưa nhập email').email('Email không hợp lệ'),
  password: yup.string().required('Bạn chưa nhập mật khẩu').min(8,'Mật khẩu phải có tối thiểu 8 ký tự'),
  confirmPassword: yup.string().required('Vui lòng xác nhận lại mật khẩu').oneOf([yup.ref('password'), ''], 'Không trùng với mật khẩu đã nhập'),
  isRemember: yup.boolean(),
});

const RegisterPage = () => {
  // tích hợp react-hook-form với antd form
  const { control, handleSubmit } = useForm<IRegisterFormData>({
    resolver: yupResolver(schema),  // gắn điều kiện xác định input hợp lệ vào form
    defaultValues: {  // giá trị mặc định của các field
      fullname:'',
      username:'',
      password:'',
      confirmPassword:'',
      isRemember:false
    }
  });
  const handleRegister = (data: IRegisterFormData) => {
    console.log(data);
    //TO DO
  }
  


  return (
    <div id='login-page'>
      <Form
        name="login-form"
        autoComplete="off"
        size='large'
        onFinish={handleSubmit((data) => handleRegister(data))}
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
          <h1>Đăng ký</h1>   
        </div>

        <Form.Item>
          <Button htmlType="button" icon={<FcGoogle/>} style={{display:'flex', justifyContent:'center', alignItems: 'center', width: '100%'}}>
           Đăng nhập với Google
          </Button>
        </Form.Item>

        <div style={{margin: '-10px 0 10px 0'}}>
          <span style={{display:'flex', justifyContent: 'center', color: '#808080', filter: 'grayscale(100%)'}}>hoặc</span>    
        </div>

        <FormItem control={control} name="fullname">
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder='Nhập họ và tên'/>
        </FormItem>
    
        <FormItem control={control} name="username">
          <Input prefix={<MailOutlined className="site-form-item-icon"/>} placeholder='Nhập email '/>
        </FormItem>

        <FormItem control={control} name="password">
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Mật khẩu' />
        </FormItem>

        <FormItem control={control} name="confirmPassword">
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Xác nhận lại mật khẩu' />
        </FormItem>
    
        <Form.Item>
          <Button type="primary" block htmlType="submit">
            Đăng ký
          </Button>
        </Form.Item>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <span>Đã có tài khoản?&nbsp;<Link to={'#'}>Đăng nhập</Link></span>    
        </div>
      </Form>
    </div>
    
  );
};


export default RegisterPage;

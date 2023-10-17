import React from 'react';
import { useForm, Controller, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { Button, Checkbox, Form, Input, List, Space } from 'antd';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  isRemember?: boolean;
}


const schema = yup.object().shape({
  fullName: yup.string().required('Plese input your full name'),
  email: yup.string().email('Invalid email').required('Please input a valid email address'),
  password: yup.string().min(8).required('Please input your password!'),
  confirmPassword: yup.string().required('Plese confirm password'),
  isRemember: yup.boolean(),
});

const RegisterPage = () => {
  const { control, handleSubmit, getValues } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName:'',
      email:'',
      password:'',
      confirmPassword:'',
      isRemember:false
    }
  });
  const validateAndRegister = async () => {
    const isValid = await schema.isValid(getValues());

    if (isValid) {
      const {fullName, email, password, confirmPassword, isRemember } = getValues();
      const isconfirmPasswordSuccess = password === confirmPassword;
      if(isconfirmPasswordSuccess){
        console.log('Ho va ten:', fullName, 'Email:', email, 'Password:', password, 'Remember', isRemember);
      } else {
          console.log('Xác nhận mật khẩu thất bại')
      }
    } else {
        console.log('Form validation failed');
      }
  };

  const handleRegisterClick = () => {
    validateAndRegister();
  };
  


  return (
    <div style={{
      display: 'flex',
      height: '550px',
      width: '650px',
      border: 'groove',
      borderRadius: '15px',
      alignItems: 'left',
      justifyContent: 'left',
      margin: 'auto',
    }}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 650 }}
        initialValues={{ isRemember: false }}
        autoComplete="off"
      >
        <div style={{
          padding: '20px',
          textAlign: 'center',
          marginLeft:'-110px'
        }}>
          <h1>Đăng ký</h1>
        </div>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }} >
          <Button htmlType="button" style={{width: '265%', marginLeft: '-60px'}}>
            Đăng nhập với Google
          </Button>
        </Form.Item>

        <span style={{display: 'flex', justifyContent: 'center', width: '200%', height: '8%', color: '#808080'}}>hoặc</span>

        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true }]}
          style={{ marginLeft: '30px' }}
        >
          <Controller
            render={({ field }) => <Input {...field} placeholder='Nhập họ và tên của bạn' style={{ width: '250%' }} />}
            control={control}
            name="fullName"
          />
        </Form.Item>
    
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true }]}
          style={{ marginLeft: '-10px' }}
        >
          <Controller
            render={({ field }) => <Input {...field} placeholder='Nhập email của bạn' style={{ width: '220%', marginLeft: '25px' }} />}
            control={control}
            name="email"
          />
        </Form.Item>
    
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          style={{ marginLeft: '30px' }}
        >
          <Controller
            render={({ field }) => <Input.Password {...field} placeholder='Nhập mật khẩu' style={{ width: '250%' }} />}
            control={control}
            name="password"
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận"
          name="confirmPassword"
          rules={[{ required: true, message: 'Vui lòng xác nhận lại mật khẩu!' }]}
          style={{ marginLeft: '30px' }}
        >
          <Controller
            render={({ field }) => <Input.Password {...field} placeholder='Nhập lại mật khẩu' style={{ width: '250%' }} />}
            control={control}
            name="password"
          />
        </Form.Item>
    
    
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="button" style={{width: '265%', marginLeft: '-60px'}} onClick={handleRegisterClick}>
            Đăng ký
          </Button>
        </Form.Item>
    
        
    
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', width: '200%' }}>
          <span>Đã có tài khoản?&nbsp;</span>
          <span style={{ color: 'blue' }}>Đăng nhập</span>
        </div>


      </Form>
    </div>
    
  );
};


export default RegisterPage;

import React from 'react';
import { useForm, Controller, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { Button, Checkbox, Form, Input, List, Space } from 'antd';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FcGoogle } from 'react-icons/fc';


interface FormData {
  email: string;
  password: string;
  isRemember?: boolean;
}


const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Please input a valid email address'),
  password: yup.string().min(8).required('Please input your password!'),
  isRemember: yup.boolean(),
});

const LoginPage = () => {
  const { control, handleSubmit, getValues } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email:'',
      password:'',
      isRemember:false
    }
  });
  const validateAndLogin = async () => {
    const isValid = await schema.isValid(getValues());

    if (isValid) {
      const { email, password, isRemember } = getValues();
      console.log('Email:', email, 'Password:', password, 'Remember', isRemember);
    } else {
      console.log('Form validation failed');
    }
  };

  const handleLoginClick = () => {
    validateAndLogin();
  };
  


  return (
    <div style={{
      display: 'flex',
      height: '480px',
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
        style={{ maxWidth: 600 }}
        initialValues={{ isRemember: false }}
        autoComplete="off"
      >
        <div style={{
          padding: '20px',
          textAlign: 'center',
          marginLeft:'-80px'
        }}>
          <h1>Đăng nhập</h1>
          <div style={{padding: '10px'}}>
            <span>hoặc </span>
            <span style={{ color: 'blue' }}>Tạo mới tài khoản</span>
          </div>
        </div>
    
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
          name="isRemember"
          valuePropName="checked"
          wrapperCol={{ offset: 3, span: 20 }}
        >
          <Controller
            render={({ field }) => <Checkbox {...field}>Ghi nhớ thông tin đăng nhập</Checkbox>}
            control={control}
            name="isRemember"
          />
        </Form.Item>
    
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="button" style={{width: '265%', marginLeft: '-60px'}} onClick={handleLoginClick}>
            Đăng nhập
          </Button>
        </Form.Item>
    
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="default"
            htmlType="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center', 
              width: '265%',
              marginLeft: '-60px',
            }}
            icon={<FcGoogle size={20} />}
          >
            <span style={{ marginLeft: '8px' }}>Đăng nhập với Google</span>
          </Button>
        </Form.Item>
    
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', width: '200%' }}>
          <span style={{ color: 'blue' }}>Quên mật khẩu</span>
        </div>


      </Form>
    </div>
    
  );
};


export default LoginPage;

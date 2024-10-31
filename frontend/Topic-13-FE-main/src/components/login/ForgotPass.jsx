import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Button } from '../index';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { checkExistEmail } from '../../apis/UserServices';
import icons from '../../utils/icon';

export const ForgotPass = () => {
  const [form] = Form.useForm();
  const [payload, setPayload] = useState({});
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const { setEmail } = useUserStore();
  const { FaSignInAlt } = icons;
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý sau khi form được submit
  const onFinish = values => {
    setPayload(values);
    handleCheckEmail(values);
  };

  const handleCheckEmail = async dataSent => {
    setIsLoading(true);
    const response = await checkExistEmail(dataSent);
    setIsLoading(false);
    if (response?.statusCode === 200) {
      setEmail(dataSent.email);
      navigate('/public/send-recovery-otp');
    } else setIsValid(true);
  };

  return (
    <div className="w-full h-min-heigh-custom flex items-center justify-center">
      <div
        className="w-1/3 shadow-2xl p-6 gap-8 border
                flex flex-col items-center justify-center rounded-lg"
      >
        <h1 className="text-3xl font-semibold text-orange-600 font-Merriweather text-center">
          Welcome To Booking Mentor System
        </h1>
        <div className="flex justify-start items-center w-full gap-5 border-b text-lg font-bold">
          <span className="text-gray-600 border-b-4 border-orange-600">Find your account</span>
        </div>
        <div className="w-full">
          <Form name="normal_login" initialValues={{ remember: true }} form={form} onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!'
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email !'
                }
              ]}
            >
              <div>
                <Input
                  prefix={<MailOutlined className="mr-2" />}
                  placeholder="email"
                  className="text-xl"
                  onChange={() => {
                    setIsValid(false);
                  }}
                />
                {isValid && <p className="text-red-500">Email not valid !!!</p>}
              </div>
            </Form.Item>

            <Form.Item className="flex items-center justify-center w-full">
              <Button
                textColor="text-white"
                bgColor="bg-main-1"
                bgHover="hover:bg-main-2"
                text={'Next'}
                isLoading={isLoading}
                htmlType="submit"
                IcBefore={FaSignInAlt}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;

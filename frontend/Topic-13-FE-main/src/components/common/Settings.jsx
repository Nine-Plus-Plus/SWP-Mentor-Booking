import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { Button } from '../index';
import { toast } from 'react-toastify';
import { useUserStore } from '../../store/useUserStore';
import { EyeInvisibleFilled, EyeTwoTone } from '@ant-design/icons';
import { settingChangePassword, StudentLogin } from '../../apis/UserServices';

export const Settings = () => {
  const { userData } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const [payload, setPayload] = useState({
    email: userData?.user?.email,
    password: '',
    newPassword: ''
  });

  const handleChangePass = async values => {
    setIsLoading(true);
    const data = {
      email: userData?.user?.email,
      password: payload.password,
      newPassword: values.newPassword
    };
    try {
      const response = await settingChangePassword(data);
      console.log('data change pass: ', data);
      setIsLoading(false);
      if (response?.statusCode === 200) {
        toast.success('Password changed successfully!');
      } else {
        toast.error(response.message);
      }
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 p-3">Settings</h1>
      <div className="bg-gray-100 p-2 flex justify-center items-center flex-col">
        <div className="bg-white p-8 rounded-md shadow-md mt-2 w-1/2  flex justify-center items-center flex-col">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Change Password</h2>
          <div className="mb-4 w-4/5">
            <Form form={form} layout="vertical" onFinish={handleChangePass} className="flex flex-col gap-3">
              <Form.Item
                label="Old Password"
                name="password"
                rules={[{ required: true, message: 'Please input your old password!' }]}
              >
                <Input.Password
                  placeholder="Old Password"
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleFilled />)}
                  onChange={e => setPayload({ ...payload, password: e.target.value })}
                />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[{ required: true, message: 'Please input your new password!' }]}
              >
                <Input.Password
                  placeholder="New Password"
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleFilled />)}
                />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="confirmNewPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    }
                  })
                ]}
              >
                <Input.Password
                  placeholder="Confirm New Password"
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleFilled />)}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  textColor="text-white"
                  bgColor="bg-main-1"
                  bgHover="hover:bg-main-2"
                  text="Change Password"
                  htmlType="submit"
                  isLoading={isLoading}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;

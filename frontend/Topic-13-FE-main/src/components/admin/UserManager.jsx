import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUser, createUser } from '../../apis/UserServices';
import { Table, Button, message, Form, Modal, Input } from 'antd';
import { useLocation } from 'react-router-dom';

function MentorManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getAllUsers(token);
        setUsers(response.data.usersDTOList);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete User
  const handleDelete = async userId => {
    const token = localStorage.getItem('token');
    try {
      const response = await deleteUser(userId, token);
      if (response && response.statusCode === 200) {
        message.success('User deleted successfully');
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId)); // Cập nhật danh sách người dùng
      } else {
        message.error('Failed to delete user: ' + response.data.message);
      }
    } catch (error) {
      console.error('Delete user error:', error);
      message.error('Failed to delete user: ' + error.message);
    }
  };

  // Update User
  const showUpdateModal = user => {
    setSelectedUser(user);
    form.setFieldsValue({
      birthDate: user.birthDate,
      address: user.address,
      phone: user.phone,
      gender: user.gender,
      avatar: user.avatar
    });
    setIsUpdateModalVisible(true);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const updateData = form.getFieldsValue();
      const response = await updateUser(selectedUser.id, updateData, token);
      console.log(response);
      
      if (response && response.statusCode === 200) {
        // Cập nhật lại danh sách người dùng với thông tin mới
        setUsers(users.map(user => (user.id === response.usersDTO.id ? response.usersDTO : user)));
        setIsUpdateModalVisible(false);
        message.success('User updated successfully');
      } else {
        message.error('Failed to update user');
      }
    } catch (error) {
      console.error('Update user error:', error);
      message.error('Failed to update user: ' + error.message);
    }
  };

  const handleCancelUpdate = () => {
    setIsUpdateModalVisible(false);
  };

  // Create User
  const showCreateModal = () => {
    setSelectedUser(null); // Không chọn user nào vì đang tạo mới
    form.resetFields(); // Xóa các giá trị trong form
    setIsCreateModalVisible(true); // Hiển thị modal tạo người dùng
  };

  const handleCreateUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const createData = form.getFieldsValue();
      const response = await createUser(createData, token);

      if (response && response.statusCode === 200) {
        setUsers([...users, response.usersDTO]);
        setIsCreateModalVisible(false);
        message.success('User created successfully');
      } else {
        message.error('Failed to create user');
      }
    } catch (error) {
      console.error('Create user error:', error);
      message.error('Failed to create user: ' + error.message);
    }
  };

  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
  };

  if (loading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Avarta',
      dataIndex: 'avatar',
      key: 'avatar'
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      key: 'birthDate'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button type="primary" onClick={() => showUpdateModal(record)} style={{ marginRight: '10px' }}>
            Update
          </Button>
          <Button type="danger" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Student List</h1>
      <Button type="primary" onClick={showCreateModal} style={{ marginBottom: '10px' }}>
        Create Student
      </Button>
      <Table columns={columns} dataSource={users} rowKey="id" pagination={false} />

      {/* Modal for updating user */}
      <Modal title="Update User" open={isUpdateModalVisible} onOk={handleUpdate} onCancel={handleCancelUpdate}>
        <Form form={form} layout="vertical">
          <Form.Item label="Birth Date" name="birthDate">
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Gender" name="gender">
            <Input />
          </Form.Item>
          <Form.Item label="Avatar" name="avatar">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for creating user */}
      <Modal title="Create User" open={isCreateModalVisible} onOk={handleCreateUser} onCancel={handleCancelCreate}>
        <Form form={form} layout="vertical">
          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Role" name="roleString">
            <Input />
          </Form.Item>
          <Form.Item label="Birth Date" name="birthDate">
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Gender" name="gender">
            <Input />
          </Form.Item>
          <Form.Item label="Avatar" name="avatar">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MentorManager;

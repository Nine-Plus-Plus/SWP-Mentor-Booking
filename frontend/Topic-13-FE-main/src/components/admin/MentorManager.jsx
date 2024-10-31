import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Radio, Select, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { createMentor, deleteMentor, getAllMentors, importExcelMentor, updateMentor } from '../../apis/MentorServices';
import { getAllSemester } from '../../apis/SemesterServices';
import { getAllSkill } from '../../apis/SkillServices';
import dayjs from 'dayjs';
import { colors } from '../../utils/constant';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import Search from 'antd/es/transfer/search';

const MentorManager = () => {
  const [mentors, setMentors] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;
  const [uploadedAvatar, setUploadedAvatar] = useState(null); // Lưu URL ảnh sau khi upload
  const [fileList, setFileList] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchMentors = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getAllMentors(searchText, token);
        console.log(response);

        setMentors(response.mentorsDTOList);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [searchText]);

  useEffect(() => {
    const fetchSkill = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getAllSkill('', token);
        setSkills(response.data.skillsDTOList);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };
    fetchSkill();
  }, []);

  // Create Mentor
  const showCreateModal = () => {
    setSelectedMentor(null);
    form.resetFields();
    setIsCreateModalVisible(true);
  };

  const handleCreateMentor = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const { avatar, ...mentorValue } = values;

      const { skills, ...otherFields } = mentorValue;
      const skillsArray = skills.map(skillId => ({ id: skillId }));
      const createData = {
        mentor: {
          ...otherFields,
          birthDate: dayjs(values.birthDate).format('YYYY-MM-DD'),
          skills: skillsArray
        },
        avatarFile: uploadedAvatar
      };
      const response = await createMentor(createData, token);
      console.log(response);

      if (response && response.statusCode === 200) {
        setMentors(prevMentors => [
          ...prevMentors,
          {
            ...response.mentorsDTO,
            skills: response.mentorsDTO?.skills.map(skill => {
              const skillDetail = skills.find(s => s.id === skill.id);
              return skillDetail ? { id: skillDetail.id, skillName: skillDetail.skillName } : skill;
            })
          }
        ]);
        setIsCreateModalVisible(false);
        message.success('Mentor created successfully');
        setFileList([]);
      } else {
        message.error('Failed to create mentor');
      }
    } catch (error) {
      console.error('Create mentor error:', error);
      message.error('Failed to create mentor: ' + error.message);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields([
        'fullName',
        'username',
        'email',
        'mentorCode',
        'star',
        'totalTimeRemain',
        'birthDate',
        'address',
        'phone',
        'gender',
        'skills'
      ]);
      const { avatar, ...mentorValue } = values;

      const { skills, ...otherFields } = mentorValue;
      const skillsArray = skills?.map(skillId => ({ id: skillId }));
      const updateData = {
        mentor: {
          ...otherFields,
          birthDate: dayjs(values.birthDate).format('YYYY-MM-DD'),
          skills: skillsArray
        },
        avatarFile: uploadedAvatar
      };
      console.log(updateData);

      const response = await updateMentor(selectedMentor.user.id, updateData, token);

      if (response && response?.statusCode === 200) {
        // Cập nhật lại danh sách người dùng với thông tin mới
        setMentors(mentors?.map(mentor => (mentor.id === response.mentorsDTO.id ? response.mentorsDTO : mentor)));
        setIsUpdateModalVisible(false);
        setFileList([]);
        message.success('Mentor updated successfully');
      } else {
        message.error('Failed to update mentor');
      }
    } catch (error) {
      console.error('Update mentor error:', error);
      message.error('Failed to update mentor: ' + error.message);
    }
  };

  const handleDelete = async mentorId => {
    const token = localStorage.getItem('token');
    try {
      const response = await deleteMentor(mentorId, token);

      if (response && response.statusCode === 200) {
        message.success('Mentor deleted successfully');
        setMentors(prevMentors => prevMentors.filter(mentor => mentor.user.id !== mentorId)); // Cập nhật danh sách người dùng
      } else {
        message.error('Failed to delete mentor: ' + response.data.message);
      }
    } catch (error) {
      console.error('Delete mentor error:', error);
      message.error('Failed to delete mentor: ' + error.message);
    }
  };

  const handleImportExcel = async () => {
    const token = localStorage.getItem('token');

    // Đảm bảo rằng một tệp đã được chọn
    if (fileList.length === 0) {
      message.error('Please select a file to import!');
      return;
    }

    try {
      const response = await importExcelMentor(fileList[0].originFileObj, token); // Gọi hàm với tệp tin

      if (response && response.statusCode === 200) {
        // Cập nhật lại danh sách người dùng với thông tin mới
        await fetchMentors(token); // Cập nhật lại danh sách mentors
        setIsUpdateModalVisible(false);
        setFileList([]);
        message.success('Mentors imported successfully');
      } else {
        message.error('Import Excel thất bại');
      }
    } catch (error) {
      console.error('Import Excel error:', error);
      message.error('Import Excel thất bại: ' + error.message);
    }
  };

  const fetchMentors = async token => {
    try {
      const response = await getAllMentors(token);
      console.log(response);

      // Cập nhật danh sách mentors từ API
      setMentors(response.mentorsDTOList);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCreate = () => {
    form.resetFields();
    setIsCreateModalVisible(false);
    setFileList([]);
  };

  const handleCancelUpdate = () => {
    form.resetFields();
    setIsUpdateModalVisible(false);
    setFileList([]);
  };

  // Import Excel
  const showImportModal = () => {
    setIsImportModalVisible(true);
  };

  const handleCancelImport = () => {
    setIsImportModalVisible(false);
    setFileList([]);
  };

  const handleFileChange = info => {
    if (info.fileList.length > 0) {
      setFileList(info.fileList.slice(-1)); // Chỉ giữ lại file cuối cùng được tải lên
    } else {
      setFileList([]);
    }
  };

  const showUpdateModal = mentor => {
    setSelectedMentor(mentor);
    const avatarFile = {
      uid: '-1', // Đặt một uid duy nhất cho file
      name: 'avatar.png', // Tên file (có thể thay đổi nếu cần)
      status: 'done', // Trạng thái của file
      url: mentor.user.avatar || null // Liên kết avatar
    };
    form.setFieldsValue({
      fullName: mentor.user.fullName,
      username: mentor.user.username,
      email: mentor.user.email,
      skills: mentor.skills.map(skill => skill.id),
      mentorCode: mentor.mentorCode,
      totalTimeRemain: mentor.totalTimeRemain,
      star: mentor.star,
      birthDate: dayjs(mentor.user.birthDate),
      address: mentor.user.address,
      phone: mentor.user.phone,
      gender: mentor.user.gender,
      avatar: avatarFile
    });
    mentor.user.avatar && setFileList([avatarFile]);
    setIsUpdateModalVisible(true);
  };

  const columns = [
    {
      title: 'No',
      width: 60,
      dataIndex: 'no',
      key: 'no',
      fixed: 'left',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Avatar',
      dataIndex: ['user', 'avatar'],
      key: 'avatar',
      render: avatar => (
        <img
          src={avatar}
          alt="Avatar"
          className="w-[7vw] h-50" // Thêm các class Tailwind CSS cho kích thước và kiểu dáng
        />
      )
    },
    {
      title: 'Full Name',
      dataIndex: ['user', 'fullName'],
      key: 'fullName',
      fixed: 'left',
    },
    {
      title: 'Email',
      width: 280,
      dataIndex: ['user', 'email'],
      key: 'email'
    },
    {
      title: 'Mentor Code',
      dataIndex: 'mentorCode',
      key: 'mentorCode'
    },
    {
      title: 'Skill',
      dataIndex: 'skills',
      key: 'skills',
      render: skills => (
        <>
          {skills?.map((skill, index) => (
            <Tag color={colors[skill.id % colors.length]} key={skill.id}>
              {skill.skillName}
            </Tag>
          ))}
        </>
      )
    },
    {
      title: 'Phone',
      dataIndex: ['user', 'phone'],
      key: 'phone'
    },
    {
      title: 'Star',
      dataIndex: 'star',
      key: 'star'
    },
    {
      title: 'Time remain',
      dataIndex: 'totalTimeRemain',
      key: 'totalTimeRemain'
    },
    {
      title: 'Gender',
      dataIndex: ['user', 'gender'],
      key: 'gender'
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (text, record) => (
        <div className="flex flex-col gap-2">
          <Button
            className="bg-blue-500 text-white  w-full"
            onClick={() => showUpdateModal(record)}
            style={{ marginRight: '10px' }}
          >
            Update
          </Button>
          <Button className="bg-red-500 text-white  w-full" onClick={() => handleDelete(record.user.id)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  const onChange = e => {
    setSearchText(e.target.value);
  };

  if (loading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full h-full bg-gray-100">
      <h1 className="text-2xl font-bold mb-3 text-gray-800">Mentor List</h1>
      <Button type="primary" onClick={showCreateModal} style={{ marginBottom: '10px' }}>
        Create Mentor
      </Button>
      <Button type="primary" onClick={showImportModal} style={{ marginBottom: '10px', marginLeft: '10px' }}>
        Import Excel
      </Button>
      {/* search */}
      <div className="w-[25vw] mb-3">
        <Search placeholder="input search text" onChange={onChange} />
      </div>
      <Table
        columns={columns}
        bordered
        dataSource={mentors}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x:'1600px', y: 400 }}
      />

      {/* Modal for updating mentor */}
      <Modal title="Update Mentor" open={isUpdateModalVisible} onOk={handleUpdate} onCancel={handleCancelUpdate}>
        <div className="max-h-96 overflow-y-auto p-5">
          <Form form={form} layout="vertical">
            <Form.Item
              label="FullName"
              name="fullName"
              rules={[
                {
                  required: true,
                  message: 'Please input your Name!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your Gmail!'
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email !'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mentor Code"
              name="mentorCode"
              rules={[
                {
                  required: true,
                  message: 'Please input your mentor code!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Star"
              name="star"
              rules={[
                {
                  required: true,
                  message: 'Please select a star rating!'
                }
              ]}
            >
              <Select placeholder="Select a star rating">
                <Select.Option value={1}>1 Star</Select.Option>
                <Select.Option value={2}>2 Stars</Select.Option>
                <Select.Option value={3}>3 Stars</Select.Option>
                <Select.Option value={4}>4 Stars</Select.Option>
                <Select.Option value={5}>5 Stars</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Total Time Remain"
              name="totalTimeRemain"
              rules={[
                {
                  required: true,
                  message: 'Please input the total time remaining!'
                },
                {
                  type: 'number',
                  message: 'Please enter a valid number!',
                  transform: value => Number(value) // Chuyển đổi giá trị đầu vào thành số
                },
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(new Error('Total time remaining must be greater than zero!'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Birth Date" name="birthDate">
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              label="Mentor Code"
              name="mentorCode"
              rules={[
                {
                  required: true,
                  message: 'Please input your mentor code!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Skill" name="skills">
              <Select mode="multiple" placeholder="Select skills" style={{ width: '100%' }}>
                {skills?.map(skill => (
                  <Option key={skill.id} value={skill.id}>
                    {skill.skillName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[
                {
                  required: true,
                  message: 'Please input your gender!'
                }
              ]}
            >
              <Radio.Group>
                <Radio value="MALE">Male</Radio>
                <Radio value="FEMALE">Female</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Avatar" name="avatar">
              <div>
                <Dragger
                  accept="image/*"
                  beforeUpload={file => {
                    setUploadedAvatar(file);
                    return false; // Ngăn không cho upload file tự động
                  }}
                  fileList={fileList}
                  onChange={info => {
                    if (info.fileList.length > 0) {
                      setFileList(info.fileList.slice(-1));
                    }
                  }}
                  onRemove={file => {
                    // Xóa file khi người dùng nhấp vào nút xóa
                    setFileList(fileList.filter(item => item.uid !== file.uid));
                    return true; // Trả về true để xác nhận việc xóa
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">Support for a single upload.</p>
                </Dragger>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Modal for creating mentor */}
      <Modal title="Create mentor" open={isCreateModalVisible} onOk={handleCreateMentor} onCancel={handleCancelCreate}>
        <div className="max-h-96 overflow-y-auto p-5">
          <Form form={form} layout="vertical" initialValues={{ gender: 'MALE' }}>
            <Form.Item
              label="FullName"
              name="fullName"
              rules={[
                {
                  required: true,
                  message: 'Please input your Name!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your Gmail!'
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email !'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!'
                }
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item label="Birth Date" name="birthDate">
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              label="Mentor Code"
              name="mentorCode"
              rules={[
                {
                  required: true,
                  message: 'Please input your mentor code!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Skill" name="skills">
              <Select mode="multiple" placeholder="Select skills" style={{ width: '100%' }}>
                {skills?.map(skill => (
                  <Option key={skill.id} value={skill.id}>
                    {skill.skillName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[
                {
                  required: true,
                  message: 'Please input your gender!'
                }
              ]}
            >
              <Radio.Group>
                <Radio value="MALE">Male</Radio>
                <Radio value="FEMALE">Female</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Avatar" name="avatar">
              <div>
                <Dragger
                  accept="image/*"
                  beforeUpload={file => {
                    setUploadedAvatar(file);
                    return false; // Ngăn không cho upload file tự động
                  }}
                  fileList={fileList}
                  onChange={info => {
                    if (info.fileList.length > 0) {
                      setFileList(info.fileList.slice(-1));
                    }
                  }}
                  onRemove={file => {
                    // Xóa file khi người dùng nhấp vào nút xóa
                    setFileList(fileList.filter(item => item.uid !== file.uid));
                    return true; // Trả về true để xác nhận việc xóa
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">Support for a single upload.</p>
                </Dragger>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Modal for importing Excel */}
      <Modal
        title="Import Mentor từ Excel"
        open={isImportModalVisible}
        onOk={handleImportExcel}
        onCancel={handleCancelImport}
      >
        <Dragger
          accept=".xlsx, .xls"
          beforeUpload={() => false} // Ngăn không cho upload tự động
          fileList={fileList}
          onChange={handleFileChange}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click hoặc kéo thả file để tải lên</p>
          <p className="ant-upload-hint">Chỉ chấp nhận file Excel (.xls, .xlsx)</p>
        </Dragger>
      </Modal>
    </div>
  );
};

export default MentorManager;

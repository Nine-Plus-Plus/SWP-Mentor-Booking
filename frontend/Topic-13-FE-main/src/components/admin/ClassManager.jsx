import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { getAllSemester } from '../../apis/SemesterServices';
import {
  createClass,
  deleteClass,
  getClassBySemesterId,
  getMentorNoClass,
  updateClass
} from '../../apis/ClassServices';
import Search from 'antd/es/transfer/search';

const ClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchSemesters = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getAllSemester(token);
        setSemesters(response.data?.semesterDTOList);
      } catch (err) {
        setError(err?.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (semesters?.length > 0) {
      setSelectedSemester(semesters[0].id);
    }
  }, [semesters]);

  useEffect(() => {
    const fetchMentorsNoClass = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getMentorNoClass(token);
        setMentors(response.mentorsDTOList);
        console.log(response);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorsNoClass();
  }, [isCreateModalVisible, isUpdateModalVisible]);

  // auto chọn semester cuối
  useEffect(() => {
    const fetchClassBySemesterId = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getClassBySemesterId(selectedSemester, searchText, token);
        setClasses(response?.classDTOList || []);
        console.log(response);
      } catch (err) {
        setError(err?.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };
    setLoading(false);
    selectedSemester && fetchClassBySemesterId();
  }, [selectedSemester, searchText]);

  const handleCreateClass = async () => {
    const token = localStorage.getItem('token');
    try {
      // Xác thực form và lấy dữ liệu
      const values = await form.validateFields();

      const dataCreate = {
        ...values,
        semester: { id: values.semesterId }
      };

      // Nếu mentorId không phải là null, thì thêm vào dataCreate
      if (values.mentorId) {
        dataCreate.mentor = { id: values.mentorId };
      }

      console.log(dataCreate);

      // Gọi API tạo lớp học
      const response = await createClass(dataCreate, token);

      // Kiểm tra phản hồi từ API và cập nhật danh sách lớp học
      if (response?.statusCode === 200 && response?.classDTO) {
        setClasses([...classes, response.classDTO]);
        setIsCreateModalVisible(false);
        message.success('Class created successfully');
      } else {
        message.error('Failed to create class');
      }
    } catch (error) {
      console.error('Create class error:', error);
      message.error('Failed to create class: ' + (error.message || 'Unknown error'));
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const updateData = {
        ...form.getFieldsValue(),
        mentor: { id: values.mentorId },
        semester: { id: values.semesterId }
      };

      const response = await updateClass(selectedClass.id, updateData, token);
      if (response && response?.statusCode === 200) {
        // Kiểm tra xem semesterId đã thay đổi hay chưa
        const updatedClass = response.classDTO; // Lớp học sau khi cập nhật
        const isSameSemester = updatedClass.semester.id === selectedClass.semester.id;

        if (!isSameSemester) {
          // Nếu semesterId khác, loại bỏ lớp học khỏi danh sách
          setClasses(classes.filter(classU => classU.id !== selectedClass.id));
        } else {
          // Nếu semesterId không thay đổi, cập nhật lớp học trong danh sách
          setClasses(classes.map(classU => (classU.id === updatedClass.id ? updatedClass : classU)));
        }
        setIsUpdateModalVisible(false);
        message.success('Class updated successfully');
      } else {
        console.log('Update Data:', updateData);
        message.error('Failed to update class');
      }
    } catch (error) {
      console.error('Update class error:', error);
      message.error('Failed to update class: ' + error.message);
    }
  };

  const handleDelete = async idClass => {
    const token = localStorage.getItem('token');
    try {
      const response = await deleteClass(idClass, token);

      if (response && response.statusCode === 200) {
        message.success('Class deleted successfully');
        setClasses(prevClass => prevClass.filter(classu => classu.id !== idClass)); // Cập nhật danh sách người dùng
      } else {
        message.error('Failed to delete class: ' + response.data.message);
      }
    } catch (error) {
      console.error('Delete class error:', error);
      message.error('Failed to delete class: ' + error.message);
    }
  };

  const showUpdateModal = classU => {
    setSelectedClass(classU);
    console.log(classU);

    form.setFieldsValue({
      className: classU.className,
      semesterId: classU.semester.id,
      mentorId: classU.mentor.id
    });
    setIsUpdateModalVisible(true);
  };

  const showCreateModal = () => {
    setSelectedClass(null);
    form.resetFields();
    setIsCreateModalVisible(true);
  };

  const handleCancelCreate = () => {
    form.resetFields();
    setIsCreateModalVisible(false);
  };

  const handleCancelUpdate = () => {
    form.resetFields();
    setIsUpdateModalVisible(false);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Class Name',
      dataIndex: 'className',
      key: 'className'
    },
    {
      title: 'Semester',
      dataIndex: ['semester', 'semesterName'],
      key: 'semester'
    },
    {
      title: 'Mentor Code',
      key: 'mentor',
      render: (_, record) => {
        const fullName = record.mentor?.user?.fullName || '';
        const mentorCode = record.mentor?.mentorCode || '';
        return `${fullName} - ${mentorCode}`;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div className="flex flex-col gap-2">
          <Button
            className="bg-blue-500 text-white  w-full"
            onClick={() => showUpdateModal(record)}
            style={{ marginRight: '10px' }}
          >
            Update
          </Button>
          <Button className="bg-red-500 text-white  w-full" onClick={() => handleDelete(record.id)}>
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
      <h1 className="text-2xl font-bold mb-3 text-gray-800">Class List</h1>
      <Button type="primary" onClick={showCreateModal} style={{ marginBottom: '10px', width: '10vw' }}>
        Create Class
      </Button>

      <div className="flex gap-3">
        <Select
          placeholder="Semester"
          value={selectedSemester}
          onChange={value => setSelectedSemester(value)}
          style={{ backgroundColor: '#D1D5DB', width: '10vw' }}
        >
          {semesters?.map(semester => (
            <Option key={semester.id} value={semester.id}>
              {semester.semesterName}
            </Option>
          ))}
        </Select>
        {/* search */}
        <div className="w-[25vw] mb-3">
          <Search placeholder="input search text" onChange={onChange} />
        </div>
      </div>
      <Table
        columns={columns}
        bordered
        dataSource={classes}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ y: 400 }}
      />

      {/* Modal for updating class */}
      <Modal title="Update Class" open={isUpdateModalVisible} onOk={handleUpdate} onCancel={handleCancelUpdate}>
        <div className="max-h-96 overflow-y-auto p-5">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Class Name"
              name="className"
              rules={[
                {
                  required: true,
                  message: 'Please input your class name!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Semester"
              name="semesterId"
              rules={[
                {
                  required: true,
                  message: 'Please select a semester!'
                }
              ]}
            >
              <Select placeholder="Select Semester">
                {semesters?.map(semester => (
                  <Select.Option key={semester.id} value={semester.id}>
                    {semester.semesterName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Mentor" name="mentorId">
              <Select placeholder="Select mentor" style={{ width: '100%' }}>
                {mentors?.map(mentor => (
                  <Select.Option key={mentor.id} value={mentor.id}>
                    {`${mentor?.user?.fullName}-${mentor.mentorCode}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Modal for creating Class */}
      <Modal title="Create Class" open={isCreateModalVisible} onOk={handleCreateClass} onCancel={handleCancelCreate}>
        <div className="max-h-96 overflow-y-auto p-5">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Class Name"
              name="className"
              rules={[
                {
                  required: true,
                  message: 'Please input your class name!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Semester"
              name="semesterId"
              rules={[
                {
                  required: true,
                  message: 'Please select a semester!'
                }
              ]}
            >
              <Select placeholder="Select Semester">
                {semesters?.map(semester => (
                  <Select.Option key={semester.id} value={semester.id}>
                    {semester.semesterName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Mentor" name="mentorId">
              <Select placeholder="Select mentor" style={{ width: '100%' }}>
                {mentors?.map(mentor => (
                  <Select.Option key={mentor.id} value={mentor.id}>
                    {`${mentor.user.fullName}-${mentor.mentorCode}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ClassManager;

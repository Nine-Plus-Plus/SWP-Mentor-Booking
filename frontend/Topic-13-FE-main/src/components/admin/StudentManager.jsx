import React, { useState, useEffect } from 'react';
import {
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createStudent,
  importExcelStudent,
  getStudentsBySemesterId
} from '../../apis/StudentServices';
import { Table, Button, message, Form, Modal, Input, Radio, Select, DatePicker } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getAllSemester } from '../../apis/SemesterServices';
import { getClassBySemesterId } from '../../apis/ClassServices';
import Dragger from 'antd/es/upload/Dragger';
import Search from 'antd/es/transfer/search';

function StudentManager() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [classes, setClasses] = useState([]);
  const [form] = Form.useForm();
  const [uploadedAvatar, setUploadedAvatar] = useState(null); // Lưu URL ảnh sau khi upload
  const [fileList, setFileList] = useState([]);
  const [filterSemester, setFilterSemester] = useState(null);
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
      setFilterSemester(semesters[0].id);
    }
  }, [semesters]);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getStudentsBySemesterId(filterSemester, searchText, token);
        setStudents(response.studentsDTOList);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [filterSemester, searchText]);

  useEffect(() => {
    const fetchClassBySemesterId = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getClassBySemesterId(selectedSemester, '', token);
        setClasses(response?.classDTOList);
        // Đặt giá trị mặc định là tùy chọn cuối cùng
      } catch (err) {
        setError(err?.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };
    setLoading(false);
    fetchClassBySemesterId();
  }, [selectedSemester]);

  // Delete student
  const handleDelete = async studentId => {
    const token = localStorage.getItem('token');
    try {
      const response = await deleteStudent(studentId, token);

      if (response && response.statusCode === 200) {
        message.success('Student deleted successfully');
        setStudents(prevStudents => prevStudents.filter(student => student.user.id !== studentId)); // Cập nhật danh sách người dùng
      } else {
        message.error('Failed to delete student: ' + response.data.message);
      }
    } catch (error) {
      console.error('Delete student error:', error);
      message.error('Failed to delete student: ' + error.message);
    }
  };

  // Update student
  const showUpdateModal = student => {
    setSelectedStudent(student);
    const avatarFile = {
      uid: '-1', // Đặt một uid duy nhất cho file
      name: 'avatar.png', // Tên file (có thể thay đổi nếu cần)
      status: 'done', // Trạng thái của file
      url: student.user.avatar || null // Liên kết avatar
    };

    form.setFieldsValue({
      fullName: student.user.fullName,
      username: student.user.username,
      email: student.user.email,
      expertise: student.expertise,
      studentCode: student.studentCode,
      semesterId: student.aclass.semester.id,
      classId: student.aclass.id,
      birthDate: dayjs(student.user.birthDate),
      address: student.user.address,
      phone: student.user.phone,
      gender: student.user.gender,
      avatar: avatarFile
    });
    console.log(student);

    setFileList([avatarFile]);
    setUploadedAvatar(avatarFile);
    setSelectedSemester(form.getFieldValue().semesterId);
    setIsUpdateModalVisible(true);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields([
        'fullName',
        'username',
        'email',
        'studentCode',
        'birthDate',
        'semesterId',
        'classId',
        'expertise',
        'address',
        'phone',
        'gender'
      ]);

      const { avatar, ...studentValues } = values;
      const updateData = {
        student: {
          ...studentValues,
          birthDate: dayjs(studentValues.birthDate).format('YYYY-MM-DD'),
          aclass: {
            id: studentValues.classId
          }
        },
        avatarFile: uploadedAvatar // Đây là file avatar
      };
      console.log(updateData);

      const response = await updateStudent(selectedStudent.user.id, updateData, token);
      console.log(response);

      if (response && response?.statusCode === 200) {
        // Cập nhật lại danh sách người dùng với thông tin mới
        setStudents(students.map(student => (student.id === response.studentsDTO.id ? response.studentsDTO : student)));
        setIsUpdateModalVisible(false);
        setFileList([]);
        message.success('Student updated successfully');
        setUploadedAvatar(null);
      } else {
        message.error('Failed to update student');
      }
    } catch (error) {
      console.error('Update student error:', error);
      message.error('Failed to update student: ' + error.message);
    }
  };

  const handleCancelUpdate = () => {
    form.resetFields();
    setIsUpdateModalVisible(false);
    setFileList([]);
  };

  // Create Student
  const showCreateModal = () => {
    setSelectedStudent(null); // Không chọn user nào vì đang tạo mới
    form.resetFields(); // Xóa các giá trị trong form
    setIsCreateModalVisible(true); // Hiển thị modal tạo người dùng
  };

  const handleCreateStudent = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const { avatar, ...studentValues } = values;
      const createData = {
        student: {
          ...studentValues,
          birthDate: dayjs(studentValues.birthDate).format('YYYY-MM-DD'),
          aclass: {
            id: studentValues.classId
          }
        },
        avatarFile: uploadedAvatar // Đây là file avatar
      };

      const response = await createStudent(createData, token);
      console.log(response);

      if (response && response.statusCode === 200) {
        setStudents([...students, response.studentsDTO]);
        setIsCreateModalVisible(false);
        message.success('Student created successfully');
        setUploadedAvatar(null);
      } else {
        message.error('Failed to create student');
      }
    } catch (error) {
      message.error('Failed to create student: ' + error.message);
    }
  };

  const handleCancelCreate = () => {
    form.resetFields();
    setIsCreateModalVisible(false);
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

  const handleImportExcel = async () => {
    const token = localStorage.getItem('token');

    // Đảm bảo rằng một tệp đã được chọn
    if (fileList.length === 0) {
      message.error('Please select a file to import!');
      return;
    }

    try {
      const response = await importExcelStudent(fileList[0].originFileObj, token); // Gọi hàm với tệp tin

      if (response && response.statusCode === 200) {
        // Cập nhật lại danh sách người dùng với thông tin mới
        await fetchStudents(token); // Cập nhật lại danh sách mentors
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

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await getStudents(token);
      console.log(response);

      setStudents(response.studentsDTOList);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
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
      width: 250,
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
      title: 'Birth Date',
      dataIndex: ['user', 'birthDate'],
      key: 'birthDate'
    },
    {
      title: 'Semester',
      dataIndex: ['aclass', 'semester', 'semesterName'],
      key: 'semester'
    },
    {
      title: 'Class',
      dataIndex: ['aclass', 'className'],
      key: 'class'
    },
    {
      title: 'Expertise',
      dataIndex: 'expertise',
      key: 'expertise'
    },
    {
      title: 'Phone',
      dataIndex: ['user', 'phone'],
      key: 'phone'
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
      <h1 className="text-2xl font-bold mb-3 text-gray-800">Student List</h1>
      <Button type="primary" onClick={showCreateModal} style={{ marginBottom: '10px' }}>
        Create Student
      </Button>
      <Button type="primary" onClick={showImportModal} style={{ marginBottom: '10px', marginLeft: '10px' }}>
        Import Excel
      </Button>
      <div className="w-full mb-3 flex gap-3">
        <Select
          placeholder="Select Semester"
          value={filterSemester}
          onChange={value => setFilterSemester(value)}
          style={{ backgroundColor: '#F3F4F6', width: 200 }}
          className="rounded-lg shadow-sm border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
        >
          {semesters?.map(semester => (
            <Select.Option key={semester.id} value={semester.id}>
              {semester.semesterName}
            </Select.Option>
          ))}
        </Select>

        {/* search */}
        <div className="w-[25vw]">
          <Search placeholder="input search text" onChange={onChange} />
        </div>
      </div>

      <Table
        columns={columns}
        bordered
        dataSource={students}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x:'1600px', y: 400 }}
      />
      {/* Modal for updating student */}
      <Modal title="Update Student" open={isUpdateModalVisible} onOk={handleUpdate} onCancel={handleCancelUpdate}>
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
              label="Student Code"
              name="studentCode"
              rules={[
                {
                  required: true,
                  message: 'Please input your student code!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Birth Date" name="birthDate">
              <DatePicker format="DD-MM-YYYY" />
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
              <Select placeholder="Select Semester" onChange={value => setSelectedSemester(value)}>
                {semesters?.map(semester => (
                  <Select.Option key={semester.id} value={semester.id}>
                    {semester.semesterName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Class"
              name="classId"
              rules={[
                {
                  required: true,
                  message: 'Please input your class!'
                }
              ]}
            >
              <Select placeholder="Select Class">
                {classes?.map(classU => (
                  <Select.Option key={classU.id} value={classU.id}>
                    {classU.className}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Expertise"
              name="expertise"
              rules={[
                {
                  required: true,
                  message: 'Please input your expertise!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="Gender" name="gender">
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
      {/* Modal for creating student */}
      <Modal
        title="Create student"
        open={isCreateModalVisible}
        onOk={handleCreateStudent}
        onCancel={handleCancelCreate}
      >
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
              label="Student Code"
              name="studentCode"
              rules={[
                {
                  required: true,
                  message: 'Please input your student code!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Expertise"
              name="expertise"
              rules={[
                {
                  required: true,
                  message: 'Please input your expertise!'
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
              <Select placeholder="Select Semester" onChange={value => setSelectedSemester(value)}>
                {semesters?.map(semester => (
                  <Select.Option key={semester.id} value={semester.id}>
                    {semester.semesterName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Class"
              name="classId"
              rules={[
                {
                  required: true,
                  message: 'Please input your class!'
                }
              ]}
            >
              <Select placeholder="Select Class">
                {classes?.map(classU => (
                  <Select.Option key={classU.id} value={classU.id}>
                    {classU.className}
                  </Select.Option>
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
}

export default StudentManager;

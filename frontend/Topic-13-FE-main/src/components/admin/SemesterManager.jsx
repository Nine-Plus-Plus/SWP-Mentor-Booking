import { Button, Table, Form, Modal, Input, message, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { createSemester, deleteSemester, getAllSemester, updateSemester } from '../../apis/SemesterServices';
import dayjs from 'dayjs';

const SemesterManager = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchSemesters = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getAllSemester(token);
        setSemesters(
          response?.data?.semesterDTOList?.map(semester => ({
            ...semester,
            dateCreated: dayjs(semester.dateCreated).format('HH:mm DD-MM-YYYY')
          }))
        );
      } catch (err) {
        setError(err?.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, []);

  const showCreateModal = () => {
    form.resetFields(); // Xóa các giá trị trong form
    setIsCreateModalVisible(true); // Hiển thị modal tạo người dùng
  };

  const handleCreateSemester = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const { dateStart, dateEnd } = values;

      const dataCreate = {
        ...values,
        dateStart: dayjs(dateStart).format('DD-MM-YYYY'),
        dateEnd: dayjs(dateEnd).format('DD-MM-YYYY')
      };
      console.log(dataCreate);

      const response = await createSemester(dataCreate, token);
      console.log(response);

      if (response?.statusCode === 200 && response?.semesterDTO) {
        setSemesters([...semesters, response?.semesterDTO]);
        setIsCreateModalVisible(false);
        message.success('Semester created successfully');
      } else {
        message.error('Failed to create semester');
      }
    } catch (error2) {
      console.error('Create semester error:', error2);
      message.error('Failed to create semester: ' + (error2.message || 'Unknown error'));
    }
  };
  const handleUpdateSemester = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const { dateStart, dateEnd } = values;

      const dataCreate = {
        ...values,
        dateStart: dayjs(dateStart).format('DD-MM-YYYY'),
        dateEnd: dayjs(dateEnd).format('DD-MM-YYYY')
      };
      console.log(selectedSemester.id, dataCreate);

      const response = await updateSemester(selectedSemester.id, dataCreate, token);
      console.log(response);

      if (response && response.statusCode === 200) {
        // Cập nhật lại danh sách người dùng với thông tin mới
        setSemesters(
          semesters.map(semester => (semester.id === response.semesterDTO.id ? response.semesterDTO : semester))
        );
        setIsUpdateModalVisible(false);
        message.success('Semester update successfully');
      } else {
        message.error('Failed to update semester');
      }
    } catch (error2) {
      console.error('Update semester error:', error2);
      message.error('Failed to update semester: ' + (error2.message || 'Unknown error'));
    }
  };

  if (loading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const showUpdateModal = semester => {
    setSelectedSemester(semester);

    // Set values for the form
    form.setFieldsValue({
      semesterName: semester.semesterName,
      dateStart: dayjs(semester.dateStart, 'DD-MM-YYYY') || undefined,
      dateEnd: dayjs(semester.dateEnd, 'DD-MM-YYYY') || undefined
    });
    setIsUpdateModalVisible(true);
  };

  const handleDelete = async semesterId => {
    const token = localStorage.getItem('token');
    try {
      const response = await deleteSemester(semesterId, token);
      if (response && response.data.statusCode === 200) {
        message.success('Semester deleted successfully');
        setSemesters(prevSemester => prevSemester.filter(semester => semester.id !== semesterId)); // Cập nhật danh sách người dùng
      } else {
        message.error('Failed to delete semester: ' + response.data.message);
      }
    } catch (error) {
      console.error('Delete semester error:', error);
      message.error('Failed to delete semester: ' + error.message);
    }
  };

  const handleCancelCreate = () => {
    form.resetFields();
    setIsCreateModalVisible(false);
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
      title: 'Semester',
      dataIndex: 'semesterName',
      key: 'semesterName'
    },
    {
      title: 'Date Start',
      dataIndex: 'dateStart',
      key: 'dateStart'
    },
    {
      title: 'Date End',
      dataIndex: 'dateEnd',
      key: 'dateEnd'
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
        </div>
      )
    }
  ];

  return (
    <div className="w-full h-full bg-gray-100">
      <h1 className="text-2xl font-bold mb-3 text-gray-800">Semester List</h1>
      <Button type="primary" onClick={showCreateModal} style={{ marginBottom: '10px' }}>
        Create Semester
      </Button>
      <Table
        columns={columns}
        dataSource={semesters}
        bordered
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ y: 430 }}
      />
      {/* Modal for creating semester */}

      <Modal
        title="Create semester"
        open={isCreateModalVisible}
        onOk={handleCreateSemester}
        onCancel={handleCancelCreate}
      >
        <div className="max-h-96 overflow-y-auto p-5">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Semester Name"
              name="semesterName"
              rules={[
                {
                  required: true,
                  message: 'Please input your semester name!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date start"
              name="dateStart"
              rules={[
                {
                  required: true,
                  message: 'Please input your date semester start!'
                }
              ]}
            >
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              label="Birth end"
              name="dateEnd"
              rules={[
                {
                  required: true,
                  message: 'Please input your date semester start!'
                }
              ]}
            >
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      {/* Modal update */}
      <Modal
        title="Update semester"
        open={isUpdateModalVisible}
        onOk={handleUpdateSemester}
        onCancel={handleCancelCreate}
      >
        <div className="max-h-96 overflow-y-auto p-5">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Semester Name"
              name="semesterName"
              rules={[
                {
                  required: true,
                  message: 'Please input your semester name!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date start"
              name="dateStart"
              rules={[
                {
                  required: true,
                  message: 'Please input your date semester start!'
                }
              ]}
            >
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              label="Birth end"
              name="dateEnd"
              rules={[
                {
                  required: true,
                  message: 'Please input your date semester end!'
                }
              ]}
            >
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default SemesterManager;

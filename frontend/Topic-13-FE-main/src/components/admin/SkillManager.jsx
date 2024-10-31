import { Button, Form, Input, message, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { createSkill, deleteSkill, getAllSkill, updateSkill } from '../../apis/SkillServices';
import Search from 'antd/es/transfer/search';

const SkillManager = () => {
  const [skills, setSkills] = useState([]);
  ///
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getAllSkill(searchText, token);
        setSkills(response.data.skillsDTOList);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [searchText]);

  const showCreateModal = () => {
    setSelectedSkill(null);
    form.resetFields();
    setIsCreateModalVisible(true);
  };

  const handleCreateSkill = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const createData = form.getFieldValue();
      const response = await createSkill(createData, token);
      console.log(response);

      if (response && response.statusCode === 200) {
        setSkills([...skills, response.skillsDTO]);
        setIsCreateModalVisible(false);
        message.success('Skill created successfully');
      } else {
        message.error('Failed to create skill');
      }
    } catch (error) {
      message.error('Failed to create skill: ' + error.message);
    }
  };

  // Update skill
  const showUpdateModal = skill => {
    setSelectedSkill(skill);
    form.setFieldsValue({
      skillName: skill.skillName,
      skillDescription: skill.skillDescription
    });
    setIsUpdateModalVisible(true);
  };

  const handleDelete = async idSkill => {
    const token = localStorage.getItem('token');
    try {
      const response = await deleteSkill(idSkill, token);

      if (response && response.statusCode === 200) {
        message.success('Skill deleted successfully');
        setSkills(prevSkill => prevSkill.filter(skill => skill.id !== idSkill)); // Cập nhật danh sách người dùng
      } else {
        message.error('Failed to delete skill: ' + response.data.message);
      }
    } catch (error) {
      console.error('Delete skill error:', error);
      message.error('Failed to delete skill: ' + error.message);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const updateData = form.getFieldValue();
      const response = await updateSkill(selectedSkill.id, updateData, token);
      console.log(response);

      if (response && response.statusCode === 200) {
        // Cập nhật lại danh sách kỹ năng với thông tin mới
        console.log(response);

        setSkills(prevSkills =>
          prevSkills.map(skill => (skill.id === response.skillsDTO.id ? response.skillsDTO : skill))
        );
        setIsUpdateModalVisible(false);
        message.success('Skill updated successfully');
      } else {
        message.error('Failed to update skill');
      }
    } catch (error) {
      console.error('Update skill error:', error);
      message.error('Failed to update skill: ' + error.message);
    }
  };

  const handleCancelCreate = () => {
    form.resetFields();
    setIsCreateModalVisible(false);
  };

  const handleCancelUpdate = () => {
    form.resetFields();
    setIsUpdateModalVisible(false);
  };

  const onChange = e => {
    setSearchText(e.target.value);
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
      title: 'Skill Name',
      dataIndex: 'skillName',
      key: 'skillName'
    },
    {
      title: 'Skill Description',
      dataIndex: 'skillDescription',
      key: 'skillDescription'
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

  return (
    <div className="w-full h-full bg-gray-100">
      <h1 className="text-2xl font-bold mb-3 text-gray-800">Skill List</h1>
      <Button type="primary" onClick={showCreateModal} style={{ marginBottom: '10px' }}>
        Create Skill
      </Button>
      {/* search */}
      <div className="w-[25vw] mb-3">
        <Search placeholder="input search text" onChange={onChange} />
      </div>
      <Table
        columns={columns}
        bordered
        dataSource={skills}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ y: 400 }}
      />
      {/* Modal for updating skill */}
      <Modal title="Update Student" open={isUpdateModalVisible} onOk={handleUpdate} onCancel={handleCancelUpdate}>
        <div className="max-h-96 overflow-y-auto p-5">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Skill Name"
              name="skillName"
              rules={[
                {
                  required: true,
                  message: 'Please input your skill name!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Skill Description"
              name="skillDescription"
              rules={[
                {
                  required: true,
                  message: 'Please input your skill description!'
                }
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Modal for creating skill */}
      <Modal title="Create Skill" open={isCreateModalVisible} onOk={handleCreateSkill} onCancel={handleCancelCreate}>
        <div className="max-h-96 overflow-y-auto p-5">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Skill Name"
              name="skillName"
              rules={[
                {
                  required: true,
                  message: 'Please input your skill name!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Skill Description"
              name="skillDescription"
              rules={[
                {
                  required: true,
                  message: 'Please input your skill description!'
                }
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default SkillManager;

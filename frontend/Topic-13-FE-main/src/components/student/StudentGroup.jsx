import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import path from '../../utils/path';
import ListGroup from '../common/ListGroup';
import { useUserStore } from '../../store/useUserStore';
import { Form, Input, Modal, Table, Tag } from 'antd';
import { getAllTopicUnchosenClass } from '../../apis/TopicServices';
import { toast } from 'react-toastify';
import { createGroup, getGroupByClassId, getGroupById, updateGroup } from '../../apis/GroupServices';
import Swal from 'sweetalert2';
import { dateFnsLocalizer } from 'react-big-calendar';
import { createProject } from '../../apis/ProjectServices';
import { capitalizeFirstLetter } from '../../utils/commonFunction';
import UserItem from '../common/UserItem';
import { getStudentNotGroup } from '../../apis/StudentServices';

const StudentGroup = () => {
  // const [haveGroup, setHaveGroup] = useState(true);
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] = useState(false);
  const [isCreateProjectModalVisible, setIsCreateProjectModalVisible] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [isUpdateGroupModalVisible, setIsUpdateGroupModalVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);
  const { userData, role, fullData, setFullData, setIsUpdate, isUpdate } = useUserStore();
  const [form] = Form.useForm();
  const [inGroup, setInGroup] = useState(null);
  const [inProject, setInProject] = useState(inGroup?.project);
  const [studentNoGroup, setStudentNoGroup] = useState([]);

  useEffect(() => {
    fetchGroup();
  }, [fullData]);

  const fetchGroup = async () => {
    const token = localStorage.getItem('token');
    const groupId = fullData?.groupDTO?.id;
    try {
      const response = await getGroupById(groupId, token);
      console.log(response);
      response?.statusCode === 200 && setInGroup(response?.groupDTO);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchTopicUnchosen = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getAllTopicUnchosenClass(userData?.aclass?.id, token);
        console.log(response);
        if (response && response?.statusCode === 200) setTopics(response?.topicDTOList);
        else setTopics([]);
      } catch (error) {
        setError(err?.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };
    fetchTopicUnchosen();
  }, [userData]);

  useEffect(() => {
    const fetchStudentNoGroup = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getStudentNotGroup(userData?.aclass?.id, token);
        if (response && response?.statusCode === 200) setStudentNoGroup(response?.studentsDTOList);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStudentNoGroup();
  }, [addModal]);

  useEffect(() => {
    setInProject(inGroup?.project);
  }, [inGroup]);

  const handleCreateProject = async () => {
    const token = localStorage.getItem('token');
    try {
      if (!selectedTopic) {
        throw new Error('Please choose a topic before submitting.'); // Gây lỗi nếu không có topic
      }
      const values = await form.validateFields();
      const projectData = {
        projectName: values.projectName,
        description: values.description,
        topic: {
          id: selectedTopic?.id
        },
        group: {
          id: fullData?.groupDTO?.id
        }
      };
      console.log(projectData);

      // Gọi API để tạo dự án
      const response = await createProject(projectData, token);
      console.log('Project created successfully:', response);
      if (response && response?.statusCode === 200) {
        toast.success(response?.message);
        setInProject(response?.projectsDTO);
        setIsCreateProjectModalVisible(false);
        setSelectedTopic(null);
        setIsUpdate(!isUpdate);
      } else toast.error(response?.message);
    } catch (error) {
      toast.error(error.message);
      console.error('Create group error:', error);
      message.error('Failed to create group: ' + error.message);
    }
  };

  const handleCreateGroup = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const data = {
        groupName: values.groupName,
        students: [{ id: userData?.id }],
        classDTO: {
          id: fullData?.studentsDTO?.aclass?.id
        }
      };
      console.log(data);
      const response = await createGroup(data, token);
      console.log(response);
      if (response && response?.statusCode === 200) {
        toast.success(response?.message);
        setInGroup(response?.groupDTO);
        setIsCreateGroupModalVisible(false);
        setIsUpdate(isUpdate);
      } else toast.error(response?.message);
    } catch (error) {
      console.error('Create group error:', error);
      message.error('Failed to create group: ' + error.message);
    }
  };

  const showUpdateGroupModal = () => {
    if (userData?.groupRole !== 'LEADER') {
      Swal.fire({
        title: 'No Authority!',
        text: 'You must be a leader to have access to this function!!!',
        icon: 'error',
        timer: 2000, // Đóng sau 2 giây
        showConfirmButton: true, // Ẩn nút OK
        timerProgressBar: true // Hiển thị progress bar
      });
      return;
    }

    inGroup &&
      form.setFieldsValue({
        groupName: inGroup.groupName
      });
    setIsUpdateGroupModalVisible(true);
  };

  const showADdMemberModal = () => {
    if (userData?.groupRole !== 'LEADER') {
      Swal.fire({
        title: 'No Authority!',
        text: 'You must be a leader to have access to this function!!!',
        icon: 'error',
        timer: 2000, // Đóng sau 2 giây
        showConfirmButton: true, // Ẩn nút OK
        timerProgressBar: true // Hiển thị progress bar
      });
      return;
    }
    setAddModal(true);
  };

  const handleUpdateGroup = async id => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const dataUpdate = { groupName: values.groupName };
      const response = await updateGroup(id, dataUpdate, token);

      if (response && response?.statusCode === 200) {
        setInGroup(response?.groupDTO);
        setIsUpdateGroupModalVisible(false);
        Swal.fire({
          title: 'Updated Group!',
          text: 'Updated Successfully.',
          icon: 'success',
          timer: 2000, // Đóng sau 2 giây
          showConfirmButton: false // Ẩn nút OK
        });
      }
    } catch (error) {
      console.error('Update group error:', error);
      message.error('Failed to update group: ' + error.message);
    }
  };

  const showCreateGroupModal = () => {
    form.resetFields();
    setIsCreateGroupModalVisible(true);
  };
  const showCreateProjectModal = () => {
    form.resetFields();
    setIsCreateProjectModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsCreateGroupModalVisible(false);
    setIsCreateProjectModalVisible(false);
    setIsUpdateGroupModalVisible(false);
    setAddModal(false);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Topic Name',
      dataIndex: 'topicName',
      key: 'topicName',
      className: 'whitespace-pre-line text-left align-top w-[100px]'
    },
    {
      title: 'Context',
      dataIndex: 'context',
      key: 'context',
      className: 'whitespace-pre-line text-left align-top w-[1000px]'
    },
    {
      title: 'Problem',
      dataIndex: 'problems',
      key: 'problems',
      className: 'whitespace-pre-line text-left align-top w-[1000px]'
    },
    {
      title: 'Actors',
      dataIndex: 'actor',
      key: 'actor',
      className: 'whitespace-pre-line text-left align-top',
      render: actors => (
        <>
          {actors?.map((actor, index) => {
            let color = actor.length > 6 ? 'geekblue' : 'green';
            if (
              actor.toUpperCase().includes('ADMIN') ||
              actor.toUpperCase().includes('MANAGER') ||
              actor.toUpperCase().includes('SYSTEM')
            ) {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={index} className="inline-block mt-1 w-[180px]">
                {actor.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: 'Functional Requirements',
      dataIndex: 'requirement',
      key: 'requirement',
      className: 'whitespace-pre-line text-left align-top',
      render: requirements => (
        <>
          {requirements.map((requirement, index) => (
            <p key={index} className="w-[800px]">
              {requirement}
            </p>
          ))}
        </>
      )
    },
    {
      title: 'Non-Functional Requirements',
      dataIndex: 'nonFunctionRequirement',
      key: 'nonFunctionRequirement',
      className: 'whitespace-pre-line text-left align-top',
      render: nf_requirements => (
        <>
          {nf_requirements?.map((nf_requirement, index) => (
            <p key={index} className="w-[300px]">
              {nf_requirement}
            </p>
          ))}
        </>
      )
    },
    {
      title: 'Mentor',
      dataIndex: 'mentorsDTO',
      key: 'mentorsDTO',
      className: 'whitespace-pre-line text-left align-top',
      render: mentor => mentor?.user?.fullName || 'N/A'
    },
    {
      title: 'Semester',
      dataIndex: 'semesterDTO',
      key: 'semesterDTO',
      className: 'whitespace-pre-line text-left align-top',
      render: semester => semester?.semesterName || 'N/A'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button
          type="primary"
          text={'Get'}
          textColor={'text-green-500'}
          onClick={() => {
            setSelectedTopic(record);
          }}
        >
          Get
        </Button>
      )
    }
  ];

  return (
    <div className="w-full">
      {
        <div className="flex flex-col gap-5">
          {/* /// Add student to group */}
          <div className="flex gap-5">
            {!inGroup && (
              <div className="flex flex-col gap-3 p-3 bg-white rounded-md w-5/12 ">
                <h1 className="text-2xl text-red-600 font-semibold">You do not in any group:</h1>
                <Button
                  text={'Create Group'}
                  textColor={'text-white'}
                  bgColor={'bg-main-1'}
                  htmlType={'button'}
                  textSize={'text-xl'}
                  bgHover={'hover:bg-main-2'}
                  fullWidth={'w-7/12'}
                  onClick={showCreateGroupModal}
                />
              </div>
            )}
            {inGroup && !inProject && (
              <div className="flex flex-col gap-3 p-3 bg-white rounded-md w-5/12 ">
                <h1 className="text-2xl text-red-600 font-semibold">Create a Project</h1>
                <Button
                  text={'Create Project'}
                  textColor={'text-white'}
                  bgColor={'bg-main-1'}
                  htmlType={'button'}
                  textSize={'text-xl'}
                  bgHover={'hover:bg-main-2'}
                  fullWidth={'w-7/12'}
                  onClick={showCreateProjectModal}
                />
              </div>
            )}
          </div>
          {!inGroup && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3 p-3 bg-white rounded-md ">
                <ListGroup />
              </div>
            </div>
          )}

          {/* Project */}
          {inProject && (
            <div className="flex flex-wrap gap p-3 bg-white rounded-md ">
              <div className=" border shadow-md rounded-md p-3 w-full gap-6">
                <h1 className="font-bold text-xl text-main-1"> Project name: {inProject?.projectName}</h1>
                <div className="flex p-2 justify-between gap-2">
                  <div className="flex flex-col gap-2 text-md w-[65vw] border-r">
                    <p>
                      <span className="font-bold">Topic: </span>
                      {inProject?.topic?.topicName}
                    </p>
                    <p>
                      <span className="font-bold">Process: </span>
                      {inProject?.percentage}%
                    </p>
                    <p>
                      <span className="font-bold">Description: </span>
                      {inProject?.description}
                    </p>
                    <ul>
                      <span className="font-bold">Requirement:</span>
                      {inProject?.topic?.requirement?.map((req, index) => (
                        <li key={index} className="p-2 my-1 rounded">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2 text-md w-[60vw]">
                    {/* <p>Actor: {inProject?.topic?.actor?.join(', ')}</p> */}
                    <div>
                      <span className="font-bold">Context: </span>
                      {inProject?.topic?.context}
                    </div>
                    <div>
                      <span className="font-bold">Actor: </span>{' '}
                      {inProject?.topic?.actor?.map((actor, index) => (
                        <span key={index} className="inline-block bg-green-200 text-blue-800 px-1 py-1 rounded-sm mr-2">
                          {actor}
                        </span>
                      ))}
                    </div>
                    <ul>
                      <span className="font-bold">Non-Functional Requirement: </span>
                      {inProject?.topic?.nonFunctionRequirement?.map((req, index) => (
                        <li key={index} className="p-2 my-1 rounded">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          {inGroup && (
            <div className="flex flex-col gap-3 p-3 bg-white rounded-md w-full">
              <div className=" border shadow-md rounded-md p-3 w-full">
                <h1 className="font-bold text-xl text-main-1"> Group name: {inGroup?.groupName}</h1>
                <div className="flex p-2 justify-between">
                  <div className="flex flex-col gap-2 text-md">
                    <p>
                      <span className="font-bold">Class: </span>
                      {inGroup?.classDTO?.className}
                    </p>
                    <p>
                      <span className="font-bold">Total Point: </span>
                      {inGroup?.totalPoint} FUP
                    </p>
                    <p>
                      <span className="font-bold">Total member: </span>
                      {inGroup?.students?.length}
                    </p>
                  </div>
                  <div className="flex justify-center h-full flex-col gap-3 ">
                    <Button
                      text={'Edit Group'}
                      textColor={'text-white'}
                      bgColor={'bg-blue-500'}
                      bgHover={'hover:bg-blue-400'}
                      htmlType={'button'}
                      fullWidth={'w-full'}
                      onClick={showUpdateGroupModal}
                    />
                    <Button
                      text={'Add Member'}
                      textColor={'text-white'}
                      bgColor={'bg-green-500'}
                      htmlType={'button'}
                      bgHover={'hover:bg-green-400'}
                      fullWidth={'w-full'}
                      onClick={showADdMemberModal}
                    />
                  </div>
                </div>
              </div>
              {inGroup?.students?.map(member => (
                <UserItem
                  key={member.id}
                  roleItem={capitalizeFirstLetter(member?.user?.role?.roleName)}
                  specialized={member?.expertise}
                  name={member?.user?.fullName}
                  gender={member?.user?.gender}
                  isAdded={false}
                  idUser={member?.user?.id}
                  code={member?.studentCode}
                  groupRole={member?.groupRole}
                  avatar={member?.user?.avatar}
                  studentDel={member?.id}
                  idGroup={inGroup?.id}
                  onRemoveSuccess={fetchGroup}
                  groupName={inGroup?.groupName}
                />
              ))}
            </div>
          )}
        </div>
      }
      {/* Modal create group */}
      <Modal
        title="Create Group"
        open={isCreateGroupModalVisible}
        onCancel={handleCancel}
        onOk={() => {
          form.submit();
        }}
        className="w-full"
      >
        <div className="max-h-96 overflow-y-auto p-5 w-full">
          <Form form={form} layout="vertical" onFinish={handleCreateGroup}>
            <Form.Item
              label="Group Name"
              name="groupName"
              rules={[{ required: true, message: 'Please input group name!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      {/* Modal create project */}
      <Modal
        title="Create Project"
        open={isCreateProjectModalVisible}
        onCancel={handleCancel}
        onOk={handleCreateProject}
        width={1000}
      >
        <div className="max-h-96 overflow-y-auto p-5 w-full">
          <h1 className="text-xl text-main-1">Choose a Topic:</h1>
          <Form form={form} layout="vertical">
            {/* Topic */}
            <Table
              columns={columns}
              dataSource={topics}
              loading={loading}
              rowKey="id"
              pagination={false}
              className="my-5"
              scroll={{ x: '1000px' }}
            />
            {/* Hiển thị ô topicname đã chọn*/}
            <Form.Item
              label={'Topic chosen'}
              rules={[
                {
                  required: selectedTopic !== null,
                  message: 'Please input your skill description!'
                }
              ]}
            >
              <Input value={selectedTopic?.topicName || ''} disabled />
            </Form.Item>
            {/* Trường nhập Project Name */}
            <Form.Item
              label="Project Name"
              name="projectName"
              rules={[{ required: true, message: 'Please input project name!' }]}
            >
              <Input placeholder="Enter project name" />
            </Form.Item>

            {/* Trường nhập Description */}
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input description!' }]}
            >
              <Input.TextArea placeholder="Enter project description" rows={4} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      {/* Modal Update Group */}
      <Modal
        title="Edit Group"
        open={isUpdateGroupModalVisible}
        onCancel={handleCancel}
        onOk={() => {
          form.submit();
        }}
        className="w-full"
      >
        <div className="max-h-96 overflow-y-auto p-5 w-full">
          <Form
            form={form}
            layout="vertical"
            onFinish={() =>
              Swal.fire({
                title: 'Are you sure?', // Tiêu đề của hộp thoại
                text: 'Update your Group!', // Nội dung chính của hộp thoại
                icon: 'warning', // Hiển thị biểu tượng cảnh báo
                showCancelButton: true, // Hiển thị nút hủy
                confirmButtonText: 'Yes, Update', // Văn bản nút xác nhận
                confirmButtonColor: '#dd6633', // Màu nút xác nhận
                cancelButtonText: 'No, cancel.', // Văn bản nút hủy
                reverseButtons: false // Đảo ngược vị trí các nút
              }).then(result => {
                if(result.isConfirmed) {
                  handleUpdateGroup(inGroup?.id);
                } else if(result.dismiss === Swal.DismissReason.cancel) {
                  Swal.fire({ 
                    title: 'Cancelled', 
                    text: 'Cancelled this action!', 
                    icon: 'error',
                    confirmButtonText: 'OK', // Văn bản nút xác nhận
                    confirmButtonColor: '#d33', // Màu nút xác nhận
                  });
                }
              })
            }
          >
            <Form.Item
              label="Group Name"
              name="groupName"
              rules={[{ required: true, message: 'Please input your group name!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Modal Add Member */}
      <Modal
        title="Add Member To Group"
        open={addModal}
        onCancel={handleCancel}
        onOk={() => {
          setAddModal(false);
        }}
        width={1500}
        style={{ top: 40 }}
      >
        <div className="max-h-[80vh] overflow-y-auto w-full flex flex-col gap-3">
          {studentNoGroup?.map(student => (
            <UserItem
              key={student.id}
              addGroup={inGroup?.id}
              roleItem={capitalizeFirstLetter(student?.user?.role?.roleName)}
              specialized={student?.expertise}
              name={student?.user?.fullName}
              gender={student?.user?.gender}
              isAdded={false}
              idStudent={student?.id}
              idUser={student?.user?.id}
              code={student?.studentCode}
              studentAdd={userData?.user?.id}
              groupName={inGroup?.groupName}
              avatar={student?.user?.avatar}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default StudentGroup;

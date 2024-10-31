import React, { createElement, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Modal, Button, Input, Form, List, Select, message } from 'antd';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import { createTask, deleteTask, updateTask, getAllTasksInGroup } from '../../apis/ProjectTaskServices';
import { useUserStore } from '../../store/useUserStore';
import { parseStringStatus } from '../../utils/commonFunction';

const ProgressChart = ({ percentage }) => {
  return (
    <div className="w-full md:w-[280px] p-4">
      <CircularProgressbar
        value={parseFloat(percentage)}
        text={`${percentage}%`}
        styles={buildStyles({
          textSize: '16px',
          pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
          textColor: '#3e98c7',
          trailColor: '#d6d6d6'
        })}
      />
      <p className="flex justify-center mt-4 text-lg">{percentage}% Completed</p>
    </div>
  );
};

export const Progress = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [form] = Form.useForm();
  const { fullData } = useUserStore();

  const dbStatus = {
    NOTSTARTED: 'Not Started',
    DONE: 'Done',
    INPROGRESS: 'In Progress'
  };
  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem('token');
      setLoading(true);
      try {
        const response = await getAllTasksInGroup(fullData?.groupDTO?.id, token);
        if (response?.statusCode === 200) setTasks(response?.projectTasksDTOList);
        else {
          setTasks([]);
        }
      } catch (error) {
        setError(error.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [fullData]);

  const showCreateModal = () => {
    setOpenCreateTaskModal(true);
  };

  const handleCreateTask = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const createData = {
        ...values,
        status: parseStringStatus(values.status),
        projects: {
          id: fullData?.groupDTO?.project?.id
        }
      };

      const response = await createTask(createData, token);
      console.log(response);
      if (response?.statusCode === 200) {
        setTasks([...tasks, response?.projectTasksDTOList[0]]);
        setOpenCreateTaskModal(false);
        form.resetFields();
        message.success('Project Task created successfully');
      } else {
        message.error('Failed to create Project Task');
      }
    } catch (error) {
      console.error('Create Project Task error: ', error);
      message.error('Failed to create Project Task: ' + error.message);
    }
  };

  const deleteTaskLeader = async taskId => {
    try {
      const token = localStorage.getItem('token');
      const response = await deleteTask(taskId, token);
      if (response?.statusCode === 200) {
        setTasks(prevTask => prevTask.filter(task => task.id !== taskId));
        setOpenCreateTaskModal(false);
        Swal.fire({
          title: 'Delete Successful!',
          text: `Your task has been deleted.`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 1000,
          timerProgressBar: true
        });
      } else toast.error(response?.message);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleDeleteTask = async taskId => {
    Swal.fire({
      title: 'Are you sure?',
      html: `Are you sure delete this task?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#dd6633',
      cancelButtonText: 'No!',
      reverseButtons: false // Đảo ngược vị trí của nút xác nhận và hủy
    }).then(result => {
      if (result.isConfirmed) {
        deleteTaskLeader(taskId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({ 
          title: 'Cancelled', 
          text: 'Cancelled this action!', 
          icon: 'error',
          confirmButtonText: 'OK', // Văn bản nút xác nhận
          confirmButtonColor: '#d33', // Màu nút xác nhận
        });
      }
    });
  };

  const handleTaskClick = task => {
    setSelectedTask(task);
    form.setFieldsValue({
      taskName: task.taskName,
      description: task.description,
      status: dbStatus[task.status]
    });
    setOpenCreateTaskModal(true);
  };

  const handleUpdateTask = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const updateData = { ...values, status: parseStringStatus(values.status) };
      console.log('Update data: ', updateData);
      const response = await updateTask(selectedTask.id, updateData, token);
      console.log(response);

      if (response?.statusCode === 200) {
        setTasks(
          tasks.map(task =>
            task.id === response?.projectTasksDTOList[0]?.id ? response?.projectTasksDTOList[0] : task
          )
        );
        form.resetFields();
        setOpenCreateTaskModal(false);
        message.success('Project task updated successfully');
      } else {
        message.error('Failed to update Project Task');
      }
    } catch (error) {
      console.error('Update mentor error:', error);
      message.error('Failed to update mentor: ' + error.message);
    }
  };

  const handleDeleteFromEdit = () => {
    if (selectedTask) {
      handleDeleteTask(selectedTask.id);
    }
  };

  const toggleViewAll = () => {
    setShowAllTasks(!showAllTasks);
  };

  const calculateCompletionPercentage = () => {
    const completedTasks = tasks?.filter(task => task?.status === 'DONE')?.length;
    return tasks?.length > 0 ? ((completedTasks / tasks?.length) * 100).toFixed(2) : 0.0;
  };

  return (
    <div>
      {fullData?.groupDTO ? (
        <div className="flex-col">
          {/* Team Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-4 rounded-lg shadow-lg">
            {/* Total Projects */}
            <div className="border-2 border-sky-500 p-4 rounded-2xl shadow-lg bg-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Total Task</h3>
                <p className="text-right text-blue-500 font-medium">Excellent Work</p>
              </div>
              <p className="text-2xl font-semibold">{tasks?.length}</p>
            </div>

            {/* Task Done */}
            <div className="border-2 border-emerald-500 p-4 rounded-2xl shadow-lg bg-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Task Done</h3>
                <p className="text-right text-green-500 font-medium">High Priority</p>
              </div>
              <p className="text-2xl font-semibold">
                {tasks?.filter(task => task?.status === 'DONE')?.length}/{tasks?.length} Completed
              </p>
            </div>

            {/* Task in Progress */}
            <div className="border-2 border-yellow-500 p-4 rounded-2xl shadow-lg bg-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Task in Progress</h3>
                <p className="text-right text-yellow-500 font-medium">In Progress</p>
              </div>
              <p className="text-2xl font-semibold">
                {tasks?.filter(task => task?.status === 'INPROGRESS')?.length}/{tasks?.length} Running
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            {/* Today's Task Section */}
            <div className="bg-white p-5 rounded-lg shadow-lg w-2/3">
              <h2 className="text-2xl font-bold text-gray-800 mb-5">Project's Task</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tasks?.slice(0, showAllTasks ? tasks?.length : 3)?.map(
                  (task, index) =>
                    task && (
                      <div
                        key={task.id || index} 
                        className="border p-5 rounded-lg shadow-lg bg-white"
                        onClick={() => handleTaskClick(task)}
                      >
                        <h3 className="text-xl text-red-500 font-bold mb-2">{task?.taskName}</h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Date Created:{' '}
                          {task?.dateCreated ? new Date(task?.dateCreated).toLocaleDateString() : 'Unknown'}
                        </p>
                        <p className="mb-4 text-ellipsis overflow-hidden whitespace-nowrap">{task?.description}</p>
                        <div className="flex space-x-4 mt-4">
                          <div
                            className={`flex flex-col items-center w-full ${
                              task?.status === 'NOTSTARTED' ? 'bg-gray-400 text-white rounded-lg' : ''
                            }`}
                          >
                            Not Started
                          </div>
                          <div
                            className={`flex flex-col items-center w-full ${
                              task?.status === 'INPROGRESS' ? 'bg-yellow-500 text-white rounded-lg' : ''
                            }`}
                          >
                            In Progress
                          </div>
                          <div
                            className={`flex flex-col items-center w-full ${
                              task?.status === 'DONE' ? 'bg-green-500 text-white rounded-lg' : ''
                            }`}
                          >
                            Done
                          </div>
                        </div>
                      </div>
                    )
                )}
                {/* Create Task Button */}
                <div className="border p-5 rounded-lg shadow-lg flex items-center justify-center bg-white">
                  <button className="text-blue-500 font-semibold" onClick={showCreateModal}>
                    + Create Task
                  </button>
                </div>
              </div>

              {tasks?.length > 3 && (
                <div className="flex justify-center mt-4">
                  <button className="text-blue-500 font-semibold" onClick={toggleViewAll}>
                    {showAllTasks ? 'View Less' : 'View All'}
                  </button>
                </div>
              )}

              {/* Modal chỉnh sửa và thêm task */}
              <Modal
                title={selectedTask ? 'Edit Task' : 'Create Task'}
                open={openCreateTaskModal}
                onCancel={() => {
                  form.resetFields();
                  setOpenCreateTaskModal(false);
                  setSelectedTask(null);
                }}
                footer={[
                  <Button
                    key="cancel"
                    onClick={() => {
                      form.resetFields();
                      setOpenCreateTaskModal(false);
                      setSelectedTask(null);
                    }}
                  >
                    Cancel
                  </Button>,
                  selectedTask && (
                    <Button key="delete" onClick={handleDeleteFromEdit} type="primary" danger>
                      Delete
                    </Button>
                  ),
                  <Button key="submit" type="primary" onClick={selectedTask ? handleUpdateTask : handleCreateTask}>
                    {selectedTask ? 'Save Changes' : 'Create Task'}
                  </Button>
                ]}
              >
                <Form form={form} layout="vertical" initialValues={{ status: 'Not started' }}>
                  <Form.Item
                    label="Task Name"
                    name="taskName"
                    rules={[
                      {
                        required: true,
                        message: 'Please input task name!'
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: 'Please input task description!'
                      }
                    ]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    label="Status"
                    name="status"
                    rules={[
                      {
                        required: true,
                        message: 'Please input task description!'
                      }
                    ]}
                  >
                    <Select>
                      <Select.Option value="Not Started">Not Started</Select.Option>
                      <Select.Option value="In Progress">In Progress</Select.Option>
                      <Select.Option value="Done">Done</Select.Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Modal>
            </div>

            {/* Progress Chart Section */}
            <div className="w-1/3">
              {/* Overall Progress (Progress Bar) */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Overall Progress</h2>
                <div className="flex justify-center items-center  p-8">
                  <ProgressChart percentage={calculateCompletionPercentage()} />
                </div>
              </div>
            </div>
          </div>

          <ToastContainer />
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-3 bg-white rounded-md">
          <p className="text-red-500">Do not have any group!</p>
        </div>
      )}
    </div>
  );
};

export default Progress;

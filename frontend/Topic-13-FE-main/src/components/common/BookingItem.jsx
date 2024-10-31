import { getMyProfile } from '../../apis/UserServices';
import { useUserStore } from '../../store/useUserStore';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Button from './Button';
import clsx from 'clsx';
import { acceptBooking, cancelBookingMentor, cancelBookingStudent, rejectBooking } from '../../apis/BookingServices';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { createNoti } from '../../apis/NotificationServices';
import { createMeeting } from '../../apis/MeetingServices';
import { Form, Input, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';

export const BookingItem = ({
  className,
  studentBook,
  status: initialStatus,
  schedule,
  mentor,
  point,
  dateCreated,
  members,
  group,
  project,
  idGroup,
  idBooking,
  mentorUserId
}) => {
  const { role } = useUserStore();
  const [form] = Form.useForm();
  const [status, setStatus] = useState(initialStatus);
  const roleProfile = role.toLowerCase();
  const { userData } = useUserStore(); // Lấy userData từ store
  const sameGroup = className === userData?.aclass?.className; // Kiểm tra xem mentor có cùng group không
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [cancelBy, setCancelBy] = useState('');

  const handleCreateNoti = async data => {
    const token = localStorage.getItem('token');
    try {
      setIsLoading(true);
      const response = await createNoti(data, token);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setReason('');
    }
  };

  const handleSentNotiOptionMentor = status => {
    members?.map(member => {
      const dataSent = {
        message: `Mentor ${userData.user.fullName} ${status} your booking: ${schedule}.\n\n${
          reason ? `Reason: ${reason}` : ''
        }`,
        type: 'MESSAGE',
        sender: {
          id: userData.user.id
        },
        reciver: {
          id: member.user.id
        },
        groupDTO: {
          id: idGroup
        },
        bookingDTO: {
          id: idBooking
        }
      };
      console.log(dataSent);
      handleCreateNoti(dataSent);
    });
  };

  const handleSentNotiOptionStudent = status => {
    const dataSent = {
      message: `Mentor ${userData.user.fullName} ${status} your booking: ${schedule}!${
        reason ? `\nReason: ${reason}` : ''
      }`,
      type: 'MESSAGE',
      sender: {
        id: userData.user.id
      },
      reciver: {
        id: mentorUserId
      },
      groupDTO: {
        id: idGroup
      },
      bookingDTO: {
        id: idBooking
      }
    };
    handleCreateNoti(dataSent);
  };

  const createMeetingAccept = async id => {
    let response;
    const data = {
      id: id
    };
    try {
      response = await createMeeting(data, token);
      console.log(response);
    } catch (error) {
      toast.error(response.error);
    }
  };

  const acceptByMentor = async id => {
    try {
      setIsLoading(true);
      const response = await acceptBooking(id, token);
      console.log(response);
      if (response && response?.statusCode === 200) {
        Swal.fire({
          title: 'Accept Successful!',
          text: `Your booking has been booked successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000, // Đóng sau 3 giây
          timerProgressBar: true // Hiển thị progress bar khi đếm thời gian
        });
        createMeetingAccept(id);
        handleSentNotiOptionMentor('accepted');
        setStatus('CONFIRMED');
      } else toast.error(response?.message);
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const rejectByMentor = async id => {
    try {
      setIsLoading(true);
      const response = await rejectBooking(id, token);
      console.log(response);
      if (response && response?.statusCode === 200) {
        Swal.fire({
          title: 'Reject Successful!',
          text: `Your booking has been reject successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000, // Đóng sau 3 giây
          timerProgressBar: true // Hiển thị progress bar khi đếm thời gian
        });
        handleSentNotiOptionMentor('rejected');
        setStatus('REJECTED');
      } else toast.error(response?.message);
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelByMentor = async id => {
    try {
      setIsLoading(true);
      const response = await cancelBookingMentor(id, token);
      console.log(response);
      if (response && response?.statusCode === 200) {
        Swal.fire({
          title: 'Cancel Successful!',
          text: `Your booking has been cancel successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000, // Đóng sau 3 giây
          timerProgressBar: true // Hiển thị progress bar khi đếm thời gian
        });
        console.log(reason);
        handleSentNotiOptionMentor('canceled');
        setStatus('CANCELED');
      } else toast.error(response?.message);
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelByStudent = async id => {
    try {
      setIsLoading(true);
      const response = await cancelBookingStudent(id, token);
      console.log(response);
      if (response && response?.statusCode === 200) {
        Swal.fire({
          title: 'Cancel Successful!',
          text: `Your booking has been cancel successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000, // Đóng sau 3 giây
          timerProgressBar: true // Hiển thị progress bar khi đếm thời gian
        });
        console.log(reason);
        handleSentNotiOptionStudent('canceled');
        setStatus('CANCELED');
      } else toast.error(response?.message);
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    Swal.fire({
      title: 'Are you sure?',
      html: `Are you sure accept this booking?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, accept it',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true // Đảo ngược vị trí của nút xác nhận và hủy
    }).then(result => {
      if (result.isConfirmed) {
        acceptByMentor(idBooking);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Cancelled accept booking!', 'error');
      }
    });
  };

  const handleReject = () => {
    Swal.fire({
      title: 'Are you sure?',
      html: `Are you sure reject this booking?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject it',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true // Đảo ngược vị trí của nút xác nhận và hủy
    }).then(result => {
      if (result.isConfirmed) {
        rejectByMentor(idBooking);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Cancelled reject booking!', 'error');
      }
    });
  };

  const handleCancelMentor = () => {
    Swal.fire({
      title: 'Are you sure?',
      html: `Are you sure cancel this booking?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No!',
      reverseButtons: true // Đảo ngược vị trí của nút xác nhận và hủy
    }).then(result => {
      if (result.isConfirmed) {
        setCancelBy('mentor');
        setIsOpen(true);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Cancelled this action!', 'error');
      }
    });
  };

  const handleCancelStudent = () => {
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
    Swal.fire({
      title: 'Are you sure?',
      html: `Are you sure cancel this booking?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No!',
      reverseButtons: true // Đảo ngược vị trí của nút xác nhận và hủy
    }).then(result => {
      if (result.isConfirmed) {
        setCancelBy('student');
        setIsOpen(true);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Cancelled this action!', 'error');
      }
    });
  };

  const handleOnChange = e => {
    setReason(e.target.value);
  };

  const handleOkReasonCancel = async () => {
    cancelBy === 'mentor' ? cancelByMentor(idBooking) : cancelByStudent(idBooking);
    setIsOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsOpen(false);
  };

  return (
    <div className="min-h-[20vh] border shadow-md rounded-md p-3 w-full">
      {/* Tiêu đề với chữ tô đậm */}
      <h1 className="font-bold text-xl text-main-1">
        {roleProfile === 'mentor' ? (
          <span className={clsx(sameGroup && 'bg-yellow-400 p-1 rounded-md')}>Group: {group}</span>
        ) : (
          <span className={clsx(roleProfile === 'mentor' && 'text-red-500')}>Booking Mentor: {mentor}</span>
        )}
      </h1>

      <div className="flex p-2 justify-between w-full">
        <div className="flex flex-col gap-2 text-md w-1/3">
          <p><span className="font-bold">Day Booking: </span>{dateCreated}</p>
          <p><span className="font-bold">Class: </span>{className}</p>
          <p><span className="font-bold">Group: </span>{group}</p>
          <p><span className="font-bold">Project: </span>{project}</p>
        </div>
        <div className="flex flex-col gap-2 text-md w-1/3">
          <p><span className="font-bold">Schedule: </span>{schedule}</p>
          <p><span className="font-bold">Student Booking: </span>{studentBook}</p>
          <p><span className="font-bold">Point Manner: </span>{point} FUP</p>
          <p><span className="font-bold">Total member: </span>{members?.length}/5</p>
        </div>
        <div className="flex flex-col items-end justify-center gap-y-3 w-1/3 ">
          {roleProfile === 'mentor' ? (
            <>
              {status === 'PENDING' ? (
                <div className="flex flex-col gap-3">
                  <Button
                    text={'Accept'}
                    textColor={'text-white'}
                    bgColor={'bg-green-500'}
                    bgHover={'hover:bg-green-400'}
                    htmlType={'button'}
                    onClick={handleAccept}
                    isLoading={isLoading}
                    className="w-full min-w-[120px]"
                  />
                  <Button
                    text={'Reject'}
                    textColor={'text-white'}
                    bgColor={'bg-red-500'}
                    bgHover={'hover:bg-red-400'}
                    isLoading={isLoading}
                    htmlType={'button'}
                    onClick={handleReject}
                    className="w-full min-w-[120px]"
                  />
                </div>
              ) : status === 'CONFIRMED' ? (
                <div className="flex flex-col gap-3">
                  <Button
                    text={'Accepted'}
                    textColor={'text-white'}
                    bgColor={'bg-green-500'}
                    bgHover={'hover:bg-green-400'}
                    htmlType={'button'}
                    acHover={'hover:cursor-not-allowed'}
                    className="w-full min-w-[120px]"
                  />
                  <Button
                    text={'Cancel'}
                    textColor={'text-white'}
                    bgColor={'bg-gray-500'}
                    bgHover={'hover:bg-gray-400'}
                    htmlType={'button'}
                    isLoading={isLoading}
                    onClick={handleCancelMentor}
                    className="w-full min-w-[120px]"
                  />
                </div>
              ) : status === 'CANCELLED' ? (
                <Button
                  text={'Canceled'}
                  textColor={'text-white'}
                  bgColor={'bg-gray-500'}
                  bgHover={'hover:bg-gray-400 hover:cursor-not-allowed'}
                  htmlType={'button'}
                  className="w-full min-w-[120px]"
                />
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    text={'Rejected'}
                    textColor={'text-white'}
                    bgColor={'bg-red-500'}
                    bgHover={'hover:bg-red-400'}
                    htmlType={'button'}
                    acHover={'hover:cursor-not-allowed'}
                    className="w-full min-w-[120px]"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {status === 'PENDING' ? (
                <Button
                  text={'PENDING'}
                  textColor={'text-white'}
                  bgColor={'bg-yellow-500'}
                  bgHover={'hover:bg-yellow-400'}
                  htmlType={'button'}
                  acHover={'hover:cursor-not-allowed'}
                  className="w-full min-w-[120px]"
                />
              ) : status === 'CONFIRMED' ? (
                <div className="flex flex-col w-full gap-3">
                  <Button
                    text={'Accepted'}
                    textColor={'text-white'}
                    bgColor={'bg-green-500'}
                    bgHover={'hover:bg-green-400'}
                    htmlType={'button'}
                    className="w-full min-w-[120px]"
                    acHover={'hover:cursor-not-allowed'}
                  />
                  <Button
                    text={'Cancel'}
                    textColor={'text-white'}
                    bgColor={'bg-gray-500'}
                    bgHover={'hover:bg-gray-400'}
                    htmlType={'button'}
                    className="w-full min-w-[120px]"
                    acHover={'hover:cursor-pointer'}
                    isLoading={isLoading}
                    onClick={handleCancelStudent}
                  />
                </div>
              ) : status === 'CANCELLED' ? (
                <Button
                  text={'Canceled'}
                  textColor={'text-white'}
                  bgColor={'bg-gray-500'}
                  bgHover={'hover:bg-gray-400 hover:cursor-not-allowed'}
                  htmlType={'button'}
                  className="w-full min-w-[120px]"
                />
              ) : (
                <Button
                  text={'Rejected'}
                  textColor={'text-white'}
                  bgColor={'bg-red-500'}
                  bgHover={'hover:bg-red-400'}
                  htmlType={'button'}
                  className="w-full min-w-[120px]"
                  acHover={'hover:cursor-not-allowed'}
                />
              )}
            </>
          )}
        </div>
      </div>
      <Modal
        title="Reason Cancel"
        open={isOpen}
        onCancel={handleCancel}
        onOk={handleOkReasonCancel}
        width={1000}
        style={{ top: 200 }}
      >
        <Form form={form}>
          <Form.Item
            label="Reason"
            name="reason"
            rules={[
              {
                required: true,
                message: 'Please input reason cancel!'
              }
            ]}
          >
            <Input.TextArea rows={10} placeholder="Enter your reason cancel!!!" onChange={handleOnChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

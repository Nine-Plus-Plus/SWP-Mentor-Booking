import React, { memo, useEffect, useState } from 'react';
import { Button } from '../index';
import clsx from 'clsx';
import icons from '../../utils/icon';
import { useNavigate } from 'react-router-dom';
import path from '../../utils/path';
import Swal from 'sweetalert2';
import { useUserStore } from '../../store/useUserStore';
import { calculatePointDeduction, convertDateMeeting } from '../../utils/commonFunction';
import { createBooking } from '../../apis/BookingServices';
import { toast } from 'react-toastify';
import { addNewMember, removeMember } from '../../apis/GroupServices';
import { createNoti } from '../../apis/NotificationServices';
import { message } from 'antd';

const UserItem = ({
  avatar,
  roleItem,
  name,
  code,
  specialized,
  gender,
  addGroup,
  showSchedule,
  star,
  sameClass,
  isAdded,
  idUser,
  schedule,
  groupRole,
  idStudent,
  mentorAdd,
  studentDel,
  idGroup,
  onRemoveSuccess,
  groupName,
  studentAdd,
  accept
}) => {
  const { FaStar, FaStarHalf, FaSignInAlt } = icons;
  const [added, setAdded] = useState(false);
  const [selectMeeting, setSelectMeeting] = useState('');
  const { role, fullData, userData, setFullDAta } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleStar = star => {
    let stars = [];
    if (star > 0) for (let i = 1; i <= star; i++) stars.push(<FaStar color="#F8D72A" className="start-item" />);
    if (star > 0 && star % 1 !== 0) stars.push(<FaStarHalf color="#F8D72A" className="start-item" />);
    return stars;
  };

  const handleAddMember = async () => {
    const token = localStorage.getItem('token');
    try {
      const addMemberData = {
        id: idStudent
      };
      setIsLoading(true);
      const response = await addNewMember(addGroup, addMemberData, token);
      if (response?.statusCode === 200) {
        Swal.fire({
          title: 'Added Successful!',
          text: `Add student to new  group successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000, // Đóng sau 3 giây
          timerProgressBar: true, // Hiển thị progress bar khi đếm thời gian,
          reverseButtons: true // Đảo ngược vị trí các nút
        });
        const dataSent = {
          message: `Mentor ${userData.user.fullName} added you to the group: ${groupName} !`,
          type: 'MESSAGE',
          sender: {
            id: userData.user.id
          },
          reciver: {
            id: idStudent
          },
          groupDTO: {
            id: addGroup
          }
        };
        handleCreateNoti(dataSent);
        setAdded(true);
      } else toast.error(response?.message);
    } catch (error) {
      toast.error(message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotiAddMember = async addMemberData => {
    const token = localStorage.getItem('token');
    try {
      setIsLoading(true);
      const response = await createNoti(addMemberData);
      if (response?.statusCode === 200) {
        Swal.fire({
          title: 'Invitation Sent!',
          text: 'Invite sent successfully to the student.',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: true,
          reverseButtons: true // Đảo ngược vị trí các nút
        });
        setAdded(true);
      } else toast.error(response?.message);
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async removeId => {
    const token = localStorage.getItem('token');
    try {
      const removeData = {
        id: removeId
      };
      const response = await removeMember(idGroup, removeData, token);
      console.log(response);
      if (response?.statusCode === 200) {
        Swal.fire({
          title: 'Remove Successfully!',
          text: 'Remove the student successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: true,
          reverseButtons: true // Đảo ngược vị trí các nút
        });
        const dataSent = {
          message: `Leader ${userData.user.fullName} remove you from group: ${groupName} !`,
          type: 'MESSAGE',
          sender: {
            id: userData.user.id
          },
          reciver: {
            id: idUser
          },
          groupDTO: {
            id: idGroup
          }
        };
        handleCreateNoti(dataSent);
        onRemoveSuccess();
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleClickRemove = id => {
    Swal.fire({
      title: 'Are you sure?', // Tiêu đề của hộp thoại
      text: 'Remove student from group!', // Nội dung chính của hộp thoại
      icon: 'warning', // Hiển thị biểu tượng cảnh báo
      showCancelButton: true, // Hiển thị nút hủy
      confirmButtonText: 'Yes, remove', // Văn bản nút xác nhận
      confirmButtonColor: '#dd6633',
      cancelButtonText: 'No, cancel.', // Văn bản nút hủy
      reverseButtons: false // Đảo ngược vị trí các nút
    }).then(result => {
      if (result.isConfirmed) {
        handleRemove(id);
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

  const handleClickAddClick = () => {
    Swal.fire({
      title: 'Are you sure?', // Tiêu đề của hộp thoại
      text: 'Add student in Group!', // Nội dung chính của hộp thoại
      icon: 'warning', // Hiển thị biểu tượng cảnh báo
      showCancelButton: true, // Hiển thị nút hủy
      confirmButtonText: 'Yes, Update', // Văn bản nút  xác nhận
      confirmButtonColor: '#dd6633',
      cancelButtonText: 'No, cancel.', // Văn bản nút hủy
      reverseButtons: false // Đảo ngược vị trí các nút
    }).then(result => {
      if (result.isConfirmed) {
        if (mentorAdd) {
          handleAddMember();
        } else {
          const dataSent = {
            message: `Student ${userData.user.fullName} want invite you to group: ${groupName} !`,
            type: 'ADDGROUP',
            sender: {
              id: studentAdd
            },
            reciver: {
              id: idUser
            },
            groupDTO: {
              id: addGroup
            }
          };
          handleNotiAddMember(dataSent);
        }
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
    }
  };

  const handleCreateBooking = async (bookingData, meeting) => {
    const token = localStorage.getItem('token');
    try {
      setIsLoading(true);
      const response = await createBooking(bookingData, token);
      console.log(response);
      if (response?.statusCode === 200) {
        Swal.fire({
          title: 'Booking Successful!',
          text: `Your schedule ${meeting} has been booked successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000, // Đóng sau 3 giây
          timerProgressBar: true // Hiển thị progress bar khi đếm thời gian
        });
        const dataSent = {
          message: `${userData.user.fullName} want book your schedule: ${convertDateMeeting(selectMeeting)}!`,
          type: 'BOOKING',
          sender: {
            id: userData.user.id
          },
          reciver: {
            id: idUser
          },
          groupDTO: {
            id: fullData.groupDTO.id
          },
          bookingDTO: {
            id: response.bookingDTO.id
          }
        };
        handleCreateNoti(dataSent);
      } else
        Swal.fire({
          title: 'Booking Failed!',
          text: `${response?.message}`, // Hiển thị thông báo lỗi
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingClick = () => {
    if (userData?.groupRole !== 'LEADER') {
      Swal.fire({
        title: 'Error!', // Tiêu đề thông báo
        text: 'You must be the group leader to schedule.', // Nội dung thông báo
        icon: 'error', // Biểu tượng lỗi
        confirmButtonText: 'OK', // Văn bản nút xác nhận
        confirmButtonColor: '#d33', // Màu nút xác nhận
        timer: 2000, // Thời gian tự động đóng sau 5 giây
        timerProgressBar: true // Hiển thị progress bar
      });
      return;
    }
    if (selectMeeting) {
      Swal.fire({
        title: 'Are you sure?',
        html: `Are you sure to book the meeting?<br><br>Price: <span style="color: red;">${calculatePointDeduction(
          selectMeeting?.availableFrom,
          selectMeeting?.availableTo,
          fullData?.groupDTO?.students?.length
        )}</span><span style="color: orange;">  FUP</span><br><br>Schedule: <span style="color: green;">${convertDateMeeting(
          selectMeeting
        )}</span>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, booking it',
        confirmButtonColor: '#dd6633',
        cancelButtonText: 'No, cancel!',
        reverseButtons: false // Đảo ngược vị trí của nút xác nhận và hủy
      }).then(result => {
        if (result.isConfirmed) {
          const bookingData = {
            mentorSchedule: {
              id: selectMeeting.id
            },
            group: {
              id: fullData?.groupDTO?.id
            }
          };
          handleCreateBooking(bookingData, convertDateMeeting(selectMeeting));
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: 'Cancelled',
            text: 'Cancelled this booking!',
            icon: 'error',
            confirmButtonText: 'OK', // Văn bản nút xác nhận
            confirmButtonColor: '#d33' // Màu nút xác nhận
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Error!', // Tiêu đề thông báo
        text: 'Please select a meeting before booking.', // Nội dung thông báo
        icon: 'error', // Biểu tượng lỗi
        confirmButtonText: 'OK', // Văn bản nút xác nhận
        confirmButtonColor: '#d33', // Màu nút xác nhận
        timer: 5000, // Thời gian tự động đóng sau 5 giây
        timerProgressBar: true // Hiển thị progress bar
      });
    }
  };

  return (
    <div className="border shadow-md rounded-md h-[180px]">
      <div className="h-[179px] flex w-full gap-4">
        <div className="w-[180px]">
          <img
            src={avatar ? avatar : '/public/avatar1.jpg'}
            alt="avatar"
            className="object-cover w-[160px] h-full rounded-md"
          />
        </div>
        <div className="flex items-center justify-between w-full p-3">
          <div className="flex flex-col h-full gap-3 w-4/12">
            <div className="flex items-center gap-1">
              <h1
                className={clsx(
                  'font-bold text-xl',
                  roleItem === 'Mentor' && 'text-red-500',
                  sameClass && 'bg-yellow-400 p-1 rounded-md',
                  groupRole === 'LEADER' && 'text-red-500'
                )}
              >
                {roleItem}
              </h1>
              <div className="flex">
                {handleStar(star).length > 0 &&
                  handleStar(star).map((star, number) => {
                    return <span key={number}>{star}</span>;
                  })}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-md">
              <p>
                <span className="font-bold">{roleItem === 'Mentor' ? 'Mentor' : 'Student'} name: </span>
                {name}
              </p>
              {code && (
                <p>
                  <span className="font-bold">{roleItem === 'Mentor' ? 'Mentor' : 'Student'} code: </span>
                  {code}
                </p>
              )}
              <p>
                <span className="font-bold">{roleItem === 'Mentor' ? 'Skill' : 'Specialized'}:</span> {specialized}
              </p>
              <p>
                <span className="font-bold">Gender: </span>
                {gender}
              </p>
            </div>
          </div>

          {showSchedule && role !== 'MENTOR' ? (
            <div className="flex flex-col h-full gap-3 w-5/12">
              <div className="flex">
                <h1 className="font-bold text-xl text-white bg-blue-400 p-1 rounded-md ">Schedule</h1>
              </div>
              <div className="max-h-52 overflow-y-auto border border-gray-300 rounded-lg p-4">
                <div className="flex flex-col gap-2 text-md">
                  <div className="flex flex-col gap-2 text-md">
                    {schedule &&
                      schedule.map((meeting, index) => (
                        <div key={meeting.id} className="flex items-center">
                          <input
                            type="radio"
                            id={meeting.id}
                            name="meeting"
                            value={meeting.name}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                            onChange={() => setSelectMeeting(meeting)}
                          />
                          <label htmlFor={meeting.id}>{convertDateMeeting(meeting, index + 1)}</label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            schedule &&
            role !== 'MENTOR' && (
              <div className="flex flex-col h-full gap-3 w-5/12">
                <div className="flex">
                  <h1 className="font-bold text-xl text-white bg-blue-400 p-1 rounded-md ">Schedule</h1>
                </div>
                <div className="text-red-500">no schedule yet</div>
              </div>
            )
          )}
          <div className="flex flex-col gap-2">
            <div className="w-[13vw]">
              {!addGroup && (
                <Button
                  text={'View Detail'}
                  fullWidth={'w-full'}
                  htmlType={'button'}
                  bgColor={'bg-orange-500'}
                  textColor={'text-white'}
                  textSize={'text-sm'}
                  bgHover={'hover:bg-orange-400 hover:text-gray-100'}
                  to={`${path.USER_PROFILE}/${roleItem}/${idUser}`}
                />
              )}
            </div>
            {showSchedule && role === 'STUDENT' && (
              <div className="w-[13vw]">
                <Button
                  text={'Booking'}
                  fullWidth={'w-full'}
                  htmlType={'button'}
                  bgColor={'bg-blue-500'}
                  textColor={'text-white'}
                  textSize={'text-sm'}
                  bgHover={'hover:bg-blue-400 hover:text-gray-100'}
                  isLoading={isLoading}
                  onClick={handleBookingClick}
                />
              </div>
            )}
            {addGroup &&
              (!added && !isAdded ? (
                <div className="w-[13vw]">
                  <Button
                    text={'Add'}
                    fullWidth={'w-full'}
                    htmlType={'button'}
                    bgColor={'bg-green-500'}
                    textColor={'text-white'}
                    textSize={'text-sm'}
                    bgHover={'hover:bg-green-400 hover:text-gray-100'}
                    isLoading={isLoading}
                    onClick={() => {
                      handleClickAddClick();
                    }}
                  />
                </div>
              ) : (
                <div className="w-[13vw]">
                  <Button
                    text={'Added'}
                    fullWidth={'w-full'}
                    htmlType={'text'}
                    bgColor={'bg-gray-500'}
                    textColor={'text-white'}
                    textSize={'text-sm'}
                    acHover={'cursor-not-allowed'}
                  />
                </div>
              ))}
            {userData?.groupRole === 'LEADER' && studentDel && groupRole !== 'LEADER' && (
              <div className="w-[13vw]">
                <Button
                  text={'Remove'}
                  fullWidth={'w-full'}
                  htmlType={'button'}
                  bgColor={'bg-red-500'}
                  textColor={'text-white'}
                  textSize={'text-sm'}
                  bgHover={'hover:bg-red-400 hover:text-gray-100'}
                  isLoading={isLoading}
                  onClick={() => {
                    handleClickRemove(studentDel);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(UserItem);

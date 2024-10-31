import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useParams } from 'react-router-dom';
import { Pagination, Modal, Input, Form } from 'antd';
import { convertDateMeeting } from '../../utils/commonFunction';
import Button from './Button';
import Rating from '@mui/material/Rating';
import { Stack } from '@mui/material';
import { toast } from 'react-toastify';
import { createReview } from '../../apis/ReviewServices';
import { getMeetingByUserId } from '../../apis/MeetingServices';
import TextArea from 'antd/es/input/TextArea';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Meeting = () => {
  const { role, userData } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name, id } = useParams();
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [isReviewed, setIsReviewed] = useState(false);

  let roleProfile = name ? name.toUpperCase() : role;

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchAllMeeting = async () => {
      let response;
      try {
        response = await getMeetingByUserId(userData?.user?.id, token);
        console.log(response);
        if (response?.statusCode === 200) {
          const meetingExceptCancelled = response?.meetingDTOList.filter(meeting => meeting.status !== 'CANCELLED');
          setMeetings(meetingExceptCancelled);
        } else setMeetings([]);
      } catch (error) {
        console.log('Meeting Error: ', response.message);
      }
    };
    userData?.user?.id && fetchAllMeeting();
  }, [userData?.user?.id, isReviewed]);

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({ rating: '5', comment: '' }); // Đặt giá trị rating và comment ban đầu
    }
  }, [isModalOpen]);

  //// Review
  const handleReviewSent = async data => {
    const token = localStorage.getItem('token');
    console.log(data);
    let response;
    try {
      response = await createReview(data, token);
      console.log(response);
      if (response?.statusCode === 200) {
        Swal.fire({
          title: 'Review Successful!',
          text: `Your review has been sent successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true
        });
        setIsReviewed(true);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(response.message);
    }
  };
  const handleCreateReview = async () => {
    const values = await form.validateFields();
    Swal.fire({
      title: 'Are you sure?',
      html: `Are you sure submit this review?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit!',
      confirmButtonColor: '#dd6633',
      cancelButtonText: 'No, cancel!',
      reverseButtons: false // Đảo ngược vị trí
    }).then(result => {
      if (result.isConfirmed) {
        let createData;
        if (userData?.user?.role?.roleName === 'STUDENT') {
          createData = {
            ...values,
            user: {
              id: userData?.user?.id
            },
            userReceive: {
              id: selectedMeeting?.booking?.mentor?.user?.id
            },
            meeting: {
              id: selectedMeeting?.id
            }
          };
          handleReviewSent(createData);
        } else {
          selectedMeeting?.booking?.group?.students?.map(student => {
            createData = {
              ...values,
              user: {
                id: userData?.user?.id
              },
              userReceive: {
                id: student?.user?.id
              },
              meeting: {
                id: selectedMeeting?.id
              }
            };
            handleReviewSent(createData);
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Cancelled this action!',
          icon: 'error',
          confirmButtonText: 'OK', // Văn bản nút xác nhận
          confirmButtonColor: '#d33' // Màu nút xác nhận
        });
      }
    });
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    form.setFieldValue({ rating: newValue });
  };

  const handleCommentChange = event => {
    setComment(event.target.value);
  };

  useEffect(() => {
    return setIsReviewed(
      selectedMeeting?.reviews && selectedMeeting?.reviews?.find(review => review?.user_id?.id === userData?.user?.id)
        ? true
        : false
    );
  }, [selectedMeeting, userData]);

  useEffect(() => {
    console.log(isReviewed);
  }, [isReviewed]);

  const currentMeeting = meetings.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => {
    currentMeeting?.length > 0 ? setSelectedMeeting(currentMeeting[0]) : setSelectedMeeting(null);
  }, [currentMeeting.length]);

  // Handler for page change
  const onPageChange = page => {
    setCurrentPage(page);
  };

  return (
    <div className="flex-col">
      {/* Content */}
      <div className="flex gap-3 pt-2 ">
        {/* Profile info */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
          {selectedMeeting && currentMeeting && currentMeeting.length > 0 ? (
            <div className="flex flex-col items-center">
              {roleProfile === 'STUDENT' ? (
                // Hiển thị thông tin mentor nếu roleProfile là 'STUDENT'
                <div className="flex flex-col items-center">
                  <img
                    src={selectedMeeting.booking.mentor.user.avatar || 'MentorAvatar'}
                    className="w-16 h-16 rounded-full mb-4"
                    alt="Mentor"
                  />
                  <div className="text-center">
                    <h2 className="font-bold">{selectedMeeting.booking.mentor.user.fullName || 'MentorName'}</h2>
                    <p className="text-gray-500">{selectedMeeting.booking.mentor.mentorCode || 'MentorCode'}</p>
                  </div>
                </div>
              ) : (
                // Hiển thị thông tin leader nếu roleProfile không phải là 'STUDENT'
                selectedMeeting.booking.group?.students?.map(student =>
                  student?.groupRole === 'LEADER' ? (
                    <div key={student?.id} className="flex flex-col items-center">
                      <img
                        src={student?.user?.avatar || 'Leader Avatar'}
                        className="w-16 h-16 rounded-full mb-4"
                        alt="Leader"
                      />
                      <div className="text-center">
                        <h2 className="font-bold">{student?.user?.fullName || 'Leader Name'}</h2>
                        <p className="text-gray-500">{student?.studentCode || 'Leader Code'}</p>
                      </div>
                    </div>
                  ) : null
                )
              )}
            </div>
          ) : (
            <p className="flex justify-center align-content text-red-500">
              There is no Meeting, Please choose your Meeting information
            </p>
          )}

          {/* Thông tin chi tiết */}
          {selectedMeeting && (
            <div className="bg-white mt-5 flex flex-col gap-3 w-full">
              <p className="font-bold text-xl">Information</p>
              {roleProfile === 'STUDENT' ? (
                <div className="flex flex-col gap-2">
                  <div className="bg-gray-100 p-3 rounded-2xl g-5 mb-2">
                    Mentor Star: {selectedMeeting.booking.mentor.star}
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl g-5 mb-2">
                    Schedule: {convertDateMeeting(selectedMeeting.booking.mentorSchedule)}
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl g-5 mb-2">
                    PointPay: {selectedMeeting.booking.pointPay} FUP
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-gray-100 p-3 rounded-2xl g-5 mb-2">
                    Group Name: {selectedMeeting.booking.group.groupName}
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl g-5 mb-2">
                    Class: {selectedMeeting.booking.group.classDTO.className}
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl g-5 mb-2">
                    Total member: {selectedMeeting.booking.group.students.length}
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl g-5 mb-2">
                    Schedule: {convertDateMeeting(selectedMeeting.booking.mentorSchedule)}
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl g-5 mb-2">
                  PointPay: {selectedMeeting.booking.pointPay} FUP
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <a
                  href={selectedMeeting.linkURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={twMerge(
                    clsx(
                      'self-start px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:scale-105 hover:text-white',
                      selectedMeeting.status === 'COMPLETED' && 'bg-gray-500 cursor-not-allowed'
                    )
                  )}
                  onClick={e => {
                    if (selectedMeeting.status === 'COMPLETED') {
                      e.preventDefault();
                    }
                  }}
                >
                  Join Meeting
                </a>
                <Button
                  text={!isReviewed ? 'Review' : 'Reviewed'}
                  htmlType={!isReviewed ? 'button' : 'text'}
                  bgColor={!isReviewed ? 'bg-orange-500' : 'bg-gray-500'}
                  textColor={'text-white'}
                  textSize={'text-sm'}
                  bgHover={'hover:text-gray-100'}
                  onClick={!isReviewed ? () => setIsModalOpen(true) : undefined}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="flex-col w-1/2">
          <div className="flex-col bg-white rounded-lg shadow-lg p-8 ">
            <h3 className="font-bold text-xl mb-3">Project onboarding</h3>
            {selectedMeeting ? (
              <>
                <p className="text-gray-500 mb-2">
                  <span className="font-bold">Topic:</span> {selectedMeeting?.booking?.group?.project?.topic?.topicName}
                </p>
                <p className="text-gray-500 mb-2">
                  <span className="font-bold">Project:</span> {selectedMeeting?.booking?.group?.project?.projectName}
                </p>
                <p className="text-gray-500 mb-2">
                  <span className="font-bold">Percentage:</span> {selectedMeeting?.booking?.group?.project?.percentage}%
                </p>
              </>
            ) : (
              <p className="text-gray-500 mb-2">No booking yet</p>
            )}
          </div>

          {/* Meeting */}
          <div className="gap-3 pt-5">
            <div className="flex-col bg-white rounded-lg shadow-lg p-8 h-[60vh]">
              <Pagination
                align="end"
                current={currentPage}
                pageSize={pageSize}
                total={meetings?.length}
                onChange={onPageChange}
              />
              <div className="mb-3">
                <h3 className="font-bold text-xl">Meeting Infomation</h3>
              </div>
              <div>
                {currentMeeting?.length === 0 ? (
                  <p>You have not had any meeting yet</p>
                ) : (
                  currentMeeting?.map(meeting => (
                    <div
                      key={meeting.id}
                      className="flex text-left items-center gap-4 mb-3 cursor-pointer"
                      onClick={() => setSelectedMeeting(meeting)} // Lưu thông tin mentor đã chọn
                    >
                      {roleProfile === 'STUDENT' ? (
                        <>
                          <img
                            src={meeting.booking.mentor.user.avatar}
                            className="w-10 h-10 rounded-full"
                            alt="Mentor"
                          />
                          <div>
                            <p className="font-semibold">
                              <span className="font-bold">Mentor: </span>
                              {meeting.booking.mentor.user.fullName}
                            </p>
                            <p className="text-gray-500">
                              <span className="font-bold">Skill: </span>
                              {meeting.booking.mentor.skills.map(skill => skill.skillName).join(', ')}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={
                              meeting.booking.group.students.find(student => student.groupRole === 'LEADER')?.user
                                ?.avatar
                            }
                            className="w-8 h-8 rounded-full"
                            alt="Mentor"
                          />
                          <div>
                            <p className="font-semibold">Group: {meeting.booking.group.groupName}</p>
                            <p className="text-gray-500">
                              <span className="font-bold">Class:</span> {meeting.booking.group.classDTO.className}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={'Review'}
        open={isModalOpen}
        onCancel={() => {
          form.resetFields();
          setIsModalOpen(false);
          setComment('');
          setRating(5);
        }}
        style={{ top: 50 }}
        footer={null}
      >
        <Form className="bg-white p-8 rounded-lg w-full max-w-md" form={form} onFinish={handleCreateReview}>
          <h2 className="text-3xl font-bold text-center mb-4">
            How are you feeling about
            {roleProfile === 'STUDENT' ? (
              <span>Mentor: {selectedMeeting?.booking.mentor.user.fullName}</span>
            ) : (
              <span>Group: {selectedMeeting?.booking.group.groupName}</span>
            )}
            ?
          </h2>
          <p className="text-center mb-4 text-gray-400 text-sm">
            Your input is valuable in helping us better understand your needs and tailor our service accordingly.
          </p>
          {roleProfile === 'STUDENT' && (
            <Form.Item
              name="rating" // Thêm thuộc tính name
              rules={[
                {
                  required: true,
                  message: 'Please rating!!!'
                }
              ]}
            >
              <Stack spacing={2} className="mb-6">
                <div className="flex justify-center mb-6">
                  <Rating
                    name="Review-rating"
                    value={rating}
                    precision={0.5}
                    onChange={handleRatingChange}
                    size="large"
                  />
                </div>
              </Stack>
            </Form.Item>
          )}
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: 'Please comment!!!'
              }
            ]}
          >
            <TextArea
              className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="6"
              placeholder="Add a Comment..."
              value={comment}
              onChange={handleCommentChange}
            />
          </Form.Item>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 px-4 rounded-lg hover:from-orange-500 hover:to-orange-700 transition-all"
          >
            Submit Now
          </button>
          <button
            type="button"
            className="w-full mt-2 text-gray-500 py-2"
            onClick={() => {
              form.resetFields();
              setIsModalOpen(false);
              setComment(''); // Đặt lại giá trị comment
              setRating(5); // Đặt lại giá trị rating
            }}
          >
            Cancel
          </button>
        </Form>
      </Modal>
    </div>
  );
};

export default Meeting;

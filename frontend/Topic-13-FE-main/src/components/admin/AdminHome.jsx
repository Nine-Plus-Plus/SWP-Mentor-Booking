import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { getAllBookingBySemesterId, getAllBookingByStats } from '../../apis/BookingServices';
import { getAllGroup, getAllGroupBySemesterId } from '../../apis/GroupServices';
import { getAllSemester } from '../../apis/SemesterServices';
import { Select } from 'antd';
import { getAllMentors } from '../../apis/MentorServices';
import { getStudents, getStudentsBySemesterId } from '../../apis/StudentServices';
import { getTopicByIdSemester } from '../../apis/TopicServices';

export const AdminHome = () => {
  const [mentorRatings, setMentorRatings] = useState([]);
  const [totalMentors, setTotalMentors] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalTopics, setTotalTopics] = useState(0);
  const [totalGroups, setTotalGroups] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const token = localStorage.getItem('token');
  const [bookingStatus, setBookingStatus] = useState({
    CONFIRMED: 0,
    REJECTED: 0,
    PENDING: 0,
    CANCELLED: 0
  });

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
    const fetchAllBooking = async () => {
      const response = await getAllBookingBySemesterId(selectedSemester, token);
      if (response?.statusCode === 200) {
        response.bookingDTOList.map(booking => {
          const { status } = booking;
          setBookingStatus(prev => ({
            ...prev,
            [status]: (prev[status] || 0) + 1
          }));
        });
        setTotalBookings(prevTotal => prevTotal + response.bookingDTOList.length);
      } else
        setBookingStatus({
          CONFIRMED: 0,
          REJECTED: 0,
          PENDING: 0,
          CANCELLED: 0
        });
    };
    setTotalBookings(0);
    fetchAllBooking();
  }, [selectedSemester]);

  useEffect(() => {
    const fetchAllStudent = async () => {
      const response = await getStudentsBySemesterId(selectedSemester, '', token);
      if (response?.statusCode === 200) {
        setTotalStudents(prevTotal => prevTotal + response.studentsDTOList.length);
      }
    };
    setTotalStudents(0);
    fetchAllStudent();
  }, [selectedSemester]);

  useEffect(() => {
    const fetchAllGroup = async () => {
      const response = await getAllGroupBySemesterId(selectedSemester, token);
      if (response?.statusCode === 200) {
        setTotalGroups(prevTotal => prevTotal + response.groupDTOList.length);
      }
    };
    setTotalGroups(0);
    fetchAllGroup();
  }, [selectedSemester]);

  useEffect(() => {
    const fetchAllTopic = async () => {
      const response = await getTopicByIdSemester(selectedSemester, '', token);
      if (response?.statusCode === 200) {
        setTotalTopics(prevTotal => prevTotal + response.topicDTOList.length);
      }
    };
    setTotalTopics(0);
    fetchAllTopic();
  }, [selectedSemester]);

  useEffect(() => {
    const fetchAllMentor = async () => {
      const response = await getAllMentors('', token);
      if (response?.statusCode === 200) {
        setTotalMentors(prevTotal => prevTotal + response.mentorsDTOList.length);
        const rating = response?.mentorsDTOList?.map(mentor => mentor.star);
        setMentorRatings(rating);
      }
    };
    setTotalMentors(0);
    fetchAllMentor();
  }, []);

  // Set giá trị star đến số gần nhất
  const roundStarRating = rating => {
    if (rating < 0.25) return 0;
    if (rating < 0.75) return 0.5;
    if (rating < 1.25) return 1;
    if (rating < 1.75) return 1.5;
    if (rating < 2.25) return 2;
    if (rating < 2.75) return 2.5;
    if (rating < 3.25) return 3;
    if (rating < 3.75) return 3.5;
    if (rating < 4.25) return 4;
    if (rating < 4.75) return 4.5;
    return 5;
  };

  const starCounts = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(star => {
    return mentorRatings.filter(rating => roundStarRating(rating) === star).length;
  });

  const barData = {
    labels: [
      '0 Star',
      '0.5 Stars',
      '1 Star',
      '1.5 Stars',
      '2 Stars',
      '2.5 Stars',
      '3 Stars',
      '3.5 Stars',
      '4 Stars',
      '4.5 Stars',
      '5 Stars'
    ],
    datasets: [
      {
        label: 'Number of Mentors',
        backgroundColor: '#4F46E5',
        borderColor: '#3730A3',
        borderWidth: 1,
        hoverBackgroundColor: '#4338CA',
        hoverBorderColor: '#3730A3',
        data: starCounts
      }
    ]
  };

  const barOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Stars',
          font: {
            size: 16,
            weight: 'bold',
            family: 'Arial, sans-serif'
          }
        },
        beginAtZero: true
      },
      y: {
        title: {
          display: true,
          text: 'Number of Mentors',
          font: {
            size: 16,
            weight: 'bold',
            family: 'Arial, sans-serif'
          }
        },
        beginAtZero: true,
        ticks: {
          stepSize: 5
        }
      }
    }
  };

  const pieOptions = {
    maintainAspectRatio: false
  };
  const pieData = {
    labels: ['Accepted', 'Rejected', 'Pending', 'Cancel'],
    datasets: [
      {
        data: [bookingStatus.CONFIRMED, bookingStatus.REJECTED, bookingStatus.PENDING, bookingStatus.CANCELLED],
        backgroundColor: ['#10B981', '#EF4444', '#F59E0B', '#9CA3AF'],
        hoverBackgroundColor: ['#059669', '#DC2626', '#D97706', '#6B7280']
      }
    ]
  };

  if (loading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full mx-auto items-center">
      <h1 className="text-3xl font-bold text-center mb-5 text-gray-800">Admin Dashboard</h1>
      <div className="w-[10vw] mb-3">
        <Select
          placeholder="Select Semester"
          value={selectedSemester}
          onChange={value => setSelectedSemester(value)}
          style={{ backgroundColor: '#F3F4F6', width: '100%' }}
          className="rounded-lg shadow-sm border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
        >
          {semesters?.map(semester => (
            <Select.Option key={semester.id} value={semester.id}>
              {semester.semesterName}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="gap-3 pb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
        <div className="bg-white p-2 rounded-lg border-2 border-sky-500 shadow-2xl flex flex-col items-center">
          <h3 className="text-xl font-semibold">Total Mentors</h3>
          <p className="text-2xl font-bold">{totalMentors}</p>
        </div>
        <div className="bg-white p-2 rounded-lg border-2 border-emerald-500 shadow-2xl flex flex-col items-center">
          <h3 className="text-xl font-semibold">Total Students</h3>
          <p className="text-2xl font-bold">{totalStudents}</p>
        </div>
        <div className="bg-white p-2 rounded-lg border-2 border-purple-500 shadow-2xl flex flex-col items-center">
          <h3 className="text-xl font-semibold">Total Topics</h3>
          <p className="text-2xl font-bold">{totalTopics}</p>
        </div>
        <div className="bg-white p-2 rounded-lg border-2 border-orange-500 shadow-2xl flex flex-col items-center">
          <h3 className="text-xl font-semibold">Total Bookings</h3>
          <p className="text-2xl font-bold">{totalBookings}</p>
        </div>
        <div className="bg-white p-2 rounded-lg border-2 border-yellow-500 shadow-2xl flex flex-col items-center">
          <h3 className="text-xl font-semibold">Total Groups</h3>
          <p className="text-2xl font-bold">{totalGroups}</p>
        </div>
      </div>
      <div className="flex gap-2 h-3/5">
        <div className=" bg-white p-3 rounded-lg shadow-2xl col-span-2 w-7/12">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Mentor Ratings</h2>
          <div style={{ height: '300px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-2xl col-span-1 w-5/12">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Booking Status</h2>
          <div style={{ height: '250px' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
          <ul className="mt-4 text-center">
            <li className="text-green-600 font-medium">
              Accepted: {bookingStatus.CONFIRMED > 0 ? ((bookingStatus.CONFIRMED / totalBookings) * 100).toFixed(2) : 0}
              %
            </li>
            <li className="text-red-600 font-medium">
              Rejected: {bookingStatus.CONFIRMED > 0 ? ((bookingStatus.REJECTED / totalBookings) * 100).toFixed(2) : 0}%
            </li>
            <li className="text-yellow-600 font-medium">
              Pending: {bookingStatus.CONFIRMED > 0 ? ((bookingStatus.PENDING / totalBookings) * 100).toFixed(2) : 0}%
            </li>
            <li className="text-gray-600 font-medium">
              Cancelled:{' '}
              {bookingStatus.CONFIRMED > 0 ? ((bookingStatus.CANCELLED / totalBookings) * 100).toFixed(2) : 0}%
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

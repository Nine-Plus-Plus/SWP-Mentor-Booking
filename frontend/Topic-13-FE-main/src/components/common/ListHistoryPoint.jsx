import React, { useEffect, useRef, useState } from 'react';
import HistoryPointItem from './HistoryPointItem';
import { useUserStore } from '../../store/useUserStore';
import { getGroupHistoryPoint, getHistoryPointByStudentId } from '../../apis/HistoryPointServices';
import { Pagination } from 'antd';

export const ListHistoryPoint = ({ pointHistoryId, status, dateCreated, bookingId }) => {
  const [points, setPoints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const topRef = useRef(null);

  const { userData, setIsUpdate, isUpdate } = useUserStore();

  useEffect(() => {
    setIsUpdate(!isUpdate);
    const token = localStorage.getItem('token');
    const fetchAllHistoryPoint = async () => {
      if (!userData?.id || !token) return;
      try {
        console.log(isUpdate);
        const response = await getHistoryPointByStudentId(userData?.id, token);
        console.log('Response from API:', response);
        if (response?.statusCode === 200) {
          setPoints(response?.pointHistoryDTOList || []);
        } else {
          setPoints([]);
        }
      } catch (error) {
        console.error('Error fetching history points: ', error);
        setPoints([]);
      }
    };

    fetchAllHistoryPoint();
  }, []);

  const onChangePage = page => {
    setCurrentPage(page);
    topRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const currentPoints = points.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-start pr-40">
        <div className="inline-flex px-3 py-1 font-medium text-white bg-main-1 rounded-lg">
          <span>Total Point: {userData?.point}</span>
        </div>
      </div>

      {/* Tạo các HistoryPointItem trực tiếp */}
      <div className="p-3 bg-white rounded-md flex flex-col gap-5" ref={topRef}>
        {currentPoints?.length === 0 ? (
          <p className="text-red-500">Do not have any transaction point!!!</p>
        ) : (
          currentPoints?.map(point => (
            <HistoryPointItem
              key={point?.id}
              dateCreated={point?.dateCreated}
              pointHistoryId={point?.id}
              status={point?.status}
              points={point?.point}
              booking={point?.booking}
              mentorBooking={point?.booking?.mentor?.user?.fullName}
            />
          ))
        )}
        {currentPoints?.length !== 0 && (
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={points.length}
            onChange={onChangePage}
            showSizeChanger={false}
          />
        )}
      </div>
    </div>
  );
};
export default ListHistoryPoint;

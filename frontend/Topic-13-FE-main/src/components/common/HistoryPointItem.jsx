import React, { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { convertDateMeeting, formatDateTransaction } from '../../utils/commonFunction';

export const HistoryPointItem = ({ pointHistoryId, points, status, dateCreated, booking, mentorBooking }) => {
  const [point, setPoints] = useState([]);
  const { userData } = useUserStore;

  return (
    <div className="bg-white flex flex-col gap-5 rounded-md w-full">
      <div className="flex items-center justify-between p-2 rounded-md border-2 shadow-xl w-full">
        <img
          src="https://mentor-booking-images.s3.ap-southeast-2.amazonaws.com/LeetCoin.png"
          alt="transaction icon"
          className="w-12 h-12 rounded-full"
        />
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col pl-5 gap-2 w-1/3">
            <h1 className="font-bold text-xl text-blue-500">{status}</h1>
            <p>
              <span className="font-bold">Mentor Booking: </span>
              <span>{mentorBooking}</span>
            </p>
            <p>
              <span className="font-bold">Schedule Booking: </span>
              <span>{`${convertDateMeeting(booking?.mentorSchedule)}`}</span>
            </p>
          </div>

          <div className="w-1/3 flex justify-center font-semibold ">{formatDateTransaction(dateCreated)}</div>

          <div className="w-1/3 flex justify-end items-start">
            <p className={`font-semibold ${points > 0 ? 'text-blue-500' : 'text-red-500'}`}>
              {points > 0 ? `+${points}` : points} FUP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HistoryPointItem;

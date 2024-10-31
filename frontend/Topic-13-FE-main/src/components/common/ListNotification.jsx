import React, { useEffect, useRef, useState } from 'react';
import NotificationItem from './NotificationItem';
import { useUserStore } from '../../store/useUserStore';
import { getAllNotiByReceiverId } from '../../apis/NotificationServices';
import { formatDate } from '../../utils/commonFunction';
import { Pagination } from 'antd';

const ListNotification = () => {
  const [notis, setNotis] = useState([]);
  const { userData } = useUserStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const topRef = useRef(null);

  useEffect(() => {
    fetchAllNotiByReceiverId();
  }, [userData]);
  const fetchAllNotiByReceiverId = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await getAllNotiByReceiverId(userData?.user?.id, token);
      console.log(response);
      response?.statusCode === 200 ? setNotis(response?.notificationsDTOList) : setNotis([]);
    } catch (error) {
      console.log(error);
    }
  };

  const currentNoti = notis.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const onChangePage = page => {
    setCurrentPage(page);
    topRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full flex flex-col break-words gap-3">
      <div className=" bg-white flex flex-col gap-5 p-3 rounded-md" ref={topRef}>
        {currentNoti?.length === 0 ? (
          <p className="text-red-500">Do not have any notification.</p>
        ) : (
          currentNoti?.map(noti => (
            <NotificationItem
              key={noti?.id}
              notiId={noti?.id}
              type={noti.type}
              senderName={noti?.sender?.fullName}
              content={noti?.message}
              daySent={formatDate(noti?.dateTimeSent)}
              senderId={noti?.sender?.id}
              groupName={noti?.groupDTO?.groupName}
              groupId={noti?.groupDTO?.id}
              studentSenderId={noti?.sender?.student?.id}
              updateActionClick={fetchAllNotiByReceiverId}
              notiAction={noti?.action}
            />
          ))
        )}
        {currentNoti?.length !== 0 && (
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={notis.length}
            onChange={onChangePage}
            showSizeChanger={false}
          />
        )}
      </div>
    </div>
  );
};

export default ListNotification;

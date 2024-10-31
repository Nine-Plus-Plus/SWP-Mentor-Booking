import React, { useEffect, useState } from 'react';
import GroupItem from './GroupItem';
import { useUserStore } from '../../store/useUserStore';
import { getGroupByClassId } from '../../apis/GroupServices';

const ListGroup = () => {
  const [groups, setGroups] = useState([]);
  const { userData } = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchGroupClass = async () => {
      try {
        const classId = userData?.aclass?.id;
        const response = await getGroupByClassId(classId, token);
        console.log(response);

        if (response && response?.statusCode === 200) setGroups(response?.groupDTOList);
        else setGroups([]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGroupClass();
  }, [userData?.aclass?.id]);

  return (
    <div className="flex flex-col gap-3 p-3 bg-white rounded-md">
      <h1 className="text-2xl font-semibold"> Class: {userData?.aclass?.className}</h1>
      <div className="flex flex-col gap-3 p-3 bg-white rounded-md">
        {groups?.length === 0 ? (
          <p className="text-red-500">Do not have any group!</p>
        ) : (
          groups?.map(group => (
            <GroupItem
              key={group?.id}
              idGroup={group?.id}
              groupName={group?.groupName}
              idTopic={group?.project?.topic?.topicName}
              totalPoint={group?.totalPoint}
              process={group?.project?.percentage}
              totalMember={group?.students}
              projectName={group?.project?.projectName}
              leader={group?.students?.find(student => student?.groupRole === 'LEADER')?.user?.fullName}
              leaderId={group?.students?.find(student => student?.groupRole === 'LEADER')?.user?.id}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default ListGroup;

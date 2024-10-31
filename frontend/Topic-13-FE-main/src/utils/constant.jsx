import React from 'react';
import {
  AreaChartOutlined,
  BankOutlined,
  BookOutlined,
  ClockCircleOutlined,
  ContactsOutlined,
  FormOutlined,
  FundProjectionScreenOutlined,
  GroupOutlined,
  HeatMapOutlined,
  HomeOutlined,
  NotificationOutlined,
  ReconciliationOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  TeamOutlined,
  TransactionOutlined,
  UngroupOutlined,
  UserOutlined,
  ToolOutlined
} from '@ant-design/icons';

import { NavLink } from 'react-router-dom';
import path from './path';

export const menuNavbarItemsStudent = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: (
      <NavLink to={'/'} className="text-white">
        Home
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'class',
    icon: <ContactsOutlined />,
    label: (
      <NavLink to={path.USER_VIEW_CLASS} className="text-white">
        Class
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'mentor',
    icon: <SolutionOutlined />,
    label: (
      <NavLink to={path.USER_VIEW_MENTOR} className="text-white">
        Mentor
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'myProject',
    icon: <FundProjectionScreenOutlined />,
    className: 'text-white text-lg',
    label: 'My Project',
    children: [
      {
        key: 'group',
        icon: <TeamOutlined />,
        label: (
          <NavLink to={path.STUDENT_GROUP} className="text-white">
            Group
          </NavLink>
        )
      },
      {
        key: 'progress',
        icon: <AreaChartOutlined />,
        label: (
          <NavLink to={path.STUDENT_PROGRESS} className="text-white">
            Progress
          </NavLink>
        )
      }
    ]
  },
  {
    key: 'notification',
    icon: <NotificationOutlined />,
    label: (
      <NavLink to={path.USER_LIST_NOTIFICATION} className="text-white">
        Notification
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'meeting',
    icon: <ClockCircleOutlined />,
    label: (
      <NavLink to={path.USER_MEETING} className="text-white">
        Meeting
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'booking',
    icon: <ReconciliationOutlined />,
    label: (
      <NavLink to={path.USER_BOOKING} className="text-white">
        Booking
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'point',
    icon: <TransactionOutlined />,
    label: (
      <NavLink to={path.STUDENT_HISTORY_POINT} className="text-white">
        History Point
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'Review',
    icon: <FormOutlined />,
    label: (
      <NavLink to={path.USER_REVIEW} className="text-white">
        Review
      </NavLink>
    ),
    className: 'text-white text-lg'
  }
];

export const menuNavbarItemsMentor = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: (
      <NavLink to={'/'} className="text-white">
        Home
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'class',
    icon: <ContactsOutlined />,
    label: (
      <NavLink to={path.USER_VIEW_CLASS} className="text-white">
        Class
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'group',
    icon: <TeamOutlined />,
    label: (
      <NavLink to={path.LIST_GROUP} className="text-white">
        Group
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'schedule',
    icon: <ClockCircleOutlined />,
    label: (
      <NavLink to={path.MENTOR_SCHEDULE} className="text-white">
        Schedule
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'mentor',
    icon: <SolutionOutlined />,
    label: (
      <NavLink to={path.USER_VIEW_MENTOR} className="text-white">
        Mentor
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'notification',
    icon: <NotificationOutlined />,
    label: (
      <NavLink to={path.USER_LIST_NOTIFICATION} className="text-white">
        Notification
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'meeting',
    icon: <ScheduleOutlined />,
    label: (
      <NavLink to={path.USER_MEETING} className="text-white">
        Meeting
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'booking',
    icon: <ReconciliationOutlined />,
    label: (
      <NavLink to={path.USER_BOOKING} className="text-white">
        Booking
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'Review',
    icon: <FormOutlined />,
    label: (
      <NavLink to={path.USER_REVIEW} className="text-white">
        Review
      </NavLink>
    ),
    className: 'text-white text-lg'
  }
];

export const menuNavbarItemsAdmin = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: (
      <NavLink to={'/'} className="text-white">
        Home
      </NavLink>
    ),
    className: 'text-white text-lg'
  },
  {
    key: 'users-manager',
    icon: <ContactsOutlined />,
    label: 'Users',
    className: 'text-white text-lg',
    children: [
      // Đây là các mục con của Users
      {
        key: 'users-student',
        icon: <UserOutlined />,
        label: (
          <NavLink to={path.ADMIN_STUDENT_MANAGER} className="text-white">
            Student
          </NavLink>
        )
      },
      {
        key: 'users-mentor',
        icon: <UserOutlined />,
        label: (
          <NavLink to={path.ADMIN_MENTOR_MANAGER} className="text-white">
            Mentor
          </NavLink>
        )
      },
      {
        key: 'skill-mentor',
        icon: <HeatMapOutlined />,
        label: (
          <NavLink to={path.ADMIN_SKILL_MANAGER} className="text-white">
            Mentor Skill
          </NavLink>
        )
      }
    ]
  },
  {
    key: 'university-manager',
    icon: <BankOutlined />,
    label: 'University',
    className: 'text-white text-lg',
    children: [
      // Đây là các mục con của
      {
        key: 'semester',
        icon: <GroupOutlined />,
        label: (
          <NavLink to={path.ADMIN_SEMESTER_MANAGER} className="text-white">
            Semester
          </NavLink>
        )
      },
      {
        key: 'class',
        icon: <UngroupOutlined />,
        label: (
          <NavLink to={path.ADMIN_CLASS_MANAGER} className="text-white">
            Class
          </NavLink>
        )
      },
      {
        key: 'topic',
        icon: <BookOutlined />,
        label: (
          <NavLink to={path.ADMIN_TOPIC_MANAGER} className="text-white">
            Topic
          </NavLink>
        )
      }
    ]
  },
  // {
  //   key: 'system-config',
  //   icon: <ToolOutlined />,
  //   label: (
  //     <NavLink to={'/'} className="text-white">
  //        Configuration
  //     </NavLink>
  //   ),
  //   className: 'text-white text-lg'
  // }
];

export const roleForComponent = {
  ADMIN: path.PUBLIC_ADMIN,
  STUDENT: path.PUBLIC_STUDENT,
  MENTOR: path.PUBLIC_MENTOR
};

export const colors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple'
];

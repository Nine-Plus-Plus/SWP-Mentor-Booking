import React from 'react';
import path from './utils/path';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  ClassList,
  Login,
  MentorList,
  UserHome,
  ChangePass,
  OTPInput,
  ForgotPass,
  AdminHome,
  BookingList,
  UserProfile,
  StudentGroup,
  ListGroup,
  ListHistoryPoint,
  StudentManager,
  MentorManager,
  SemesterManager,
  ClassManager,
  SkillManager,
  UserList,
  TopicManager,
  Schedule,
  ListNotification,
  Progress,
  ReviewList
} from './components/index';
import { PublicLayout, PublicAdmin, PublicHome, PublicAboutUs, PublicStudent, PublicMentor } from './pages/index';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from '../src/middlewares/PrivateRoute';
import GuestRoute from '../src/middlewares/GuestRoute';
import { useEffect } from 'react';
import { roleForComponent } from './utils/constant';
import { Meeting } from './components/common/Meeting';
import { useUserStore } from './store/useUserStore';
import { Settings } from './components/common/Settings';

function App() {
  const { token, role, resetUserStore } = useUserStore();
  useEffect(() => {
    if (!localStorage?.getItem('token') || localStorage?.getItem('token') === 'null') resetUserStore();
  }, []);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1000} limit={3} />
      <Routes>
        {/* {!token && <Route path="/" element={<PublicHome />} />} */}
        <Route path="/" element={<Navigate to={!token ? path.PUBLIC : roleForComponent[role]} replace />} />

        {/* Route cho trang public */}
        <Route path={path.PUBLIC} element={<PublicLayout />}>
          <Route index element={<PublicHome />} />
          <Route path={path.ABOUT_US} element={<PublicAboutUs />} />
          <Route path={path.LOGIN} element={<GuestRoute element={Login} />} />
          <Route path={path.FORGOT_PASS} element={<ForgotPass />} />
          <Route path={path.CHANGE_PASS} element={<ChangePass />} />
          <Route path={path.OTP_INPUT} element={<OTPInput />} />
        </Route>

        {/* Route cho trang student */}
        <Route
          path={path.PUBLIC_STUDENT}
          element={
            <PrivateRoute role={role}>
              <PublicStudent />
            </PrivateRoute>
          }
        >
          <Route index element={<UserHome />} />
          <Route path={path.USER_SETTINGS} element={<Settings />} />
          <Route path={path.USER_MEETING} element={<Meeting />} />
          <Route path={path.USER_VIEW_MENTOR} element={<MentorList />} />
          <Route path={path.USER_VIEW_CLASS} element={<ClassList />} />
          <Route path={path.USER_BOOKING} element={<BookingList />} />
          <Route path={path.STUDENT_GROUP} element={<StudentGroup />} />
          <Route path={`${path.STUDENT_GROUP}/${path.USER_PROFILE_NAME_ID}`} element={<UserProfile />} />
          <Route path={path.USER_LIST_NOTIFICATION} element={<ListNotification />} />
          <Route path={`${path.USER_VIEW_CLASS}/${path.USER_PROFILE_NAME_ID}`} element={<UserProfile />} />
          <Route path={`${path.USER_VIEW_MENTOR}/${path.USER_PROFILE_NAME_ID}`} element={<UserProfile />} />
          <Route path={path.USER_PROFILE_NAME_ID} element={<UserProfile />} />
          <Route path={path.USER_PROFILE_ALL} element={<UserProfile />} />
          <Route path={path.STUDENT_PROGRESS} element={<Progress />} />
          <Route path={path.STUDENT_HISTORY_POINT} element={<ListHistoryPoint />} />
          <Route path={path.USER_REVIEW} element={<ReviewList />} />
        </Route>

        {/* Route cho trang mentor */}
        <Route
          path={path.PUBLIC_MENTOR}
          element={
            <PrivateRoute role={role}>
              <PublicMentor />
            </PrivateRoute>
          }
        >
          <Route index element={<UserHome />} />
          <Route path={path.USER_VIEW_CLASS} element={<ClassList />} />
          <Route path={path.LIST_GROUP} element={<ListGroup />} />
          <Route path={`${path.LIST_GROUP}/${path.USER_PROFILE_NAME_ID}`} element={<UserProfile />} />
          <Route path={path.USER_VIEW_MENTOR} element={<MentorList />} />
          <Route path={path.MENTOR_SCHEDULE} element={<Schedule />} />
          <Route path={path.USER_PROFILE_ALL} element={<UserProfile />} />
          <Route path={path.USER_LIST_NOTIFICATION} element={<ListNotification />} />
          <Route path={`${path.USER_VIEW_CLASS}/${path.USER_PROFILE_NAME_ID}`} element={<UserProfile />} />
          <Route path={`${path.USER_VIEW_MENTOR}/${path.USER_PROFILE_NAME_ID}`} element={<UserProfile />} />
          <Route path={path.USER_MEETING} element={<Meeting />} />
          <Route path={path.USER_BOOKING} element={<BookingList />} />
          <Route path={path.USER_REVIEW} element={<ReviewList />} />
          <Route path={path.USER_SETTINGS} element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to={path.PUBLIC} replace />} />

        {/* Route cho trang admin */}
        <Route
          path={path.PUBLIC_ADMIN}
          element={
            <PrivateRoute role={role}>
              <PublicAdmin />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path={path.USER_PROFILE} element={<UserProfile />} />
          <Route path={path.USER_SETTINGS} element={<Settings />} />
          <Route path={path.ADMIN_STUDENT_MANAGER} element={<StudentManager />} />
          <Route path={path.ADMIN_MENTOR_MANAGER} element={<MentorManager />} />
          <Route path={path.ADMIN_SKILL_MANAGER} element={<SkillManager />} />
          <Route path={path.ADMIN_SEMESTER_MANAGER} element={<SemesterManager />} />
          <Route path={path.ADMIN_CLASS_MANAGER} element={<ClassManager />} />
          <Route path={path.ADMIN_TOPIC_MANAGER} element={<TopicManager />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

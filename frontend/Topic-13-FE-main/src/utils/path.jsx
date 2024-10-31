const path = {
  // Public
  HOME: '/*',
  LOGIN: 'login',
  PUBLIC: 'public',
  ABOUT_US: 'about-us',
  FORGOT_PASS: 'forgot-password',
  CHANGE_PASS: 'change-password',
  OTP_INPUT: 'send-recovery-otp',

  // Common User
  USER_SETTINGS: 'settings',
  USER_PROFILE_NAME_ID: 'profile-user/:name/:id',
  USER_PROFILE_ALL: 'profile-user/*',
  USER_PROFILE: 'profile-user',
  LIST_GROUP: 'list-group',
  USER_LIST_NOTIFICATION: 'list-notification',
  USER_VIEW_MENTOR: 'view-mentor',
  USER_VIEW_CLASS: 'view-class',
  USER_MEETING: 'meeting',
  USER_BOOKING: 'booking',
  USER_REVIEW: 'review',

  // Student
  PUBLIC_STUDENT: 'student',  
  STUDENT_GROUP: 'group',
  STUDENT_PROGRESS: 'progress',
  STUDENT_HISTORY_POINT: 'history-point',

  // Mentor
  PUBLIC_MENTOR: 'mentor',
  MENTOR_SCHEDULE: 'schedule',

  // Admin
  PUBLIC_ADMIN: 'admin',
  ADMIN_HOME: 'home',
  ADMIN_STUDENT_MANAGER: 'student-manager',
  ADMIN_MENTOR_MANAGER: 'mentor-manager',
  ADMIN_SEMESTER_MANAGER: 'semester-manager',
  ADMIN_CLASS_MANAGER: 'class-manager',
  ADMIN_SKILL_MANAGER: 'skill-manager',
  ADMIN_TOPIC_MANAGER: 'topic-manager'
};

export default path;

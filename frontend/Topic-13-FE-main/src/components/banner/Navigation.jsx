import React, { memo, useEffect, useState } from 'react';
import { Button, Dropdown, Layout, Menu, Space } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import {
  CaretDownOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';
import icons from '../../utils/icon';
import path from '../../utils/path';
import { useUserStore } from '../../store/useUserStore';
import Swal from 'sweetalert2';
import Loading from '../common/Loading';

const Navigation = ({ children, menuNavbar }) => {
  const { Header, Sider } = Layout;
  const { IoIosNotifications } = icons;
  const [notificationCount, setNotificationCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const { resetUserStore, role, current, userData, avatar } = useUserStore();
  const [collapsed, setCollapsed] = useState(false);
  const { Content } = Layout;
  const location = useLocation();
  const [searchFor, setSearchFor] = useState('');

  useEffect(() => {
    const subPath = location.pathname.split('/');

    if (
      subPath[subPath.length - 1] === 'student' ||
      subPath.push() === path.STUDENT_GROUP ||
      subPath.includes('profile-user')
    )
      setSearchFor('');
    else setSearchFor(subPath.pop());
  }, [location.pathname]);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  const handleLogOut = () => {
    // Hiển thị hộp thoại xác nhận đăng xuất
    Swal.fire({
      title: 'Are you sure?', // Tiêu đề của hộp thoại
      text: 'Log Out Your Account!', // Nội dung chính của hộp thoại
      icon: 'warning', // Hiển thị biểu tượng cảnh báo
      showCancelButton: true, // Hiển thị nút hủy
      confirmButtonText: 'Yes, Log Out', // Văn bản nút xác nhận
      confirmButtonColor: '#dd6633',
      cancelButtonText: 'No, cancel.', // Văn bản nút hủy
      reverseButtons: false // Đảo ngược vị trí các nút
    }).then(result => {
      // Kiểm tra kết quả khi người dùng nhấn vào nút
      if (result.isConfirmed) {
        // Nếu người dùng xác nhận đăng xuất
        resetUserStore(); // Gọi hàm reset trạng thái người dùng (đăng xuất)

        // Hoặc hiển thị một thông báo thành công khác với SweetAlert2 (nếu muốn)
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have successfully logged out.',
          icon: 'success',
          timer: 2000, // Đóng sau 2 giây
          showConfirmButton: false // Ẩn nút OK
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Nếu người dùng hủy
        Swal.fire({
          title: 'Cancelled',
          text: 'Cancelled Log Out!',
          icon: 'error',
          timer: 2000, // Đóng sau 2 giây
          showConfirmButton: false // Ẩn nút OK
        });
      }
    });
  };

  const items = [
    {
      key: 'account',
      label: 'My Account',
      disabled: true
    },
    {
      type: 'divider'
    },
    ...(role !== 'ADMIN'
      ? [
          {
            key: 'profile',
            icon: <UserOutlined />,
            label: (
              <NavLink to={path.USER_PROFILE} className="text-white">
                View Profile
              </NavLink>
            )
          }
        ]
      : []),
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: (
        <NavLink to={path.USER_SETTINGS} className="text-white">
          Settings
        </NavLink>
      )
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Log Out',
      onClick: handleLogOut
    }
  ];

  return (
    <Layout className="bg-gray-300 flex w-3/5 h-screen">
      <Sider className="text-white" collapsed={collapsed}>
        <div className="h-[8vh] flex items-center justify-center py-[1vh] bg-gray-200 ">
          <NavLink
            className="flex items-center h-full"
            to={'/'}
            onClick={() => {
              setVariant('/public');
            }}
          >
            <img
              src="https://mentor-booking-images.s3.ap-southeast-2.amazonaws.com/logoFPT.svg"
              className="object-contain h-full"
              alt="logo"
            />
          </NavLink>
        </div>
        <Menu
          className="h-[92vh] w-full flex flex-col gap-1 text-white font-semibold overflow-auto"
          mode="inline"
          items={menuNavbar}
          theme={role === 'ADMIN' ? 'dark' : 'light'}
          onClick={() => handleClick()}
        />
      </Sider>
      <Layout className="relative">
        <Header className="bg-gray-200 p-0 flex items-center h-[8vh] justify-between">
          <Button
            type="text"
            size="20"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            icon={
              collapsed ? (
                <MenuFoldOutlined style={{ fontSize: 25 }} />
              ) : (
                <MenuUnfoldOutlined style={{ fontSize: 25 }} />
              )
            }
          />
          <div className="flex gap-5 pr-[2rem] items-center">
            {/* <div
              className="relative cursor-pointer"
              onClick={() => {
                setNotificationCount(0);
              }}
            >
              <IoIosNotifications className="text-yellow-600" size={30} />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                  {notificationCount}
                </span>
              )}
            </div> */}
            <div className="flex items-center gap-2 ">
              <Dropdown menu={{ items }} trigger={['click']}>
                <Space>
                  <img src={avatar} alt="avatar" className="object-cover h-[6vh] w-[6vh] rounded-full cursor-pointer" />
                  <CaretDownOutlined />
                </Space>
              </Dropdown>

              <div className="flex flex-col items-center justify-evenly">
                <p className="h-[3vh] text-sm font-semibold">{current}</p>
                <p className="h-[3vh] text-sm">{role}</p>
              </div>
            </div>
          </div>
        </Header>

        {/* Component con */}
        <Content className="p-2 overflow-auto h-[calc(100vh-8vh)] w-full">
          <div>
            {loading ? (
              <Loading /> // Hiển thị component loading
            ) : (
              children // Không cần dấu ngoặc nhọn ở đây
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default memo(Navigation);

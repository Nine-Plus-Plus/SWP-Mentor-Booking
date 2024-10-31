import React, { memo, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import path from '../../utils/path';
import clsx from 'clsx';
import { useUserStore } from '../../store/useUserStore';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const PublicNavigate = () => {
  const navItem = 'text-xl font-semibold text-main-1 text-center w-[150px]';
  const navItemClick = 'border-b-4 border-main-1 font-black';
  const location = useLocation();
  const [variant, setVariant] = useState(location.pathname);
  const { resetUserStore, isLoggedIn } = useUserStore();

  useEffect(() => {
    setVariant(location.pathname);
  }, [location.pathname]);

  const handleLogOut = () => {
    // Hiển thị hộp thoại xác nhận đăng xuất
    Swal.fire({
      title: 'Are you sure?', // Tiêu đề của hộp thoại
      text: 'Log Out Your Account!', // Nội dung chính của hộp thoại
      icon: 'warning', // Hiển thị biểu tượng cảnh báo
      showCancelButton: true, // Hiển thị nút hủy
      confirmButtonText: 'Yes, Log Out', // Văn bản nút xác nhận
      cancelButtonText: 'No, cancel.', // Văn bản nút hủy
      reverseButtons: true // Đảo ngược vị trí các nút
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

  return (
    <div className="w-full h-[8vh] p-2 px-5 flex flex-wrap items-center justify-between border-b">
      <div className=" h-[6vh] flex flex-row items-center">
        <NavLink
          className="flex flex-row items-center h-[6vh] gap-3"
          to={'.'}
          onClick={() => {
            setVariant('/public');
          }}
        >
          <img src="logoFPT.svg" className="object-cover h-full" />
        </NavLink>
      </div>
      <div className="flex gap-5 h-[7vh] ">
        <NavLink
          to={'.'}
          className={clsx(navItem, variant === '/public' && navItemClick)}
          onClick={() => {
            setVariant('/public');
          }}
        >
          <div className="flex items-center justify-center h-[6vh]">
            <span className="text-center">Public Home</span>
          </div>
        </NavLink>
        <NavLink
          to={path.ABOUT_US}
          className={clsx(navItem, variant === '/public/about-us' && navItemClick)}
          onClick={() => {
            setVariant('/public/about-us');
          }}
        >
          <div className="flex items-center justify-center h-[6vh]">
            <span className="text-center">About Us</span>
          </div>
        </NavLink>
        <NavLink
          to={path.LOGIN}
          className={clsx(navItem, variant === '/public/login' && navItemClick)}
          onClick={() => {
            setVariant('/public/login');
          }}
        >
          <div
            className="flex items-center justify-center h-[6vh] gap-2"
            onClick={isLoggedIn ? handleLogOut : undefined}
          >
            <span className="text-center">{isLoggedIn ? 'Log Out' : 'Log In'}</span>
            {isLoggedIn ? <LogoutOutlined /> : <LoginOutlined />}
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default memo(PublicNavigate);

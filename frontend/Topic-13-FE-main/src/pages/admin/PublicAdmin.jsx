import React, { useEffect } from 'react';
import { Navigation } from '../../components/index';
import { Outlet } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { menuNavbarItemsAdmin } from '../../utils/constant';

function PublicAdmin() {
  const { setCurrent } = useUserStore();
  useEffect(() => {
    setCurrent('ADMIN');
  }, []);

  return (
    <div className="w-full flex-wrap flex justify-end">
      <Navigation menuNavbar={menuNavbarItemsAdmin}>
        <Outlet />
      </Navigation>
    </div>
  );
}

export default PublicAdmin;

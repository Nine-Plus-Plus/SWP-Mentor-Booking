import React from 'react';
import PublicNavigate from './PublicNavigate';
import { Outlet } from 'react-router-dom';
import PublicFoot from './PublicFoot';
import { useUserStore } from '../../store/useUserStore';

const PublicLayout = () => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <PublicNavigate />
      <Outlet />
      <PublicFoot />
    </div>
  );
};

export default PublicLayout;

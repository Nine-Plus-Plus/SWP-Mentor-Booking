import React from 'react';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ element: Component }) => {
  const token = localStorage.getItem('token');

  return token ? <Navigate to={'/'} /> : <Component />;
};

export default GuestRoute;

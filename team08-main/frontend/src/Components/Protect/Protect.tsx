import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  allowedRoles: string[]; // บทบาทที่อนุญาต
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const role = localStorage.getItem('Status');
  const token = localStorage.getItem('token');

  if (!token) {
    // กรณีไม่มี token -> ไปหน้า Login
    return <Navigate to="/" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    // กรณีบทบาทไม่ตรง -> ไปหน้า Error หรือ Forbidden
    return <Navigate to="/error" replace />;
  }

  // อนุญาตให้เข้าถึงเส้นทาง
  return <Outlet />;
};

export default PrivateRoute;
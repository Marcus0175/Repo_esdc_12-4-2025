import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user, loading, loadUser } = authContext;

  useEffect(() => {
    // Nếu có token nhưng chưa load thông tin user
    if (localStorage.getItem('token') && !user) {
      loadUser();
    }
  }, []); // Chỉ chạy một lần khi component được mount

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>Đang tải...</div>;
  }

  if (!isAuthenticated || !localStorage.getItem('token')) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/forbidden" />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
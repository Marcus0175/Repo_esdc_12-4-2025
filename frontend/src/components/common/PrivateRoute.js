import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import { Box, CircularProgress } from '@mui/material';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user, loading } = authContext;

  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  if (!user && isAuthenticated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/forbidden" />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
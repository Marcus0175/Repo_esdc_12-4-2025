import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Navbar from './components/layout/Navbar';
import Alert from './components/common/Alert';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CustomerList from './components/customers/CustomerList';
import CustomerForm from './components/customers/CustomerForm';
import TrainerList from './components/trainers/TrainerList';
import TrainerForm from './components/trainers/TrainerForm';
import StaffList from './components/staff/StaffList';
import StaffForm from './components/staff/StaffForm';
import PrivateRoute from './components/common/PrivateRoute';
import AuthContext from './contexts/auth/authContext';

import AuthState from './contexts/auth/AuthState';
import AlertState from './contexts/alert/AlertState';

const AppContent = () => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;

  useEffect(() => {
    // Kiểm tra token và load user data khi ứng dụng khởi động
    if (localStorage.getItem('token')) {
      loadUser();
    }
  }, [loadUser]);

  return (
    <>
      <Navbar />
      <Alert />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Private Routes */}
        <Route
          path="/register"
          element={
            <PrivateRoute
              component={Register}
              roles={['admin', 'receptionist']}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              component={Dashboard}
              roles={['admin', 'receptionist', 'trainer', 'customer']}
            />
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute
              component={CustomerList}
              roles={['admin', 'receptionist']}
            />
          }
        />
        <Route
          path="/customers/add"
          element={
            <PrivateRoute
              component={CustomerForm}
              roles={['admin', 'receptionist']}
            />
          }
        />
        <Route
          path="/customers/edit/:id"
          element={
            <PrivateRoute
              component={CustomerForm}
              roles={['admin', 'receptionist']}
            />
          }
        />
        <Route
          path="/trainers"
          element={
            <PrivateRoute
              component={TrainerList}
              roles={['admin', 'receptionist', 'customer']}
            />
          }
        />
        <Route
          path="/trainers/add"
          element={
            <PrivateRoute
              component={TrainerForm}
              roles={['admin']}
            />
          }
        />
        <Route
          path="/trainers/edit/:id"
          element={
            <PrivateRoute
              component={TrainerForm}
              roles={['admin']}
            />
          }
        />
        
        {/* Staff Management Routes */}
        <Route
          path="/staff"
          element={
            <PrivateRoute
              component={StaffList}
              roles={['admin']}
            />
          }
        />
        <Route
          path="/staff/add"
          element={
            <PrivateRoute
              component={StaffForm}
              roles={['admin']}
            />
          }
        />
        <Route
          path="/staff/edit/:id"
          element={
            <PrivateRoute
              component={StaffForm}
              roles={['admin']}
            />
          }
        />
        
        {/* Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
};

const App = () => {
  // Tạo theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  return (
    <AuthState>
      <AlertState>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </AlertState>
    </AuthState>
  );
};

export default App;
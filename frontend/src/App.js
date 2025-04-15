import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, Box } from '@mui/material';
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
import EquipmentList from './components/equipment/EquipmentList';
import EquipmentForm from './components/equipment/EquipmentForm';
import EquipmentDetail from './components/equipment/EquipmentDetail';
import MaintenanceList from './components/maintenance/MaintenanceList';
import MaintenanceForm from './components/maintenance/MaintenanceForm';
import PrivateRoute from './components/common/PrivateRoute';
import AuthContext from './contexts/auth/authContext';

import AuthState from './contexts/auth/AuthState';
import AlertState from './contexts/alert/AlertState';
import EquipmentState from './contexts/equipment/EquipmentState';

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
      <Box sx={{ mt: '64px' }}>
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
                roles={['admin', 'receptionist']}
              />
            }
          />
          <Route
            path="/trainers/edit/:id"
            element={
              <PrivateRoute
                component={TrainerForm}
                roles={['admin', 'receptionist']}
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
          
          {/* Equipment Management Routes */}
          <Route
            path="/equipment"
            element={
              <PrivateRoute
                component={EquipmentList}
                roles={['admin', 'receptionist']}
              />
            }
          />
          <Route
            path="/equipment/add"
            element={
              <PrivateRoute
                component={EquipmentForm}
                roles={['admin']}
              />
            }
          />
          <Route
            path="/equipment/edit/:id"
            element={
              <PrivateRoute
                component={EquipmentForm}
                roles={['admin']}
              />
            }
          />
          <Route
            path="/equipment/:id"
            element={
              <PrivateRoute
                component={EquipmentDetail}
                roles={['admin', 'receptionist']}
              />
            }
          />
          
          {/* Maintenance Management Routes */}
          <Route
            path="/maintenance"
            element={
              <PrivateRoute
                component={MaintenanceList}
                roles={['admin', 'receptionist']}
              />
            }
          />
          <Route
            path="/maintenance/add"
            element={
              <PrivateRoute
                component={MaintenanceForm}
                roles={['admin']}
              />
            }
          />
          <Route
            path="/maintenance/add/:id"
            element={
              <PrivateRoute
                component={MaintenanceForm}
                roles={['admin']}
              />
            }
          />
          <Route
            path="/maintenance/:maintenanceId"
            element={
              <PrivateRoute
                component={MaintenanceForm}
                roles={['admin', 'receptionist']}
              />
            }
          />
          
          {/* Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Box>
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
        <EquipmentState>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <AppContent />
            </Router>
          </ThemeProvider>
        </EquipmentState>
      </AlertState>
    </AuthState>
  );
};

export default App;
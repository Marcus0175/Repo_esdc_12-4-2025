import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  Group,
  AdminPanelSettings,
  Dashboard as DashboardIcon,
  People,
  PersonAdd,
  List as ListIcon
} from '@mui/icons-material';

const SIDEBAR_WIDTH = 280;

const Dashboard = () => {
  const theme = useTheme();
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  // Check if the user is admin or receptionist
  const showSidebar = user && (user.role === 'admin' || user.role === 'receptionist');

  const Sidebar = () => (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        borderRight: `1px solid ${theme.palette.divider}`,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 64, // Height of AppBar
        backgroundColor: theme.palette.background.paper,
        overflowY: 'auto'
      }}
    >
      <List component="nav">
        <ListItemButton 
          component={Link} 
          to="/dashboard"
          selected={window.location.pathname === '/dashboard'}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <Box sx={{ p: 2, pt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            QUẢN LÝ KHÁCH HÀNG
          </Typography>
        </Box>
        
        <ListItemButton 
          component={Link} 
          to="/customers"
          selected={window.location.pathname === '/customers'}
        >
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Danh sách khách hàng" />
        </ListItemButton>
        <ListItemButton 
          component={Link} 
          to="/customers/add"
          selected={window.location.pathname === '/customers/add'}
        >
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText primary="Thêm khách hàng mới" />
        </ListItemButton>

        <Box sx={{ p: 2, pt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            QUẢN LÝ HUẤN LUYỆN VIÊN
          </Typography>
        </Box>
        
        <ListItemButton 
          component={Link} 
          to="/trainers"
          selected={window.location.pathname === '/trainers'}
        >
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Danh sách huấn luyện viên" />
        </ListItemButton>
        <ListItemButton 
          component={Link} 
          to="/trainers/add"
          selected={window.location.pathname === '/trainers/add'}
        >
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText primary="Thêm huấn luyện viên mới" />
        </ListItemButton>

        {user && user.role === 'admin' && (
          <>
            <Box sx={{ p: 2, pt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                QUẢN LÝ NỘI BỘ
              </Typography>
            </Box>
            
            <ListItemButton 
              component={Link} 
              to="/staff"
              selected={window.location.pathname === '/staff'}
            >
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="Danh sách nhân viên" />
            </ListItemButton>
            <ListItemButton 
              component={Link} 
              to="/staff/add"
              selected={window.location.pathname === '/staff/add'}
            >
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="Thêm nhân viên mới" />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );

  const renderAdminDashboard = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
            color: 'white'
          }}
        >
          <People sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Quản lý khách hàng
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Quản lý thông tin và tài khoản của khách hàng
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/customers"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Xem danh sách
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #43a047 0%, #81c784 100%)',
            color: 'white'
          }}
        >
          <FitnessCenter sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Quản lý huấn luyện viên
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Quản lý thông tin và tài khoản của huấn luyện viên
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/trainers"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Xem danh sách
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)',
            color: 'white'
          }}
        >
          <AdminPanelSettings sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Quản lý nội bộ
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Quản lý tài khoản của lễ tân và quản trị viên
          </Typography>
          {user && user.role === 'admin' && (
            <Button
              variant="contained"
              component={Link}
              to="/staff"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              Xem danh sách
            </Button>
          )}
        </Paper>
      </Grid>
    </Grid>
  );

  const renderReceptionistDashboard = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
            color: 'white'
          }}
        >
          <People sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Quản lý khách hàng
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Quản lý thông tin và tài khoản của khách hàng
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/customers"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Xem danh sách
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #43a047 0%, #81c784 100%)',
            color: 'white'
          }}
        >
          <FitnessCenter sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Quản lý huấn luyện viên
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Quản lý thông tin và tài khoản của huấn luyện viên
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/trainers"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Xem danh sách
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderCustomerDashboard = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #43a047 0%, #81c784 100%)',
            color: 'white'
          }}
        >
          <FitnessCenter sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Huấn luyện viên
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Xem danh sách huấn luyện viên và đặt lịch tập luyện
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/trainers"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Xem danh sách
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
            color: 'white'
          }}
        >
          <Person sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Tài khoản của tôi
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Xem và cập nhật thông tin tài khoản của bạn
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/profile"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Xem thông tin
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderTrainerDashboard = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
            color: 'white'
          }}
        >
          <People sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Khách hàng của tôi
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Xem danh sách khách hàng được gán cho bạn
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/my-customers"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Xem danh sách
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #43a047 0%, #81c784 100%)',
            color: 'white'
          }}
        >
          <Person sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Tài khoản của tôi
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Xem và cập nhật thông tin tài khoản của bạn
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/profile"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Xem thông tin
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  // Render appropriate dashboard based on user role
  const renderDashboardContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'receptionist':
        return renderReceptionistDashboard();
      case 'customer':
        return renderCustomerDashboard();
      case 'trainer':
        return renderTrainerDashboard();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Only show sidebar for admin and receptionist */}
      {showSidebar && <Sidebar />}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          ml: showSidebar ? `${SIDEBAR_WIDTH}px` : 0,
          mt: '64px', // Height of AppBar
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh'
        }}
      >
        {renderDashboardContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
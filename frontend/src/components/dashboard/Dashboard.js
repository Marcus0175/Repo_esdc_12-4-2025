import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import api from '../../utils/api';
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
  useTheme,
  Chip,
  Badge
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  AdminPanelSettings,
  Dashboard as DashboardIcon,
  People,
  PersonAdd,
  List as ListIcon,
  Build,
  Schedule,
  Schedule as ScheduleIcon,
  Handyman,
  Assignment,
  ListAlt,
  Notifications
} from '@mui/icons-material';


const SIDEBAR_WIDTH = 280;

const Dashboard = () => {
  const theme = useTheme();
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  
  // State for pending registrations (for trainer dashboard)
  const [pendingRegistrations, setPendingRegistrations] = useState(0);

  // Check if the user is admin or receptionist
  const showSidebar = user && (user.role === 'admin' || user.role === 'receptionist');
  const isAdmin = user && user.role === 'admin';
  const isCustomer = user && user.role === 'customer';
  const isTrainer = user && user.role === 'trainer';
  
  // Fetch pending registrations for trainers
  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      if (isTrainer) {
        try {
          const res = await api.get('/service-registrations/my-customers');
          const pendingCount = res.data.filter(reg => reg.status === 'pending').length;
          setPendingRegistrations(pendingCount);
        } catch (err) {
          console.error('Lỗi khi tải đăng ký chờ xác nhận:', err);
        }
      }
    };
    
    fetchPendingRegistrations();
  }, [isTrainer]);

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

        {(isAdmin || user?.role === 'receptionist') && (
          <>
            <Box sx={{ p: 2, pt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                QUẢN LÝ CƠ SỞ VẬT CHẤT
              </Typography>
            </Box>
            
            <ListItemButton 
              component={Link} 
              to="/equipment"
              selected={window.location.pathname === '/equipment'}
            >
              <ListItemIcon>
                <Handyman />
              </ListItemIcon>
              <ListItemText primary="Danh sách thiết bị" />
            </ListItemButton>
            
            {isAdmin && (
              <ListItemButton 
                component={Link} 
                to="/equipment/add"
                selected={window.location.pathname === '/equipment/add'}
              >
                <ListItemIcon>
                  <Build />
                </ListItemIcon>
                <ListItemText primary="Thêm thiết bị mới" />
              </ListItemButton>
            )}
            
            <ListItemButton 
              component={Link} 
              to="/maintenance"
              selected={window.location.pathname === '/maintenance'}
            >
              <ListItemIcon>
                <Schedule />
              </ListItemIcon>
              <ListItemText primary="Lịch bảo trì" />
            </ListItemButton>
          </>
        )}

        {/* Quản lý lịch làm việc - dành cho huấn luyện viên */}
        {isTrainer && (
          <>
            <Box sx={{ p: 2, pt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                QUẢN LÝ LỊCH LÀM VIỆC
              </Typography>
            </Box>
            
            <ListItemButton 
              component={Link} 
              to="/my-schedule"
              selected={window.location.pathname === '/my-schedule'}
            >
              <ListItemIcon>
                <Schedule />
              </ListItemIcon>
              <ListItemText primary="Xem lịch làm việc" />
            </ListItemButton>
            
            <ListItemButton 
              component={Link} 
              to="/schedule"
              selected={window.location.pathname === '/schedule'}
            >
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
              <ListItemText primary="Quản lý lịch làm việc" />
            </ListItemButton>

            <ListItemButton 
              component={Link} 
              to="/trainer-registrations"
              selected={window.location.pathname === '/trainer-registrations'}
            >
              <ListItemIcon>
                <Badge
                  badgeContent={pendingRegistrations}
                  color="error"
                  invisible={pendingRegistrations === 0}
                >
                  <Assignment />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Đăng ký của khách hàng" />
            </ListItemButton>
            
            <Box sx={{ p: 2, pt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                QUẢN LÝ DỊCH VỤ
              </Typography>
            </Box>
            
            <ListItemButton 
              component={Link} 
              to="/services/manage"
              selected={window.location.pathname === '/services/manage'}
            >
              <ListItemIcon>
                <FitnessCenter />
              </ListItemIcon>
              <ListItemText primary="Quản lý dịch vụ" />
            </ListItemButton>
          </>
        )}

        {/* Khách hàng */}
        {isCustomer && (
          <>
            <Box sx={{ p: 2, pt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                DỊCH VỤ
              </Typography>
            </Box>
            
            <ListItemButton 
              component={Link} 
              to="/trainers"
              selected={window.location.pathname === '/trainers'}
            >
              <ListItemIcon>
                <FitnessCenter />
              </ListItemIcon>
              <ListItemText primary="Đăng ký huấn luyện viên" />
            </ListItemButton>
            
            <ListItemButton 
              component={Link} 
              to="/my-registrations"
              selected={window.location.pathname === '/my-registrations'}
            >
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
              <ListItemText primary="Đăng ký của tôi" />
            </ListItemButton>
          </>
        )}

        {isAdmin && (
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

      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #7b1fa2 0%, #ba68c8 100%)',
            color: 'white'
          }}
        >
          <Build sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Quản lý thiết bị
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Quản lý và theo dõi tình trạng các thiết bị tập luyện
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/equipment"
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
            background: 'linear-gradient(135deg, #0288d1 0%, #4fc3f7 100%)',
            color: 'white'
          }}
        >
          <Schedule sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Quản lý bảo trì
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Theo dõi lịch bảo trì và sửa chữa các thiết bị
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/maintenance"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Xem lịch bảo trì
          </Button>
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

      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #7b1fa2 0%, #ba68c8 100%)',
            color: 'white'
          }}
        >
          <Build sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Quản lý thiết bị
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Theo dõi tình trạng các thiết bị tập luyện
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/equipment"
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
            background: 'linear-gradient(135deg, #0288d1 0%, #4fc3f7 100%)',
            color: 'white'
          }}
        >
          <Schedule sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Quản lý bảo trì
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Theo dõi lịch bảo trì và sửa chữa các thiết bị
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/maintenance"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Xem lịch bảo trì
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
            Xem danh sách huấn luyện viên và đăng ký dịch vụ
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
            Đăng ký ngay
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
            Đăng ký của tôi
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Quản lý các đăng ký dịch vụ của bạn
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/my-registrations"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Xem đăng ký
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderTrainerDashboard = () => {
    return (
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
              color: 'white',
              position: 'relative'
            }}
          >
            <People sx={{ fontSize: 50, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Khách hàng đăng ký dịch vụ
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
              Xem và quản lý đăng ký dịch vụ từ khách hàng
            </Typography>
            
            {/* Hiển thị số lượng đăng ký chờ xác nhận */}
            {pendingRegistrations > 0 && (
              <Chip
                label={`${pendingRegistrations} đăng ký mới`}
                color="error"
                sx={{ 
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontWeight: 'bold',
                  animation: 'pulse 1.5s infinite'
                }}
              />
            )}
            
            <Button
              variant="contained"
              component={Link}
              to="/trainer-registrations"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              Xem đăng ký
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
              background: 'linear-gradient(135deg, #7b1fa2 0%, #ba68c8 100%)',
              color: 'white'
            }}
          >
            <Schedule sx={{ fontSize: 50, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Lịch làm việc
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
              Quản lý lịch làm việc và giờ dạy của bạn
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/my-schedule"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              Xem lịch làm việc
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
              Quản lý dịch vụ
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
              Quản lý và cá nhân hóa các dịch vụ bạn cung cấp
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/services/manage"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              Quản lý dịch vụ
            </Button>
          </Paper>
        </Grid>
      </Grid>
    );
  };

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
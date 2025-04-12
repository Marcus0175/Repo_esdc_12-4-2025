import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Group,
  AdminPanelSettings,
  Dashboard as DashboardIcon,
  PersonAdd
} from '@mui/icons-material';

const drawerWidth = 260;

const Dashboard = () => {
  const theme = useTheme();
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const renderAdminDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <Person sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Quản lý khách hàng
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Quản lý thông tin và tài khoản của khách hàng trong hệ thống
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/customers"
            fullWidth
          >
            Xem danh sách
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <FitnessCenter sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Quản lý huấn luyện viên
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Quản lý thông tin và tài khoản của các huấn luyện viên
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/trainers"
            fullWidth
          >
            Xem danh sách
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <AdminPanelSettings sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Quản lý nội bộ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Quản lý tài khoản lễ tân và quản trị viên
          </Typography>
          <Button
            variant="contained"
            color="info"
            component={Link}
            to="/staff"
            fullWidth
          >
            Xem danh sách
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  const Sidebar = () => (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerOpen ? drawerWidth : theme.spacing(7),
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: drawerOpen ? drawerWidth : theme.spacing(7),
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflow: 'hidden',
          backgroundColor: theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'flex-end' }}>
        <IconButton onClick={handleDrawerToggle}>
          {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItemButton component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItem>
          <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 2 }}>
            Quản lý khách hàng
          </Typography>
        </ListItem>
        <ListItemButton component={Link} to="/customers">
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Danh sách khách hàng" />
        </ListItemButton>
        <ListItemButton component={Link} to="/customers/add">
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText primary="Thêm khách hàng" />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        <ListItem>
          <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 2 }}>
            Quản lý huấn luyện viên
          </Typography>
        </ListItem>
        <ListItemButton component={Link} to="/trainers">
          <ListItemIcon>
            <FitnessCenter />
          </ListItemIcon>
          <ListItemText primary="Danh sách huấn luyện viên" />
        </ListItemButton>
        <ListItemButton component={Link} to="/trainers/add">
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText primary="Thêm huấn luyện viên" />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        <ListItem>
          <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 2 }}>
            Quản lý nội bộ
          </Typography>
        </ListItem>
        <ListItemButton component={Link} to="/staff">
          <ListItemIcon>
            <AdminPanelSettings />
          </ListItemIcon>
          <ListItemText primary="Danh sách nhân viên" />
        </ListItemButton>
        <ListItemButton component={Link} to="/staff/add">
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText primary="Thêm nhân viên" />
        </ListItemButton>
      </List>
    </Drawer>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          })
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Dashboard
        </Typography>
        
        {user && (
          <>
            {user.role === 'admin' && renderAdminDashboard()}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
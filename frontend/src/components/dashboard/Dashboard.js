import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  Add
} from '@mui/icons-material';

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const renderAdminDashboard = () => (
    <Grid container spacing={3}>
      {/* Quick Actions Section */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thao tác nhanh
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              component={Link}
              to="/register"
            >
              Đăng ký tài khoản mới
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Person />}
              component={Link}
              to="/customers/add"
            >
              Thêm khách hàng
            </Button>
            <Button
              variant="contained"
              color="info"
              startIcon={<FitnessCenter />}
              component={Link}
              to="/trainers/add"
            >
              Thêm huấn luyện viên
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Statistics */}
      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'primary.light',
            color: 'primary.contrastText'
          }}
        >
          <Person sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h4">Khách hàng</Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/customers"
            sx={{ mt: 2 }}
          >
            Quản lý khách hàng
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'secondary.light',
            color: 'secondary.contrastText'
          }}
        >
          <FitnessCenter sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h4">Huấn luyện viên</Typography>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/trainers"
            sx={{ mt: 2 }}
          >
            Quản lý huấn luyện viên
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'info.light',
            color: 'info.contrastText'
          }}
        >
          <Add sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h4">Tài khoản</Typography>
          <Button
            variant="contained"
            color="info"
            component={Link}
            to="/register"
            sx={{ mt: 2 }}
          >
            Thêm tài khoản mới
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderReceptionistDashboard = () => (
    <Grid container spacing={3}>
      {/* Quick Actions for Receptionist */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thao tác nhanh
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Person />}
              component={Link}
              to="/customers/add"
            >
              Thêm khách hàng
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FitnessCenter />}
              component={Link}
              to="/trainers"
            >
              Xem huấn luyện viên
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderTrainerDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Trang quản lý dành cho huấn luyện viên
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderCustomerDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Trang thông tin khách hàng
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {user && (
        <>
          {user.role === 'admin' && renderAdminDashboard()}
          {user.role === 'customer' && renderCustomerDashboard()}
          {user.role === 'trainer' && renderTrainerDashboard()}
          {user.role === 'receptionist' && renderReceptionistDashboard()}
        </>
      )}
    </Container>
  );
};

export default Dashboard;
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import api from '../../utils/api';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  CalendarToday,
  EmojiEvents,
  AccessTime
} from '@mui/icons-material';

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const [stats, setStats] = useState({
    customerCount: 0,
    trainerCount: 0,
    activeCustomers: 0,
    activeTrainers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      // Trong phiên bản đầy đủ, chúng ta sẽ lấy dữ liệu thực từ API
      // Nhưng hiện tại, chúng ta sẽ mô phỏng dữ liệu
      
      try {
        // Mô phỏng API call, trong dự án thực tế sẽ có API endpoint riêng
        const customers = await api.get('/users/customers');
        const trainers = await api.get('/users/trainers');

        setStats({
          customerCount: customers.data.length,
          trainerCount: trainers.data.length,
          activeCustomers: customers.data.filter(c => c.user?.active).length,
          activeTrainers: trainers.data.filter(t => t.user?.active).length
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderAdminDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
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
          <Typography variant="h4">{stats.customerCount}</Typography>
          <Typography>Tổng số khách hàng</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
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
          <Typography variant="h4">{stats.trainerCount}</Typography>
          <Typography>Tổng số huấn luyện viên</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'success.light',
            color: 'success.contrastText'
          }}
        >
          <Person sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h4">{stats.activeCustomers}</Typography>
          <Typography>Khách hàng đang hoạt động</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
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
          <FitnessCenter sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h4">{stats.activeTrainers}</Typography>
          <Typography>Huấn luyện viên đang hoạt động</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Khách hàng mới nhất
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {/* Mô phỏng dữ liệu */}
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Nguyễn Văn A"
                secondary="Đăng ký: 10/04/2025"
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Trần Thị B"
                secondary="Đăng ký: 08/04/2025"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderCustomerDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Chào mừng đến với phòng tập của chúng tôi!
          </Typography>
          <Typography paragraph>
            Chúng tôi rất vui khi bạn đã chọn dịch vụ của chúng tôi. Từ trang Dashboard này,
            bạn có thể quản lý thành viên, xem thông tin huấn luyện viên, và nhiều tính năng khác.
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <CalendarToday sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">Thông tin thành viên</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem>
              <ListItemText
                primary="Gói thành viên"
                secondary="Tiêu chuẩn"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Ngày bắt đầu"
                secondary="01/04/2025"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Ngày hết hạn"
                secondary="01/05/2025"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <FitnessCenter sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">Huấn luyện viên của tôi</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" alignItems="center" p={2}>
            <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h6">Lê Minh C</Typography>
              <Typography variant="body2" color="textSecondary">
                Chuyên môn: Tăng cơ, Giảm cân
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Kinh nghiệm: 5 năm
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderTrainerDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Quản lý huấn luyện viên
          </Typography>
          <Typography paragraph>
            Từ trang Dashboard này, bạn có thể quản lý danh sách khách hàng của mình, 
            xem thời khóa biểu, và nhận thông báo từ khách hàng.
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Person sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">Khách hàng của tôi</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Nguyễn Văn A"
                secondary="Mục tiêu: Giảm cân"
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Trần Thị B"
                secondary="Mục tiêu: Tăng cơ, Sức bền"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <EmojiEvents sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">Thành tích</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <FitnessCenter />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Huấn luyện viên của tháng"
                secondary="Tháng 3/2025"
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <AccessTime />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="100 giờ huấn luyện"
                secondary="Đạt được ngày 20/03/2025"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderReceptionistDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Quản lý lễ tân
          </Typography>
          <Typography paragraph>
            Từ trang Dashboard này, bạn có thể quản lý khách hàng, huấn luyện viên và các hoạt động hàng ngày của phòng tập.
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
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
          <Typography variant="h4">{stats.customerCount}</Typography>
          <Typography>Tổng số khách hàng</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
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
          <Typography variant="h4">{stats.trainerCount}</Typography>
          <Typography>Tổng số huấn luyện viên</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Hoạt động gần đây
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem>
              <ListItemText
                primary="Nguyễn Văn A đã gia hạn thành viên"
                secondary="10/04/2025, 09:15 AM"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Huấn luyện viên Lê Minh C đã thêm lịch mới"
                secondary="09/04/2025, 04:30 PM"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Trần Thị B đã đăng ký thành viên mới"
                secondary="08/04/2025, 10:45 AM"
              />
            </ListItem>
          </List>
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
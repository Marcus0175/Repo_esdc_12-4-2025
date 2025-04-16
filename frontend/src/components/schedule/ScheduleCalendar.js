import React, { useState, useEffect, useContext, useMemo } from 'react';
import ScheduleContext from '../../contexts/schedule/scheduleContext';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alert/alertContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { Add, AccessTime } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ScheduleCalendar = () => {
  const scheduleContext = useContext(ScheduleContext);
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  
  const { getMySchedule, schedule, loading, error, trainerId, clearSchedule } = scheduleContext;
  const { user } = authContext;
  const { setAlert } = alertContext;
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const loadSchedule = async () => {
      if (isLoaded) return;
      
      try {
        await getMySchedule();
        setIsLoaded(true);
      } catch (err) {
        setAlert('Không thể tải lịch làm việc', 'error');
        setIsLoaded(true);
      }
    };
    
    if (user && user.role === 'trainer') {
      loadSchedule();
    }
    
    return () => {
      clearSchedule();
    };
    // eslint-disable-next-line
  }, [user]);
  
  // Organize schedule items by day of week - do this once with useMemo
  const weekSchedule = useMemo(() => {
    const organized = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };
    
    if (schedule && schedule.length > 0) {
      schedule.forEach(item => {
        if (organized[item.day]) {
          organized[item.day].push(item);
        }
      });
      
      // Sort by start time
      Object.keys(organized).forEach(day => {
        organized[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
      });
    }
    
    return organized;
  }, [schedule]);
  
  // Translate English day names to Vietnamese
  const translateDay = (day) => {
    const dayMap = {
      'Monday': 'Thứ Hai',
      'Tuesday': 'Thứ Ba',
      'Wednesday': 'Thứ Tư',
      'Thursday': 'Thứ Năm',
      'Friday': 'Thứ Sáu',
      'Saturday': 'Thứ Bảy',
      'Sunday': 'Chủ Nhật'
    };
    
    return dayMap[day] || day;
  };
  
  if (loading && !isLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  
  if (user?.role !== 'trainer') {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Chỉ huấn luyện viên mới có thể xem lịch làm việc.</Typography>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            Lịch làm việc trong tuần
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            component={Link}
            to="/schedule"
          >
            Quản lý lịch làm việc
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          {Object.keys(weekSchedule).map(day => (
            <Grid item xs={12} md={6} lg={4} key={day}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {translateDay(day)}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  
                  {weekSchedule[day].length > 0 ? (
                    weekSchedule[day].map((timeSlot, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          mt: 1, 
                          p: 1.5, 
                          backgroundColor: 'rgba(25, 118, 210, 0.08)', 
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <AccessTime sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                        <Typography>
                          {timeSlot.startTime} - {timeSlot.endTime}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                      Không có lịch làm việc
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {schedule.length === 0 && (
          <Box textAlign="center" mt={4}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Bạn chưa đăng ký lịch làm việc nào.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              component={Link}
              to="/schedule"
            >
              Đăng ký lịch làm việc
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default React.memo(ScheduleCalendar);
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScheduleContext from '../../contexts/schedule/scheduleContext';
import AlertContext from '../../contexts/alert/alertContext';
import api from '../../utils/api';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  CircularProgress
} from '@mui/material';
import { ArrowBack, AccessTime, Person } from '@mui/icons-material';

const TrainerScheduleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const scheduleContext = useContext(ScheduleContext);
  const alertContext = useContext(AlertContext);
  
  const { getSchedule, schedule, loading, error } = scheduleContext;
  const { setAlert } = alertContext;
  
  const [trainer, setTrainer] = useState(null);
  const [loadingTrainer, setLoadingTrainer] = useState(true);
  const [weekSchedule, setWeekSchedule] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });
  
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const res = await api.get(`/users/trainers/${id}`);
        setTrainer(res.data);
        setLoadingTrainer(false);
      } catch (err) {
        setAlert('Không thể tải thông tin huấn luyện viên', 'error');
        navigate('/trainers');
      }
    };
    
    const fetchSchedule = async () => {
      try {
        await getSchedule(id);
      } catch (err) {
        setAlert('Không thể tải lịch làm việc', 'error');
      }
    };
    
    fetchTrainerData();
    fetchSchedule();
    
    // eslint-disable-next-line
  }, [id]);
  
  useEffect(() => {
    if (schedule && schedule.length > 0) {
      const organized = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
      };
      
      schedule.forEach(item => {
        if (organized[item.day]) {
          organized[item.day].push(item);
        }
      });
      
      // Sắp xếp theo thời gian bắt đầu
      Object.keys(organized).forEach(day => {
        organized[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
      });
      
      setWeekSchedule(organized);
    }
  }, [schedule]);
  
  // Chuyển đổi tên ngày tiếng Anh sang tiếng Việt
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
  
  if (loadingTrainer || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!trainer) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">Không tìm thấy thông tin huấn luyện viên</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/trainers')}
          sx={{ mt: 2 }}
        >
          Trở về danh sách huấn luyện viên
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/trainers')}
            sx={{ mr: 2 }}
          >
            Quay lại
          </Button>
          <Typography variant="h4" component="h2">
            Lịch làm việc của huấn luyện viên
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={trainer.user?.profileImage ? `http://localhost:5000${trainer.user.profileImage}` : ''}
            alt={trainer.user?.fullName}
            sx={{ width: 80, height: 80, mr: 2 }}
          />
          <Box>
            <Typography variant="h5" component="h3">
              {trainer.user?.fullName}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {trainer.specializations?.join(', ')}
            </Typography>
            <Typography variant="body2">
              {trainer.experience} năm kinh nghiệm
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {error ? (
          <Typography color="error" variant="body1">
            {error}
          </Typography>
        ) : schedule.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center" sx={{ my: 4 }}>
            Huấn luyện viên chưa đăng ký lịch làm việc
          </Typography>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Lịch làm việc trong tuần
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
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
          </>
        )}
      </Paper>
    </Container>
  );
};

export default TrainerScheduleView;
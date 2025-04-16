import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AlertContext from '../../contexts/alert/alertContext';
import AuthContext from '../../contexts/auth/authContext';
import api from '../../utils/api';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  FormHelperText,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import viLocale from 'date-fns/locale/vi';
import { ArrowBack, Check, Schedule, FitnessCenter, Person, CalendarMonth } from '@mui/icons-material';
import { addDays } from 'date-fns';

const steps = ['Chọn huấn luyện viên', 'Chọn lịch làm việc', 'Xác nhận đăng ký'];

const ServiceRegistrationForm = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  const { setAlert } = alertContext;
  const { user } = authContext;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data states
  const [service, setService] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [workSchedules, setWorkSchedules] = useState([]);

  // Form states
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [startDate, setStartDate] = useState(addDays(new Date(), 1));
  const [numberOfSessions, setNumberOfSessions] = useState(1);
  const [notes, setNotes] = useState('');

  // Calculate total price based on service price and number of sessions
  const totalPrice = service ? service.price * numberOfSessions : 0;

  useEffect(() => {
    // Fetch service data
    const fetchServiceData = async () => {
      try {
        const res = await api.get(`/services/${serviceId}`);
        setService(res.data);
      } catch (err) {
        setAlert('Không thể tải thông tin dịch vụ', 'error');
        navigate('/services');
      }
    };

    // Fetch trainers data
    const fetchTrainers = async () => {
      try {
        const res = await api.get('/users/trainers');
        // Filter only active trainers
        const activeTrainers = res.data.filter(trainer => trainer.user?.active);
        setTrainers(activeTrainers);
        setLoading(false);
      } catch (err) {
        setAlert('Không thể tải danh sách huấn luyện viên', 'error');
        setLoading(false);
      }
    };

    fetchServiceData();
    fetchTrainers();
  }, [serviceId, navigate, setAlert]);

  // Fetch trainer schedules when a trainer is selected
  useEffect(() => {
    if (selectedTrainer) {
      const fetchTrainerSchedules = async () => {
        try {
          const res = await api.get(`/work-schedules/available/${selectedTrainer}`);
          setWorkSchedules(res.data);
        } catch (err) {
          setAlert('Không thể tải lịch làm việc của huấn luyện viên', 'error');
        }
      };

      fetchTrainerSchedules();
    } else {
      setWorkSchedules([]);
    }
  }, [selectedTrainer, setAlert]);

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
    }
  };

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

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0 && !selectedTrainer) {
      setAlert('Vui lòng chọn huấn luyện viên', 'error');
      return;
    }

    if (activeStep === 1 && !selectedSchedule) {
      setAlert('Vui lòng chọn lịch làm việc', 'error');
      return;
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!selectedTrainer || !selectedSchedule || !startDate || numberOfSessions < 1) {
      setAlert('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const registrationData = {
        trainerId: selectedTrainer,
        serviceId: service._id,
        workScheduleId: selectedSchedule,
        startDate,
        numberOfSessions,
        notes
      };

      await api.post('/service-registrations', registrationData);
      setAlert('Đăng ký dịch vụ thành công. Vui lòng chờ huấn luyện viên xác nhận.', 'success');
      navigate('/my-registrations');
    } catch (err) {
      setAlert(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký dịch vụ', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !service) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/services')}
            sx={{ mr: 2 }}
          >
            Quay lại
          </Button>
          <Typography variant="h4" component="h2">
            Đăng ký dịch vụ
          </Typography>
        </Box>

        <Box mb={4}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box mb={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Thông tin dịch vụ đã chọn
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Tên dịch vụ:</strong> {service.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {service.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">
                      <FitnessCenter sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Thời lượng: {formatDuration(service.duration)}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(service.price)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {activeStep === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Chọn huấn luyện viên
            </Typography>
            <Grid container spacing={3}>
              {trainers.map((trainer) => (
                <Grid item xs={12} md={4} key={trainer._id}>
                  <Card 
                    variant={selectedTrainer === trainer._id ? "outlined" : "elevation"}
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedTrainer === trainer._id ? 2 : 0,
                      borderColor: selectedTrainer === trainer._id ? 'primary.main' : 'transparent',
                      '&:hover': {
                        boxShadow: 3
                      }
                    }}
                    onClick={() => setSelectedTrainer(trainer._id)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar 
                          src={trainer.user?.profileImage ? `http://localhost:5000${trainer.user.profileImage}` : ''} 
                          alt={trainer.user?.fullName}
                          sx={{ width: 64, height: 64, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6">
                            {trainer.user?.fullName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {trainer.experience} năm kinh nghiệm
                          </Typography>
                        </Box>
                        {selectedTrainer === trainer._id && (
                          <Check color="primary" sx={{ ml: 'auto' }} />
                        )}
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Chuyên môn:
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {trainer.specializations?.map((spec, index) => (
                          <Chip
                            key={index}
                            label={spec}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Chọn lịch làm việc
            </Typography>
            
            {workSchedules.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                Huấn luyện viên chưa đăng ký lịch làm việc. Vui lòng chọn huấn luyện viên khác.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="schedule-select-label">Lịch làm việc</InputLabel>
                    <Select
                      labelId="schedule-select-label"
                      value={selectedSchedule}
                      label="Lịch làm việc"
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                    >
                      {workSchedules.map((schedule) => (
                        <MenuItem value={schedule._id} key={schedule._id}>
                          {translateDay(schedule.dayOfWeek)} ({schedule.startTime} - {schedule.endTime})
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      Chọn một khung giờ phù hợp với lịch trình của bạn
                    </FormHelperText>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
                    <DatePicker
                      label="Ngày bắt đầu"
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      minDate={addDays(new Date(), 1)}
                    />
                  </LocalizationProvider>
                  <FormHelperText>
                    Ngày bắt đầu sử dụng dịch vụ, tối thiểu từ ngày mai
                  </FormHelperText>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số buổi"
                    type="number"
                    value={numberOfSessions}
                    onChange={(e) => setNumberOfSessions(Math.max(1, parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1 }}
                  />
                  <FormHelperText>
                    Tổng số buổi bạn muốn đăng ký
                  </FormHelperText>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ghi chú"
                    multiline
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Thông tin thêm về nhu cầu tập luyện, mục tiêu, vấn đề sức khỏe..."
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Xác nhận đăng ký
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Thông tin huấn luyện viên
                    </Typography>
                    {trainers.find(t => t._id === selectedTrainer) && (
                      <>
                        <Typography variant="body1">
                          {trainers.find(t => t._id === selectedTrainer).user.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {trainers.find(t => t._id === selectedTrainer).experience} năm kinh nghiệm
                        </Typography>
                      </>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <Schedule sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Thông tin lịch tập
                    </Typography>
                    {workSchedules.find(s => s._id === selectedSchedule) && (
                      <>
                        <Typography variant="body1">
                          {translateDay(workSchedules.find(s => s._id === selectedSchedule).dayOfWeek)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {workSchedules.find(s => s._id === selectedSchedule).startTime} - {workSchedules.find(s => s._id === selectedSchedule).endTime}
                        </Typography>
                      </>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <CalendarMonth sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Thời gian
                    </Typography>
                    <Typography variant="body1">
                      Bắt đầu từ: {startDate ? startDate.toLocaleDateString('vi-VN') : ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Số buổi: {numberOfSessions}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <FitnessCenter sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Dịch vụ
                    </Typography>
                    <Typography variant="body1">
                      {service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thời lượng: {formatDuration(service.duration)}
                    </Typography>
                  </Grid>
                  
                  {notes && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Ghi chú
                      </Typography>
                      <Typography variant="body2">
                        {notes}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
            
            <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tổng chi phí
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">
                  {service.name} x {numberOfSessions} buổi
                </Typography>
                <Typography variant="h5" color="primary">
                  {formatCurrency(totalPrice)}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              * Lưu ý: Đăng ký sẽ được gửi đến huấn luyện viên để xem xét. 
              Bạn sẽ nhận được thông báo khi huấn luyện viên xác nhận hoặc từ chối yêu cầu.
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep > 0 && (
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{ mr: 1 }}
              disabled={submitting}
            >
              Quay lại
            </Button>
          )}
          
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Tiếp theo
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Xác nhận đăng ký'}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ServiceRegistrationForm;
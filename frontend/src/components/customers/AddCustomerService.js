import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerServiceContext from '../../contexts/customerService/customerServiceContext';
import AlertContext from '../../contexts/alert/alertContext';
import api from '../../utils/api';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar
} from '@mui/material';
import { ArrowBack, Save, Person, FitnessCenter } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays } from 'date-fns';
import viLocale from 'date-fns/locale/vi';

const AddCustomerService = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const customerServiceContext = useContext(CustomerServiceContext);
  const alertContext = useContext(AlertContext);

  const { addCustomerService } = customerServiceContext;
  const { setAlert } = alertContext;

  const [customer, setCustomer] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [services, setServices] = useState([]);
  const [workSchedules, setWorkSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    trainerId: '',
    serviceId: '',
    workScheduleId: '',
    startDate: addDays(new Date(), 1),
    numberOfSessions: 1,
    notes: ''
  });

  // Load customer data, trainers and services when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load customer info
        const customerRes = await api.get(`/users/customers/${customerId}`);
        setCustomer(customerRes.data);
        
        // Load trainers
        const trainersRes = await api.get('/users/trainers');
        // Filter only active trainers
        const activeTrainers = trainersRes.data.filter(trainer => trainer.user?.active);
        setTrainers(activeTrainers);
        
        // Load all services
        const servicesRes = await api.get('/services');
        // Filter only active services
        const activeServices = servicesRes.data.filter(service => service.isActive);
        setServices(activeServices);
        
        setLoading(false);
      } catch (err) {
        setAlert('Không thể tải thông tin cần thiết', 'error');
        navigate(`/customers/${customerId}/services`);
      }
    };
    
    loadData();
  }, [customerId, navigate, setAlert]);

  // Load trainer schedules when trainer is selected
  useEffect(() => {
    const loadTrainerSchedules = async () => {
      if (!formData.trainerId) {
        setWorkSchedules([]);
        return;
      }
      
      try {
        const res = await api.get(`/work-schedules/available/${formData.trainerId}`);
        setWorkSchedules(res.data);
      } catch (err) {
        console.error('Error loading trainer schedules:', err);
        setWorkSchedules([]);
      }
    };
    
    loadTrainerSchedules();
  }, [formData.trainerId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
    
    // If trainer changed, reset service and work schedule
    if (name === 'trainerId') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        serviceId: '',
        workScheduleId: ''
      }));
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      startDate: date
    });
    
    // Clear error for this field
    if (errors.startDate) {
      setErrors({
        ...errors,
        startDate: undefined
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.trainerId) {
      newErrors.trainerId = 'Vui lòng chọn huấn luyện viên';
    }
    
    if (!formData.serviceId) {
      newErrors.serviceId = 'Vui lòng chọn dịch vụ';
    }
    
    if (!formData.workScheduleId) {
      newErrors.workScheduleId = 'Vui lòng chọn lịch làm việc';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }
    
    if (!formData.numberOfSessions || formData.numberOfSessions < 1) {
      newErrors.numberOfSessions = 'Số buổi phải lớn hơn hoặc bằng 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      await addCustomerService(customerId, formData);
      setAlert('Thêm dịch vụ cho khách hàng thành công', 'success');
      navigate(`/customers/${customerId}/services`);
    } catch (err) {
      setAlert(err.response?.data?.message || 'Lỗi khi thêm dịch vụ', 'error');
      setSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get filtered services based on selected trainer
  const getFilteredServices = () => {
    if (!formData.trainerId) return [];
    
    return services.filter(service => 
      !service.trainerId || service.trainerId._id === formData.trainerId
    );
  };

  // Translate day of week
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

  // Format currency
  const formatCurrency = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!formData.serviceId || !formData.numberOfSessions) return 0;
    
    const service = services.find(s => s._id === formData.serviceId);
    if (!service) return 0;
    
    return service.price * formData.numberOfSessions;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
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
            onClick={() => navigate(`/customers/${customerId}/services`)}
            sx={{ mr: 2 }}
          >
            Quay lại
          </Button>
          <Typography variant="h4" component="h2">
            Thêm dịch vụ cho khách hàng
          </Typography>
        </Box>
        
        {/* Customer Info */}
        {customer && (
          <Box mb={4}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box display="flex" alignItems="center">
                      <Person sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h5">{customer.user?.fullName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {customer.user?.email} | {customer.user?.phoneNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Gói thành viên:
                      </Typography>
                      <Typography variant="body1">
                        <Chip 
                          label={
                            customer.membershipType === 'basic' ? 'Cơ bản' :
                            customer.membershipType === 'standard' ? 'Tiêu chuẩn' : 'Cao cấp'
                          }
                          color={
                            customer.membershipType === 'basic' ? 'default' :
                            customer.membershipType === 'standard' ? 'primary' : 'secondary'
                          }
                          size="small"
                        />
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                        Hết hạn:
                      </Typography>
                      <Typography variant="body1">
                        <Chip 
                          label={formatDate(customer.membershipEndDate)}
                          color={new Date(customer.membershipEndDate) < new Date() ? 'error' : 'success'}
                          size="small"
                        />
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
                Thông tin dịch vụ
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={Boolean(errors.trainerId)}>
                <InputLabel id="trainer-label">Huấn luyện viên</InputLabel>
                <Select
                  labelId="trainer-label"
                  name="trainerId"
                  value={formData.trainerId}
                  label="Huấn luyện viên"
                  onChange={handleInputChange}
                >
                  {trainers.map((trainer) => (
                    <MenuItem key={trainer._id} value={trainer._id}>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          src={trainer.user?.profileImage ? `http://localhost:5000${trainer.user.profileImage}` : ''} 
                          alt={trainer.user?.fullName}
                          sx={{ width: 30, height: 30, mr: 1 }}
                        />
                        {trainer.user?.fullName}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.trainerId}</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={Boolean(errors.serviceId)} disabled={!formData.trainerId}>
                <InputLabel id="service-label">Dịch vụ</InputLabel>
                <Select
                  labelId="service-label"
                  name="serviceId"
                  value={formData.serviceId}
                  label="Dịch vụ"
                  onChange={handleInputChange}
                >
                  {getFilteredServices().map((service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.name} - {formatCurrency(service.price)}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.serviceId}</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={Boolean(errors.workScheduleId)} disabled={!formData.trainerId}>
                <InputLabel id="schedule-label">Lịch làm việc</InputLabel>
                <Select
                  labelId="schedule-label"
                  name="workScheduleId"
                  value={formData.workScheduleId}
                  label="Lịch làm việc"
                  onChange={handleInputChange}
                >
                  {workSchedules.map((schedule) => (
                    <MenuItem key={schedule._id} value={schedule._id}>
                      {translateDay(schedule.dayOfWeek)}: {schedule.startTime} - {schedule.endTime}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.workScheduleId}</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={formData.startDate}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={Boolean(errors.startDate)}
                      helperText={errors.startDate}
                    />
                  )}
                  minDate={addDays(new Date(), 1)}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số buổi"
                name="numberOfSessions"
                type="number"
                value={formData.numberOfSessions}
                onChange={handleInputChange}
                inputProps={{ min: 1 }}
                error={Boolean(errors.numberOfSessions)}
                helperText={errors.numberOfSessions}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                name="notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Grid>
            
            {/* Price Summary */}
            {formData.serviceId && (
              <Grid item xs={12}>
                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Tổng chi phí
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        Dịch vụ: {services.find(s => s._id === formData.serviceId)?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Đơn giá: {formatCurrency(services.find(s => s._id === formData.serviceId)?.price)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        Số buổi: {formData.numberOfSessions}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ textAlign: 'right' }}>
                        Tổng: {formatCurrency(calculateTotalPrice())}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate(`/customers/${customerId}/services`)}
                  sx={{ mr: 2 }}
                  disabled={submitting}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Lưu'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddCustomerService;
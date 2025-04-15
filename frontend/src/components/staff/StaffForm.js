import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AlertContext from '../../contexts/alert/alertContext';
import api from '../../utils/api';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  IconButton
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import ProfileImageUpload from '../common/ProfileImageUpload';

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    role: 'receptionist',
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchStaffData = async () => {
        try {
          const res = await api.get(`/staff/${id}`);
          const userData = res.data;
          
          setFormData({
            username: userData.username,
            email: userData.email,
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber,
            role: userData.role,
            password: '',
            password2: ''
          });
          
          // Lưu ảnh đại diện nếu có
          if (userData.profileImage) {
            setProfileImage(`http://localhost:5000${userData.profileImage}`);
          }
          
          setLoading(false);
        } catch (err) {
          setAlert('Không thể tải thông tin nhân viên', 'error');
          navigate('/staff');
        }
      };

      fetchStaffData();
    }
  }, [id, isEditMode, navigate, setAlert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý khi tải lên ảnh thành công
  const handleImageUpload = (imageUrl) => {
    setProfileImage(`http://localhost:5000${imageUrl}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Form validation
    if (!isEditMode && formData.password !== formData.password2) {
      setAlert('Mật khẩu xác nhận không khớp', 'error');
      setSubmitting(false);
      return;
    }

    if (!formData.username || (!isEditMode && !formData.password) || !formData.email || !formData.fullName || !formData.phoneNumber) {
      setAlert('Vui lòng điền đầy đủ thông tin', 'error');
      setSubmitting(false);
      return;
    }

    try {
      if (isEditMode) {
        // Only send necessary data for update
        const updateData = {
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber
        };
        
        // Only include password if it's provided
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await api.put(`/staff/${id}`, updateData);
        setAlert('Cập nhật thông tin nhân viên thành công', 'success');
      } else {
        // For new staff
        const newStaffData = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          role: formData.role
        };
        
        await api.post('/staff', newStaffData);
        setAlert('Thêm nhân viên mới thành công', 'success');
      }
      
      navigate('/staff');
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra';
      setAlert(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/staff')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Cập nhật thông tin nhân viên' : 'Thêm nhân viên mới'}
          </Typography>
        </Box>

        {/* Phần tải lên ảnh đại diện (chỉ hiển thị khi đang chỉnh sửa) */}
        {isEditMode && (
          <ProfileImageUpload
            userId={id}
            userType="staff"
            currentImage={profileImage}
            onImageUpload={handleImageUpload}
          />
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Thông tin cơ bản</Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Vai trò</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  label="Vai trò"
                  onChange={handleChange}
                  disabled={isEditMode}
                >
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                  <MenuItem value="receptionist">Lễ tân</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Thông tin đăng nhập</Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isEditMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={isEditMode ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                name="password2"
                type="password"
                value={formData.password2}
                onChange={handleChange}
                required={!isEditMode || formData.password !== ''}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/staff')}
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
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isEditMode ? 'Cập nhật' : 'Thêm mới'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default StaffForm;
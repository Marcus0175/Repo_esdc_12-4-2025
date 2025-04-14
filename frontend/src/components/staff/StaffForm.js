import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AlertContext from '../../contexts/alert/alertContext';
import api from '../../utils/api';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { ArrowBack, PhotoCamera, Delete } from '@mui/icons-material';

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    role: 'receptionist',
    avatar: null
  });

  useEffect(() => {
    if (isEditMode) {
      loadStaffData();
    }
  }, [id]);

  const loadStaffData = async () => {
    try {
      const res = await api.get(`/users/staff/${id}`);
      const { username, email, fullName, phoneNumber, role, avatarUrl } = res.data;
      setFormData({
        username,
        email,
        fullName,
        phoneNumber,
        role,
        password: '',
        password2: ''
      });
      if (avatarUrl) {
        setAvatarPreview(avatarUrl);
      }
      setLoading(false);
    } catch (err) {
      setAlert('Không thể tải thông tin nhân viên', 'error');
      navigate('/staff');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlert('Kích thước ảnh không được vượt quá 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          avatar: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setFormData(prev => ({
      ...prev,
      avatar: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.role === 'admin') {
      if (!formData.username || !formData.password || !formData.fullName) {
        setAlert('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
      }
    } else {
      if (!formData.username || !formData.password || !formData.email || !formData.fullName || !formData.phoneNumber) {
        setAlert('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
      }
    }

    if (!isEditMode && formData.password !== formData.password2) {
      setAlert('Mật khẩu xác nhận không khớp', 'error');
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && key !== 'password2') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (isEditMode) {
        await api.put(`/users/staff/${id}`, formDataToSend);
        setAlert('Cập nhật thông tin nhân viên thành công', 'success');
      } else {
        await api.post('/users/staff', formDataToSend);
        setAlert('Thêm nhân viên mới thành công', 'success');
      }
      navigate('/staff');
    } catch (err) {
      setAlert(err.response?.data?.message || 'Có lỗi xảy ra', 'error');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>Đang tải...</Box>;
  }

  return (
    <Box sx={{ ml: '280px', p: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/staff')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Cập nhật thông tin nhân viên' : 'Thêm nhân viên mới'}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Ảnh đại diện */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                      src={avatarPreview}
                      sx={{ width: 150, height: 150, mb: 2 }}
                    />
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        component="label"
                        startIcon={<PhotoCamera />}
                      >
                        Chọn ảnh
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                      </Button>
                      {avatarPreview && (
                        <IconButton color="error" onClick={handleRemoveAvatar}>
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Thông tin cơ bản */}
            <Grid item xs={12}>
              <Typography variant="h6">Thông tin cơ bản</Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Vai trò"
                  onChange={handleInputChange}
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
                label="Tên đăng nhập"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={isEditMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!isEditMode}
              />
            </Grid>

            {!isEditMode && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu"
                  name="password2"
                  type="password"
                  value={formData.password2}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </Grid>

            {formData.role === 'receptionist' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              </>
            )}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/staff')}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default StaffForm;
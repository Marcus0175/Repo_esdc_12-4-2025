import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alert/alertContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { PersonAddOutlined } from '@mui/icons-material';

const Register = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { register, error, clearErrors, isAuthenticated, user } = authContext;
  const { setAlert } = alertContext;

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error]);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    role: 'customer'
  });

  const { username, password, password2, email, fullName, phoneNumber, role } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    
    if (password !== password2) {
      setAlert('Mật khẩu không khớp', 'error');
    } else {
      register({
        username,
        password,
        email,
        fullName,
        phoneNumber,
        role
      });
    }
  };

  // Chỉ admin có thể thêm admin và lễ tân
  const canAddAdminReceptionist = user && user.role === 'admin';

  return (
    <Container component="main" maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng ký tài khoản
        </Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="full-name"
                name="fullName"
                required
                fullWidth
                id="fullName"
                label="Họ và tên"
                autoFocus
                value={fullName}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="phoneNumber"
                label="Số điện thoại"
                name="phoneNumber"
                value={phoneNumber}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Tên đăng nhập"
                name="username"
                value={username}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                id="password"
                value={password}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password2"
                label="Xác nhận mật khẩu"
                type="password"
                id="password2"
                value={password2}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Vai trò</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={role}
                  label="Vai trò"
                  onChange={onChange}
                >
                  <MenuItem value="customer">Khách hàng</MenuItem>
                  <MenuItem value="trainer">Huấn luyện viên</MenuItem>
                  {canAddAdminReceptionist && (
                    <MenuItem value="receptionist">Lễ tân</MenuItem>
                  )}
                  {canAddAdminReceptionist && (
                    <MenuItem value="admin">Quản lý</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Đăng ký
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alert/alertContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

const Login = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const location = useLocation();

  const { login, error, clearErrors, isAuthenticated } = authContext;
  const { setAlert } = alertContext;

  const navigate = useNavigate();
  
  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { username, password } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }

    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
  }, [error, isAuthenticated, setAlert, clearErrors, navigate, from]);

  const onChange = e => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (username === '' || password === '') {
      setAlert('Vui lòng nhập đầy đủ thông tin', 'error');
    } else {
      login({ username, password });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Tên đăng nhập"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={onChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Đăng nhập
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
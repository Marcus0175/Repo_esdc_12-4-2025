import React, { useState, useContext, useEffect } from 'react';
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
  Divider,
  CircularProgress,
  Chip,
  FormControl,
  FormLabel,
  Autocomplete
} from '@mui/material';
import { Save, ArrowBack, Add, Delete } from '@mui/icons-material';

const TrainerForm = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    specializations: [],
    experience: 0,
    certifications: [],
    availability: []
  });

  const [loading, setLoading] = useState(isEditMode);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    issuedBy: '',
    year: ''
  });

  const specializations = [
    'Giảm cân', 'Tăng cơ', 'Cardio', 'Yoga', 'Pilates', 'Strength Training',
    'CrossFit', 'Bodybuilding', 'Calisthenics', 'HIIT', 'Kickboxing',
    'Boxing', 'MMA', 'Powerlifting', 'Olympic Weightlifting', 'Dinh dưỡng',
    'Phục hồi chấn thương'
  ];

  useEffect(() => {
    if (isEditMode) {
      const fetchTrainer = async () => {
        try {
          const res = await api.get(`/users/trainers/${id}`);
          const trainer = res.data;
          
          setFormData({
            username: trainer.user.username,
            email: trainer.user.email,
            fullName: trainer.user.fullName,
            phoneNumber: trainer.user.phoneNumber,
            specializations: trainer.specializations || [],
            experience: trainer.experience || 0,
            certifications: trainer.certifications || [],
            availability: trainer.availability || []
          });
          
          setLoading(false);
        } catch (err) {
          setAlert('Không thể tải thông tin huấn luyện viên', 'error');
          navigate('/trainers');
        }
      };

      fetchTrainer();
    }
  }, [isEditMode, id, navigate, setAlert]);

  const {
    username,
    password,
    confirmPassword,
    email,
    fullName,
    phoneNumber,
    specializations: trainerSpecializations,
    experience,
    certifications
  } = formData;

  const onChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSpecializationChange = (event, newValue) => {
    setFormData({
      ...formData,
      specializations: newValue
    });
  };

  const handleCertificateChange = (e, index, field) => {
    const updatedCertifications = [...certifications];
    updatedCertifications[index][field] = e.target.value;
    setFormData({
      ...formData,
      certifications: updatedCertifications
    });
  };

  const addCertificate = () => {
    if (!newCertificate.name || !newCertificate.issuedBy || !newCertificate.year) {
      setAlert('Vui lòng điền đầy đủ thông tin chứng chỉ', 'error');
      return;
    }

    setFormData({
      ...formData,
      certifications: [...certifications, { ...newCertificate }]
    });

    setNewCertificate({
      name: '',
      issuedBy: '',
      year: ''
    });
  };

  const removeCertificate = (index) => {
    const updatedCertifications = [...certifications];
    updatedCertifications.splice(index, 1);
    setFormData({
      ...formData,
      certifications: updatedCertifications
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!isEditMode && password !== confirmPassword) {
      setAlert('Mật khẩu không khớp', 'error');
      return;
    }

    try {
      if (isEditMode) {
        await api.put(`/users/trainers/${id}`, formData);
        setAlert('Cập nhật huấn luyện viên thành công', 'success');
      } else {
        await api.post('/users/trainers', formData);
        setAlert('Thêm huấn luyện viên thành công', 'success');
      }
      navigate('/trainers');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra';
      setAlert(errorMsg, 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
            onClick={() => navigate('/trainers')}
            sx={{ mr: 2 }}
          >
            Quay lại
          </Button>
          <Typography variant="h4" component="h2">
            {isEditMode ? 'Chỉnh sửa thông tin huấn luyện viên' : 'Thêm huấn luyện viên mới'}
          </Typography>
        </Box>

        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin cơ bản
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={fullName}
                onChange={onChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phoneNumber"
                value={phoneNumber}
                onChange={onChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                name="username"
                value={username}
                onChange={onChange}
                required
                disabled={isEditMode}
              />
            </Grid>

            {!isEditMode && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mật khẩu"
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Xác nhận mật khẩu"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={onChange}
                    required
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Thông tin chuyên môn
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số năm kinh nghiệm"
                name="experience"
                type="number"
                value={experience}
                onChange={onChange}
                inputProps={{ min: 0 }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="specializations"
                options={specializations}
                value={trainerSpecializations}
                onChange={handleSpecializationChange}
                freeSolo
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Chuyên môn"
                    placeholder="Thêm chuyên môn"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Chứng chỉ
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Tên chứng chỉ"
                      value={newCertificate.name}
                      onChange={(e) => setNewCertificate({...newCertificate, name: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Tổ chức cấp"
                      value={newCertificate.issuedBy}
                      onChange={(e) => setNewCertificate({...newCertificate, issuedBy: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      label="Năm"
                      type="number"
                      value={newCertificate.year}
                      onChange={(e) => setNewCertificate({...newCertificate, year: e.target.value})}
                      inputProps={{ min: 1900, max: new Date().getFullYear() }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={addCertificate}
                      startIcon={<Add />}
                      sx={{ height: '100%' }}
                    >
                      Thêm
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {certifications.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Danh sách chứng chỉ
                  </Typography>
                  {certifications.map((cert, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Tên chứng chỉ"
                            value={cert.name}
                            onChange={(e) => handleCertificateChange(e, index, 'name')}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Tổ chức cấp"
                            value={cert.issuedBy}
                            onChange={(e) => handleCertificateChange(e, index, 'issuedBy')}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            fullWidth
                            label="Năm"
                            type="number"
                            value={cert.year}
                            onChange={(e) => handleCertificateChange(e, index, 'year')}
                            inputProps={{ min: 1900, max: new Date().getFullYear() }}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            onClick={() => removeCertificate(index)}
                            startIcon={<Delete />}
                          >
                            Xóa
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="textSecondary">
                  Chưa có chứng chỉ nào được thêm
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  size="large"
                >
                  {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default TrainerForm;
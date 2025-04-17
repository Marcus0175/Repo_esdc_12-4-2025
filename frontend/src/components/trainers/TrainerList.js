import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlertContext from '../../contexts/alert/alertContext';
import AuthContext from '../../contexts/auth/authContext';
import api from '../../utils/api';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  Edit,
  Search,
  Add,
  Block,
  CheckCircle,
  FitnessCenter
} from '@mui/icons-material';

const TrainerList = () => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  const { setAlert } = alertContext;
  const { user } = authContext;
  const navigate = useNavigate();

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [actionType, setActionType] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Check if user can manage trainers (admin or receptionist)
  const canManageTrainers = user && (user.role === 'admin' || user.role === 'receptionist');
  const isCustomer = user && user.role === 'customer';

  useEffect(() => {
    getTrainers();
  }, []);

  const getTrainers = async () => {
    try {
      const res = await api.get('/users/trainers');
      setTrainers(res.data);
      setLoading(false);
    } catch (err) {
      setAlert('Không thể tải danh sách huấn luyện viên', 'error');
      setLoading(false);
    }
  };

  const handleOpenDialog = (trainer, action) => {
    setSelectedTrainer(trainer);
    setActionType(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTrainer(null);
    setActionType('');
  };

  const handleConfirmAction = async () => {
    try {
      setProcessingAction(true);
      
      if (actionType === 'activate') {
        await api.put(`/users/trainers/${selectedTrainer._id}/activate`);
        setAlert('Kích hoạt tài khoản thành công', 'success');
      } else if (actionType === 'deactivate') {
        await api.delete(`/users/trainers/${selectedTrainer._id}`);
        setAlert('Vô hiệu hóa tài khoản thành công', 'success');
      }
      
      handleCloseDialog();
      getTrainers();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra';
      setAlert(errorMsg, 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRegister = (trainerId) => {
    // Điều hướng tới trang đăng ký dịch vụ với ID huấn luyện viên
    navigate(`/service-registration/trainer/${trainerId}`);
  };

  const getDialogContent = () => {
    if (!selectedTrainer) return {};

    const contents = {
      activate: {
        title: 'Xác nhận kích hoạt tài khoản',
        content: `Bạn có chắc chắn muốn kích hoạt tài khoản của huấn luyện viên ${selectedTrainer.user?.fullName}?`
      },
      deactivate: {
        title: 'Xác nhận vô hiệu hóa tài khoản',
        content: `Bạn có chắc chắn muốn vô hiệu hóa tài khoản của huấn luyện viên ${selectedTrainer.user?.fullName}?`
      }
    };

    return contents[actionType] || {};
  };

  const filteredTrainers = trainers.filter(trainer => {
    const user = trainer.user || {};
    const specializations = trainer.specializations || [];
    
    return (
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm) ||
      specializations.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h2">
            Danh sách huấn luyện viên
          </Typography>
          {canManageTrainers && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              component={Link}
              to="/trainers/add"
            >
              Thêm huấn luyện viên
            </Button>
          )}
        </Box>

        <TextField
          fullWidth
          margin="normal"
          placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc chuyên môn..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : filteredTrainers.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
            {searchTerm ? 'Không tìm thấy huấn luyện viên nào phù hợp' : 'Chưa có huấn luyện viên nào'}
          </Typography>
        ) : (
          <TableContainer sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ảnh đại diện</TableCell>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Chuyên môn</TableCell>
                  <TableCell>Kinh nghiệm</TableCell>
                  <TableCell>Đánh giá</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTrainers.map((trainer) => (
                  <TableRow key={trainer._id}>
                    <TableCell>
                      <Avatar 
                        src={trainer.user?.profileImage ? `http://localhost:5000${trainer.user.profileImage}` : ''} 
                        alt={trainer.user?.fullName}
                        sx={{ width: 50, height: 50 }}
                      />
                    </TableCell>
                    <TableCell>{trainer.user?.fullName}</TableCell>
                    <TableCell>{trainer.user?.email}</TableCell>
                    <TableCell>{trainer.user?.phoneNumber}</TableCell>
                    <TableCell>
                      {trainer.specializations?.map((spec, index) => (
                        <Chip
                          key={index}
                          label={spec}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>{trainer.experience} năm</TableCell>
                    <TableCell>
                      <Rating
                        value={trainer.rating?.average || 0}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <Typography variant="caption" display="block">
                        ({trainer.rating?.count || 0} đánh giá)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={trainer.user?.active ? 'Đang hoạt động' : 'Đã vô hiệu'}
                        color={trainer.user?.active ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {canManageTrainers && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              color="primary"
                              component={Link}
                              to={`/trainers/edit/${trainer._id}`}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                            {trainer.user?.active ? (
                              <IconButton
                                color="error"
                                onClick={() => handleOpenDialog(trainer, 'deactivate')}
                                size="small"
                              >
                                <Block />
                              </IconButton>
                            ) : (
                              <IconButton
                                color="success"
                                onClick={() => handleOpenDialog(trainer, 'activate')}
                                size="small"
                              >
                                <CheckCircle />
                              </IconButton>
                            )}
                          </Box>
                        )}
                        
                        {isCustomer && trainer.user?.active && (
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<FitnessCenter />}
                            onClick={() => handleRegister(trainer._id)}
                            sx={{ fontSize: '0.7rem', py: 0.5 }}
                          >
                            Đăng ký
                          </Button>
                        )}
                        
                        {!isCustomer && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              component={Link}
                              to={`/trainers/${trainer._id}`}
                              sx={{ fontSize: '0.7rem', py: 0.5 }}
                            >
                              Chi tiết
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              color="secondary"
                              component={Link}
                              to={`/trainers/${trainer._id}/schedule`}
                              sx={{ fontSize: '0.7rem', py: 0.5 }}
                            >
                              Lịch
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          {getDialogContent().title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {getDialogContent().content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            disabled={processingAction}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            color="primary" 
            variant="contained"
            disabled={processingAction}
          >
            {processingAction ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Xác nhận'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TrainerList;
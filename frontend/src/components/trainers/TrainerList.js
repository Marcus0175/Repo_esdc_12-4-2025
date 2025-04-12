import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
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
  Rating
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  Add,
  Person
} from '@mui/icons-material';

const TrainerList = () => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  const { setAlert } = alertContext;
  const { user } = authContext;

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin = user && user.role === 'admin';
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

  const deleteTrainer = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa huấn luyện viên này?')) {
      try {
        await api.delete(`/users/trainers/${id}`);
        setAlert('Xóa huấn luyện viên thành công', 'success');
        getTrainers();
      } catch (err) {
        setAlert('Không thể xóa huấn luyện viên', 'error');
      }
    }
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
          {isAdmin && (
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
          <Typography>Đang tải dữ liệu...</Typography>
        ) : filteredTrainers.length === 0 ? (
          <Typography>Không có huấn luyện viên nào</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
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
                      {isAdmin && (
                        <>
                          <IconButton
                            color="primary"
                            component={Link}
                            to={`/trainers/edit/${trainer._id}`}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => deleteTrainer(trainer._id)}
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )}
                      
                      {isCustomer && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Person />}
                          component={Link}
                          to={`/trainers/${trainer._id}`}
                        >
                          Xem chi tiết
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default TrainerList;
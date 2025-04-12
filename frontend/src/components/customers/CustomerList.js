import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AlertContext from '../../contexts/alert/alertContext';
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
  Chip
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  Add
} from '@mui/icons-material';

const CustomerList = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    try {
      const res = await api.get('/users/customers');
      setCustomers(res.data);
      setLoading(false);
    } catch (err) {
      setAlert('Không thể tải danh sách khách hàng', 'error');
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      try {
        await api.delete(`/users/customers/${id}`);
        setAlert('Xóa khách hàng thành công', 'success');
        getCustomers();
      } catch (err) {
        setAlert('Không thể xóa khách hàng', 'error');
      }
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const user = customer.user || {};
    return (
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm)
    );
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h2">
            Danh sách khách hàng
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            component={Link}
            to="/customers/add"
          >
            Thêm khách hàng
          </Button>
        </Box>

        <TextField
          fullWidth
          margin="normal"
          placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
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
        ) : filteredCustomers.length === 0 ? (
          <Typography>Không có khách hàng nào</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Gói thành viên</TableCell>
                  <TableCell>Ngày hết hạn</TableCell>
                  <TableCell>Huấn luyện viên</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>{customer.user?.fullName}</TableCell>
                    <TableCell>{customer.user?.email}</TableCell>
                    <TableCell>{customer.user?.phoneNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          customer.membershipType === 'basic'
                            ? 'Cơ bản'
                            : customer.membershipType === 'standard'
                            ? 'Tiêu chuẩn'
                            : 'Cao cấp'
                        }
                        color={
                          customer.membershipType === 'basic'
                            ? 'default'
                            : customer.membershipType === 'standard'
                            ? 'primary'
                            : 'secondary'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(customer.membershipEndDate)}</TableCell>
                    <TableCell>
                      {customer.assignedTrainer
                        ? customer.assignedTrainer.user?.fullName
                        : 'Chưa có'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.user?.active ? 'Đang hoạt động' : 'Đã vô hiệu'}
                        color={customer.user?.active ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/customers/edit/${customer._id}`}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => deleteCustomer(customer._id)}
                      >
                        <Delete />
                      </IconButton>
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

export default CustomerList;
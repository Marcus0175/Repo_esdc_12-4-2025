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
  Chip,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import {
  Edit,
  Search,
  Add,
  Block,
  CheckCircle
} from '@mui/icons-material';

const StaffList = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    getStaffList();
  }, []);

  const getStaffList = async () => {
    try {
      const res = await api.get('/users/staff');
      setStaff(res.data);
      setLoading(false);
    } catch (err) {
      setAlert('Không thể tải danh sách nhân viên', 'error');
      setLoading(false);
    }
  };

  const handleOpenDialog = (staffMember, action) => {
    setSelectedStaff(staffMember);
    setActionType(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStaff(null);
    setActionType('');
  };

  const handleConfirmAction = async () => {
    try {
      if (actionType === 'activate') {
        await api.put(`/users/staff/${selectedStaff._id}/activate`);
        setAlert('Kích hoạt tài khoản thành công', 'success');
      } else if (actionType === 'deactivate') {
        await api.put(`/users/staff/${selectedStaff._id}/deactivate`);
        setAlert('Vô hiệu hóa tài khoản thành công', 'success');
      }
      handleCloseDialog();
      getStaffList();
    } catch (err) {
      setAlert(err.response?.data?.message || 'Có lỗi xảy ra', 'error');
      handleCloseDialog();
    }
  };

  const filteredStaff = staff.filter(member => {
    return (
      member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ ml: '280px', p: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h2">
            Danh sách nhân viên nội bộ
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            component={Link}
            to="/staff/add"
          >
            Thêm nhân viên
          </Button>
        </Box>

        <TextField
          fullWidth
          margin="normal"
          placeholder="Tìm kiếm theo tên, email hoặc tên đăng nhập..."
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

        <TableContainer sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Họ và tên</TableCell>
                <TableCell>Tên đăng nhập</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member._id}>
                  <TableCell>{member.fullName}</TableCell>
                  <TableCell>{member.username}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={member.role === 'admin' ? 'Quản trị viên' : 'Lễ tân'}
                      color={member.role === 'admin' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={member.active ? 'Đang hoạt động' : 'Đã vô hiệu'}
                      color={member.active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {member.role !== 'admin' && (
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/staff/edit/${member._id}`}
                      >
                        <Edit />
                      </IconButton>
                    )}
                    {member.active ? (
                      <Tooltip title="Vô hiệu hóa">
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDialog(member, 'deactivate')}
                        >
                          <Block />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Kích hoạt">
                        <IconButton
                          color="success"
                          onClick={() => handleOpenDialog(member, 'activate')}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          {actionType === 'activate' ? 'Kích hoạt tài khoản' : 'Vô hiệu hóa tài khoản'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn {actionType === 'activate' ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản của {selectedStaff?.fullName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffList;
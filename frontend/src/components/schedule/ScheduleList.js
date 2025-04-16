import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScheduleContext from '../../contexts/schedule/scheduleContext';
import AlertContext from '../../contexts/alert/alertContext';
import AuthContext from '../../contexts/auth/authContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Delete,
  AccessTime,
  ArrowBack
} from '@mui/icons-material';
import ScheduleForm from './ScheduleForm';

const ScheduleList = () => {
  const scheduleContext = useContext(ScheduleContext);
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const {
    schedule,
    loading,
    error,
    trainerId,
    getSchedule,
    getMySchedule,
    deleteScheduleItem,
    clearSchedule
  } = scheduleContext;

  const { setAlert } = alertContext;
  const { user } = authContext;

  const { id } = useParams();
  const navigate = useNavigate();
  
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isMySchedule, setIsMySchedule] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only fetch schedule data when the component mounts or id changes
    const loadSchedule = async () => {
      if (isLoaded) return;
      
      try {
        if (id) {
          await getSchedule(id);
          setIsMySchedule(false);
        } else {
          await getMySchedule();
          setIsMySchedule(true);
        }
        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading schedule:', err);
        setIsLoaded(true);
      }
    };

    loadSchedule();

    // Cleanup function
    return () => {
      clearSchedule();
    };
    // eslint-disable-next-line
  }, [id]);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleOpenDeleteDialog = (scheduleItem) => {
    setSelectedSchedule(scheduleItem);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = async () => {
    try {
      const targetTrainerId = isMySchedule ? trainerId : id;
      await deleteScheduleItem(targetTrainerId, selectedSchedule._id);
      setAlert('Đã xóa lịch làm việc thành công', 'success');
      handleCloseDeleteDialog();
    } catch (err) {
      setAlert(err.response?.data?.message || 'Lỗi khi xóa lịch làm việc', 'error');
    }
  };

  // Sắp xếp lịch làm việc theo thứ tự các ngày trong tuần
  const sortSchedule = (scheduleItems) => {
    const dayOrder = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7
    };

    return [...scheduleItems].sort((a, b) => {
      // Sắp xếp theo thứ tự ngày
      if (dayOrder[a.day] !== dayOrder[b.day]) {
        return dayOrder[a.day] - dayOrder[b.day];
      }
      
      // Nếu cùng ngày, sắp xếp theo thời gian bắt đầu
      return a.startTime.localeCompare(b.startTime);
    });
  };

  // Chuyển đổi tên ngày tiếng Anh sang tiếng Việt
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

  if (loading && !isLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Quay lại
          </Button>
          <Typography variant="h4" component="h2" sx={{ flexGrow: 1 }}>
            {isMySchedule ? 'Lịch làm việc của tôi' : 'Lịch làm việc huấn luyện viên'}
          </Typography>
          {(isMySchedule || (user && user.role === 'admin')) && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleOpenForm}
            >
              Thêm lịch mới
            </Button>
          )}
        </Box>

        {error ? (
          <Typography color="error" variant="body1">
            {error}
          </Typography>
        ) : schedule.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Chưa có lịch làm việc nào
            </Typography>
            {(isMySchedule || (user && user.role === 'admin')) && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleOpenForm}
                sx={{ mt: 2 }}
              >
                Đăng ký lịch làm việc
              </Button>
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Thời gian bắt đầu</TableCell>
                  <TableCell>Thời gian kết thúc</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortSchedule(schedule).map((scheduleItem) => (
                  <TableRow key={scheduleItem._id}>
                    <TableCell>
                      <Chip 
                        icon={<AccessTime />} 
                        label={translateDay(scheduleItem.day)} 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{scheduleItem.startTime}</TableCell>
                    <TableCell>{scheduleItem.endTime}</TableCell>
                    <TableCell>
                      {(isMySchedule || (user && user.role === 'admin')) && (
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(scheduleItem)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog xác nhận xóa lịch */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Xác nhận xóa lịch làm việc</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa lịch làm việc vào {selectedSchedule && translateDay(selectedSchedule.day)} 
            từ {selectedSchedule?.startTime} đến {selectedSchedule?.endTime}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteSchedule} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Form thêm lịch làm việc */}
      <ScheduleForm 
        open={openForm} 
        handleClose={handleCloseForm} 
        trainerId={isMySchedule ? trainerId : id}
        isMySchedule={isMySchedule}
        onSuccess={() => setIsLoaded(false)}
      />
    </Container>
  );
};

export default ScheduleList;
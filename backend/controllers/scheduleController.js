const { validationResult } = require('express-validator');
const Trainer = require('../models/Trainer');

// @desc    Lấy lịch làm việc của huấn luyện viên
// @route   GET /api/schedule/:trainerId
// @access  Private (trainer, admin, receptionist)
exports.getSchedule = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.trainerId);
    
    if (!trainer) {
      return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên' });
    }
    
    // Kiểm tra quyền truy cập - chỉ admin, lễ tân hoặc chính huấn luyện viên đó mới có quyền xem
    if (req.user.role !== 'admin' && req.user.role !== 'receptionist') {
      // Lấy thông tin trainer để kiểm tra
      const trainerUser = await Trainer.findOne({ user: req.user.id });
      
      if (!trainerUser || trainerUser._id.toString() !== req.params.trainerId) {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
      }
    }
    
    res.json({ schedule: trainer.availability || [] });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên' });
    }
    
    res.status(500).send('Lỗi server');
  }
};

// @desc    Cập nhật lịch làm việc của huấn luyện viên
// @route   PUT /api/schedule/:trainerId
// @access  Private (trainer, admin)
exports.updateSchedule = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const trainer = await Trainer.findById(req.params.trainerId);
    
    if (!trainer) {
      return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên' });
    }
    
    // Kiểm tra quyền - chỉ admin hoặc chính huấn luyện viên đó mới có quyền cập nhật
    if (req.user.role !== 'admin') {
      const trainerUser = await Trainer.findOne({ user: req.user.id });
      
      if (!trainerUser || trainerUser._id.toString() !== req.params.trainerId) {
        return res.status(403).json({ message: 'Không có quyền cập nhật lịch làm việc' });
      }
    }
    
    // Cập nhật lịch làm việc
    trainer.availability = req.body.schedule;
    await trainer.save();
    
    res.json({ schedule: trainer.availability });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên' });
    }
    
    res.status(500).send('Lỗi server');
  }
};

// @desc    Xóa lịch làm việc của huấn luyện viên
// @route   DELETE /api/schedule/:trainerId/:scheduleId
// @access  Private (trainer, admin)
exports.deleteScheduleItem = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.trainerId);
    
    if (!trainer) {
      return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên' });
    }
    
    // Kiểm tra quyền - chỉ admin hoặc chính huấn luyện viên đó mới có quyền xóa
    if (req.user.role !== 'admin') {
      const trainerUser = await Trainer.findOne({ user: req.user.id });
      
      if (!trainerUser || trainerUser._id.toString() !== req.params.trainerId) {
        return res.status(403).json({ message: 'Không có quyền xóa lịch làm việc' });
      }
    }
    
    // Tìm và xóa lịch làm việc theo ID
    const scheduleIndex = trainer.availability.findIndex(
      item => item._id.toString() === req.params.scheduleId
    );
    
    if (scheduleIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy lịch làm việc' });
    }
    
    trainer.availability.splice(scheduleIndex, 1);
    await trainer.save();
    
    res.json({ message: 'Đã xóa lịch làm việc', schedule: trainer.availability });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên hoặc lịch làm việc' });
    }
    
    res.status(500).send('Lỗi server');
  }
};

// @desc    Thêm lịch làm việc cho huấn luyện viên
// @route   POST /api/schedule/:trainerId
// @access  Private (trainer, admin)
exports.addScheduleItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { day, startTime, endTime } = req.body;
  
  try {
    const trainer = await Trainer.findById(req.params.trainerId);
    
    if (!trainer) {
      return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên' });
    }
    
    // Kiểm tra quyền - chỉ admin hoặc chính huấn luyện viên đó mới có quyền thêm
    if (req.user.role !== 'admin') {
      const trainerUser = await Trainer.findOne({ user: req.user.id });
      
      if (!trainerUser || trainerUser._id.toString() !== req.params.trainerId) {
        return res.status(403).json({ message: 'Không có quyền thêm lịch làm việc' });
      }
    }
    
    // Kiểm tra xung đột lịch làm việc
    const conflictingSchedule = trainer.availability.find(
      item => item.day === day && 
      ((startTime >= item.startTime && startTime < item.endTime) || 
       (endTime > item.startTime && endTime <= item.endTime) ||
       (startTime <= item.startTime && endTime >= item.endTime))
    );
    
    if (conflictingSchedule) {
      return res.status(400).json({ 
        message: 'Lịch làm việc xung đột với lịch đã có' 
      });
    }
    
    // Thêm lịch làm việc mới
    const newScheduleItem = {
      day,
      startTime,
      endTime
    };
    
    trainer.availability.push(newScheduleItem);
    await trainer.save();
    
    res.status(201).json({ 
      message: 'Đã thêm lịch làm việc mới',
      scheduleItem: trainer.availability[trainer.availability.length - 1] 
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên' });
    }
    
    res.status(500).send('Lỗi server');
  }
};

// @desc    Lấy lịch làm việc của huấn luyện viên đang đăng nhập
// @route   GET /api/schedule/me
// @access  Private (trainer)
exports.getMySchedule = async (req, res) => {
  try {
    // Kiểm tra người dùng có phải là huấn luyện viên không
    if (req.user.role !== 'trainer') {
      return res.status(403).json({ message: 'Chỉ huấn luyện viên mới có quyền truy cập' });
    }
    
    const trainer = await Trainer.findOne({ user: req.user.id });
    
    if (!trainer) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin huấn luyện viên' });
    }
    
    res.json({ schedule: trainer.availability || [] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};
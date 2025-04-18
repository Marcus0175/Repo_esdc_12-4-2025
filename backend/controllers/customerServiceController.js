const { validationResult } = require('express-validator');
const Customer = require('../models/Customer');
const ServiceRegistration = require('../models/ServiceRegistration');
const Service = require('../models/Service');
const User = require('../models/User');
const Trainer = require('../models/Trainer');

// @desc    Lấy tất cả đăng ký dịch vụ của khách hàng
// @route   GET /api/customer-services/:customerId
// @access  Private (admin, receptionist)
exports.getCustomerServices = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    
    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin khách hàng' });
    }
    
    const registrations = await ServiceRegistration.find({ customer: customer._id })
      .populate({
        path: 'trainer',
        populate: { path: 'user', select: 'fullName' }
      })
      .populate('service')
      .populate('workSchedule')
      .sort({ createdAt: -1 });
    
    res.json(registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// @desc    Đăng ký dịch vụ mới cho khách hàng (từ admin/receptionist)
// @route   POST /api/customer-services/:customerId
// @access  Private (admin, receptionist)
exports.addCustomerService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { 
    trainerId, 
    serviceId, 
    workScheduleId, 
    startDate, 
    numberOfSessions, 
    notes 
  } = req.body;
  
  try {
    // Kiểm tra khách hàng tồn tại
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    
    // Kiểm tra membershipEndDate của khách hàng
    if (new Date(customer.membershipEndDate) < new Date()) {
      return res.status(400).json({ 
        message: 'Thành viên đã hết hạn. Vui lòng gia hạn trước khi đăng ký dịch vụ.' 
      });
    }
    
    // Kiểm tra trainer
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên' });
    }
    
    // Kiểm tra trạng thái tài khoản của trainer
    const trainerUser = await User.findById(trainer.user);
    if (!trainerUser || !trainerUser.active) {
      return res.status(400).json({ message: 'Huấn luyện viên này không còn hoạt động' });
    }
    
    // Kiểm tra dịch vụ
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }
    
    if (!service.isActive) {
      return res.status(400).json({ message: 'Dịch vụ này không còn hoạt động' });
    }
    
    // Tính tổng giá
    const totalPrice = service.price * numberOfSessions;
    
    // Tạo đăng ký mới
    const newRegistration = new ServiceRegistration({
      customer: customer._id,
      trainer: trainer._id,
      service: service._id,
      workSchedule: workScheduleId,
      startDate,
      numberOfSessions,
      totalPrice,
      notes,
      status: 'approved' // Tự động duyệt khi admin/receptionist tạo
    });
    
    const registration = await newRegistration.save();
    
    // Populate thông tin để trả về
    await registration.populate([
      {
        path: 'customer',
        populate: { path: 'user', select: 'fullName email phoneNumber' }
      },
      {
        path: 'trainer',
        populate: { path: 'user', select: 'fullName' }
      },
      'service'
    ]);
    
    res.status(201).json(registration);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// @desc    Cập nhật đăng ký dịch vụ của khách hàng
// @route   PUT /api/customer-services/:registrationId
// @access  Private (admin, receptionist)
exports.updateCustomerService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { 
    numberOfSessions, 
    completedSessions,
    notes,
    status 
  } = req.body;
  
  try {
    // Tìm đăng ký dịch vụ
    const registration = await ServiceRegistration.findById(req.params.registrationId);
    
    if (!registration) {
      return res.status(404).json({ message: 'Không tìm thấy đăng ký dịch vụ' });
    }
    
    // Cập nhật thông tin
    if (numberOfSessions) {
      // Lấy thông tin dịch vụ để tính lại giá
      const service = await Service.findById(registration.service);
      if (!service) {
        return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
      }
      
      registration.numberOfSessions = numberOfSessions;
      registration.totalPrice = service.price * numberOfSessions;
    }
    
    if (completedSessions !== undefined) {
      registration.completedSessions = completedSessions;
      
      // Nếu đã hoàn thành tất cả các buổi, cập nhật trạng thái và ngày kết thúc
      if (completedSessions === registration.numberOfSessions) {
        registration.status = 'completed';
        registration.endDate = new Date();
      }
    }
    
    if (notes) {
      registration.notes = notes;
    }
    
    if (status) {
      registration.status = status;
      
      // Nếu hủy hoặc hoàn thành, cập nhật ngày kết thúc
      if (status === 'canceled' || status === 'completed') {
        registration.endDate = new Date();
      }
    }
    
    await registration.save();
    
    // Populate thông tin để trả về
    await registration.populate([
      {
        path: 'customer',
        populate: { path: 'user', select: 'fullName email phoneNumber' }
      },
      {
        path: 'trainer',
        populate: { path: 'user', select: 'fullName' }
      },
      'service'
    ]);
    
    res.json(registration);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// @desc    Xóa đăng ký dịch vụ của khách hàng
// @route   DELETE /api/customer-services/:registrationId
// @access  Private (admin)
exports.deleteCustomerService = async (req, res) => {
  try {
    const registration = await ServiceRegistration.findById(req.params.registrationId);
    
    if (!registration) {
      return res.status(404).json({ message: 'Không tìm thấy đăng ký dịch vụ' });
    }
    
    // Thay đổi từ registration.remove() sang sử dụng phương thức hiện đại hơn
    await ServiceRegistration.deleteOne({ _id: registration._id });
    
    res.json({ message: 'Đã xóa đăng ký dịch vụ' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// @desc    Lấy tổng quan dịch vụ của khách hàng
// @route   GET /api/customer-services/:customerId/summary
// @access  Private (admin, receptionist)
exports.getServiceSummary = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    
    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin khách hàng' });
    }
    
    // Lấy tất cả đăng ký dịch vụ của khách hàng
    const registrations = await ServiceRegistration.find({ customer: customer._id });
    
    // Tổng hợp thông tin
    const summary = {
      totalRegistrations: registrations.length,
      activeRegistrations: registrations.filter(reg => reg.status === 'approved').length,
      completedRegistrations: registrations.filter(reg => reg.status === 'completed').length,
      canceledRegistrations: registrations.filter(reg => reg.status === 'canceled').length,
      totalSessions: registrations.reduce((sum, reg) => sum + reg.numberOfSessions, 0),
      completedSessions: registrations.reduce((sum, reg) => sum + reg.completedSessions, 0),
      totalSpending: registrations.reduce((sum, reg) => sum + reg.totalPrice, 0)
    };
    
    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};
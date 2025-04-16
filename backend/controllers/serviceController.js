const { validationResult } = require('express-validator');
const Service = require('../models/Service');
const ServiceRegistration = require('../models/ServiceRegistration');

// @desc    Lấy tất cả dịch vụ
// @route   GET /api/services
// @access  Public
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ category: 1, price: 1 });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// @desc    Lấy dịch vụ theo ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }
    
    res.json(service);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }
    
    res.status(500).send('Lỗi server');
  }
};

// @desc    Thêm dịch vụ mới
// @route   POST /api/services
// @access  Private (admin only)
exports.addService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, description, price, duration, category, isActive } = req.body;
  
  try {
    // Kiểm tra xem dịch vụ đã tồn tại chưa
    const existingService = await Service.findOne({ name });
    if (existingService) {
      return res.status(400).json({ message: 'Dịch vụ với tên này đã tồn tại' });
    }
    
    const newService = new Service({
      name,
      description,
      price,
      duration,
      category: category || 'personal',
      isActive: isActive !== undefined ? isActive : true
    });
    
    const service = await newService.save();
    
    res.status(201).json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// @desc    Cập nhật dịch vụ
// @route   PUT /api/services/:id
// @access  Private (admin only)
exports.updateService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, description, price, duration, category, isActive } = req.body;
  
  try {
    let service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }
    
    // Kiểm tra xem tên dịch vụ đã tồn tại chưa (nếu tên bị thay đổi)
    if (name && name !== service.name) {
      const existingService = await Service.findOne({ name });
      if (existingService) {
        return res.status(400).json({ message: 'Dịch vụ với tên này đã tồn tại' });
      }
    }
    
    // Nếu đang vô hiệu hóa dịch vụ, kiểm tra xem có đăng ký nào đang chờ hoặc đã duyệt không
    if (isActive === false && service.isActive === true) {
      const pendingRegistrations = await ServiceRegistration.find({
        service: service._id,
        status: { $in: ['pending', 'approved'] }
      });
      
      if (pendingRegistrations.length > 0) {
        return res.status(400).json({
          message: 'Không thể vô hiệu hóa dịch vụ này vì đang có đăng ký'
        });
      }
    }
    
    // Cập nhật thông tin
    if (name) service.name = name;
    if (description) service.description = description;
    if (price !== undefined) service.price = price;
    if (duration) service.duration = duration;
    if (category) service.category = category;
    if (isActive !== undefined) service.isActive = isActive;
    
    await service.save();
    
    res.json(service);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }
    
    res.status(500).send('Lỗi server');
  }
};

// @desc    Xóa dịch vụ (vô hiệu hóa)
// @route   DELETE /api/services/:id
// @access  Private (admin only)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }
    
    // Kiểm tra xem có đăng ký nào đang chờ hoặc đã duyệt không
    const pendingRegistrations = await ServiceRegistration.find({
      service: service._id,
      status: { $in: ['pending', 'approved'] }
    });
    
    if (pendingRegistrations.length > 0) {
      return res.status(400).json({
        message: 'Không thể xóa dịch vụ này vì đang có đăng ký'
      });
    }
    
    // Thay vì xóa, chỉ vô hiệu hóa dịch vụ
    service.isActive = false;
    await service.save();
    
    res.json({ message: 'Dịch vụ đã được vô hiệu hóa' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }
    
    res.status(500).send('Lỗi server');
  }
};
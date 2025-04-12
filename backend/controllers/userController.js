const User = require('../models/User');
const Customer = require('../models/Customer');
const Trainer = require('../models/Trainer');
const { validationResult } = require('express-validator');

// Lấy danh sách tất cả khách hàng
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate({
        path: 'user',
        select: 'username email fullName phoneNumber active'
      })
      .populate({
        path: 'assignedTrainer',
        populate: {
          path: 'user',
          select: 'fullName'
        }
      });
      
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// Lấy danh sách tất cả huấn luyện viên
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate({
        path: 'user',
        select: 'username email fullName phoneNumber active'
      });
      
    res.json(trainers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// Thêm khách hàng mới
exports.addCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { 
    username, 
    password, 
    email, 
    fullName, 
    phoneNumber, 
    membershipType, 
    membershipEndDate,
    healthInformation,
    trainingGoals
  } = req.body;
  
  try {
    // Kiểm tra tồn tại
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email hoặc username đã tồn tại' });
    }
    
    // Tạo user mới
    const user = new User({
      username,
      password,
      email,
      fullName,
      phoneNumber,
      role: 'customer'
    });
    
    await user.save();
    
    // Tạo customer profile
    const customer = new Customer({
      user: user._id,
      membershipType: membershipType || 'basic',
      membershipEndDate: membershipEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      healthInformation,
      trainingGoals
    });
    
    await customer.save();
    
    res.status(201).json({ message: 'Khách hàng đã được tạo thành công', customer });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// Thêm huấn luyện viên mới
exports.addTrainer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { 
    username, 
    password, 
    email, 
    fullName, 
    phoneNumber, 
    specializations,
    experience,
    certifications,
    availability
  } = req.body;
  
  try {
    // Kiểm tra tồn tại
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email hoặc username đã tồn tại' });
    }
    
    // Tạo user mới
    const user = new User({
      username,
      password,
      email,
      fullName,
      phoneNumber,
      role: 'trainer'
    });
    
    await user.save();
    
    // Tạo trainer profile
    const trainer = new Trainer({
      user: user._id,
      specializations,
      experience,
      certifications,
      availability
    });
    
    await trainer.save();
    
    res.status(201).json({ message: 'Huấn luyện viên đã được tạo thành công', trainer });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// Cập nhật thông tin khách hàng
exports.updateCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { 
    fullName, 
    phoneNumber, 
    email,
    membershipType, 
    membershipEndDate,
    healthInformation,
    trainingGoals
  } = req.body;
  
  try {
    // Tìm customer
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    
    // Tìm user
    const user = await User.findById(customer.user);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản người dùng' });
    }
    
    // Cập nhật thông tin user
    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (email) user.email = email;
    
    await user.save();
    
    // Cập nhật thông tin customer
    if (membershipType) customer.membershipType = membershipType;
    if (membershipEndDate) customer.membershipEndDate = membershipEndDate;
    if (healthInformation) customer.healthInformation = healthInformation;
    if (trainingGoals) customer.trainingGoals = trainingGoals;
    
    await customer.save();
    
    res.json({ message: 'Cập nhật thông tin khách hàng thành công', customer });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// Cập nhật thông tin huấn luyện viên
exports.updateTrainer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { 
    fullName, 
    phoneNumber, 
    email,
    specializations,
    experience,
    certifications,
    availability
  } = req.body;
  
  try {
    // Tìm trainer
    const trainer = await Trainer.findById(req.params.id);
    
    if (!trainer) {
      return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên' });
    }
    
    // Tìm user
    const user = await User.findById(trainer.user);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản người dùng' });
    }
    
    // Cập nhật thông tin user
    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (email) user.email = email;
    
    await user.save();
    
    // Cập nhật thông tin trainer
    if (specializations) trainer.specializations = specializations;
    if (experience) trainer.experience = experience;
    if (certifications) trainer.certifications = certifications;
    if (availability) trainer.availability = availability;
    
    await trainer.save();
    
    res.json({ message: 'Cập nhật thông tin huấn luyện viên thành công', trainer });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// Xóa khách hàng
exports.deleteCustomer = async (req, res) => {
  try {
    // Tìm customer
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    
    // Tìm user
    const user = await User.findById(customer.user);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản người dùng' });
    }
    
    // Thay vì xóa hoàn toàn, chỉ đánh dấu là không active
    user.active = false;
    await user.save();
    
    res.json({ message: 'Khách hàng đã bị vô hiệu hóa' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// Xóa huấn luyện viên
exports.deleteTrainer = async (req, res) => {
  try {
    // Tìm trainer
    const trainer = await Trainer.findById(req.params.id);
    
    if (!trainer) {
      return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên' });
    }
    
    // Tìm user
    const user = await User.findById(trainer.user);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản người dùng' });
    }
    
    // Thay vì xóa hoàn toàn, chỉ đánh dấu là không active
    user.active = false;
    await user.save();
    
    res.json({ message: 'Huấn luyện viên đã bị vô hiệu hóa' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// Thêm vào cuối file userController.js

// Lấy thông tin chi tiết của một khách hàng
exports.getCustomer = async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id)
        .populate({
          path: 'user',
          select: 'username email fullName phoneNumber active'
        })
        .populate({
          path: 'assignedTrainer',
          populate: {
            path: 'user',
            select: 'fullName'
          }
        });
        
      if (!customer) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
      }
      
      res.json(customer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Lỗi server');
    }
  };
  
  // Lấy thông tin chi tiết của một huấn luyện viên
  exports.getTrainer = async (req, res) => {
    try {
      const trainer = await Trainer.findById(req.params.id)
        .populate({
          path: 'user',
          select: 'username email fullName phoneNumber active'
        });
        
      if (!trainer) {
        return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên' });
      }
      
      res.json(trainer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Lỗi server');
    }
  };
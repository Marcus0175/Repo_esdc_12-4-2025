const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// @route   GET api/users/customers
// @desc    Lấy danh sách tất cả khách hàng
// @access  Private (admin, receptionist)
router.get(
  '/customers',
  [auth, roleCheck('admin', 'receptionist')],
  userController.getAllCustomers
);

// @route   GET api/users/trainers
// @desc    Lấy danh sách tất cả huấn luyện viên
// @access  Private (admin, receptionist, customer)
router.get(
  '/trainers',
  [auth, roleCheck('admin', 'receptionist', 'customer')],
  userController.getAllTrainers
);

// @route   POST api/users/customers
// @desc    Thêm khách hàng mới
// @access  Private (admin, receptionist)
router.post(
  '/customers',
  [
    auth,
    roleCheck('admin', 'receptionist'),
    [
      check('username', 'Vui lòng nhập username').not().isEmpty(),
      check('password', 'Vui lòng nhập mật khẩu ít nhất 6 ký tự').isLength({ min: 6 }),
      check('email', 'Vui lòng nhập email hợp lệ').isEmail(),
      check('fullName', 'Vui lòng nhập họ tên').not().isEmpty(),
      check('phoneNumber', 'Vui lòng nhập số điện thoại').not().isEmpty()
    ]
  ],
  userController.addCustomer
);

// @route   POST api/users/trainers
// @desc    Thêm huấn luyện viên mới
// @access  Private (admin only)
router.post(
  '/trainers',
  [
    auth,
    roleCheck('admin'),
    [
      check('username', 'Vui lòng nhập username').not().isEmpty(),
      check('password', 'Vui lòng nhập mật khẩu ít nhất 6 ký tự').isLength({ min: 6 }),
      check('email', 'Vui lòng nhập email hợp lệ').isEmail(),
      check('fullName', 'Vui lòng nhập họ tên').not().isEmpty(),
      check('phoneNumber', 'Vui lòng nhập số điện thoại').not().isEmpty()
    ]
  ],
  userController.addTrainer
);

// @route   PUT api/users/customers/:id
// @desc    Cập nhật thông tin khách hàng
// @access  Private (admin, receptionist)
router.put(
  '/customers/:id',
  [auth, roleCheck('admin', 'receptionist')],
  userController.updateCustomer
);

// @route   PUT api/users/trainers/:id
// @desc    Cập nhật thông tin huấn luyện viên
// @access  Private (admin)
router.put(
  '/trainers/:id',
  [auth, roleCheck('admin')],
  userController.updateTrainer
);

// Trong routes/users.js, trước route bị lỗi
console.log("Controller methods:", Object.keys(userController));
console.log("getCustomer is function:", typeof userController.getCustomer === 'function');
console.log("getTrainer is function:", typeof userController.getTrainer === 'function');
// @route   DELETE api/users/customers/:id
// @desc    Xóa khách hàng
// @access  Private (admin)
router.delete(
  '/customers/:id',
  [auth, roleCheck('admin')],
  userController.deleteCustomer
);

// @route   DELETE api/users/trainers/:id
// @desc    Xóa huấn luyện viên
// @access  Private (admin)
router.delete(
  '/trainers/:id',
  [auth, roleCheck('admin')],
  userController.deleteTrainer
);

// @route   GET api/users/customers/:id
// @desc    Lấy thông tin chi tiết của một khách hàng
// @access  Private (admin, receptionist)
router.get(
  '/customers/:id',
  [auth, roleCheck('admin', 'receptionist')],
  userController.getCustomer
);

// @route   GET api/users/trainers/:id
// @desc    Lấy thông tin chi tiết của một huấn luyện viên
// @access  Private (admin, receptionist, customer)
router.get(
  '/trainers/:id',
  [auth, roleCheck('admin', 'receptionist', 'customer')],
  userController.getTrainer
);

module.exports = router;
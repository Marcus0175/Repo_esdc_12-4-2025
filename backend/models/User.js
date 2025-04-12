const mongoose = require('mongoose');
// Giữ lại bcrypt vì có thể cần so sánh mật khẩu đã hash trước đó
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'trainer', 'receptionist', 'customer'],
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Sửa phương thức so sánh password để hỗ trợ cả mật khẩu thường và mật khẩu đã hash
UserSchema.methods.comparePassword = async function(password) {
  // Nếu mật khẩu không hash, so sánh trực tiếp
  if (this.password === password) {
    return true;
  }
  
  // Nếu mật khẩu đã hash, dùng bcrypt để so sánh
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    return false;
  }
};

module.exports = mongoose.model('User', UserSchema);
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
// Cấu hình dotenv
dotenv.config();

// Kết nối đến database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
// Thay thế dòng import với đường dẫn tuyệt đối
app.use('/api/users', require(path.join(__dirname, 'routes', 'users')));

// Route mặc định
app.get('/', (req, res) => {
  res.send('API đang chạy');
});

// Port và chạy server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server đang chạy trên port ${PORT}`));
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userController = require('./controllers/userController');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Init Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Default route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Cron job để kiểm tra tài khoản hết hạn
setInterval(async () => {
  console.log('Đang kiểm tra tài khoản hết hạn...');
  await userController.checkExpiredMemberships();
}, 24 * 60 * 60 * 1000); // Chạy mỗi 24 giờ

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
  // Kiểm tra tài khoản hết hạn khi khởi động server
  userController.checkExpiredMemberships();
});
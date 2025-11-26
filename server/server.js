// ==================== server/server.js ====================
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/auth.js';
import businessRoutes from './routes/business.js';
import bookRecordRoutes from './routes/bookRecords.js';
import chatRoutes from './routes/chat.js';
import guideRoutes from './routes/guides.js';
import lawyerRoutes from './routes/lawyer.js';

dotenv.config();
connectDB();

const app = express();

// CORS FIX — IMPORTANT FOR DEPLOYMENT
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/book-records', bookRecordRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/lawyer', lawyerRoutes);

// HEALTH CHECK (Render requires this)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ROOT ROUTE — FIXES "Cannot GET /"
app.get('/', (req, res) => {
  res.send('MSME Hub Backend is Running ✔️');
});

// SOCKET.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('send-message', (data) => {
    io.to(data.chatId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// SERVER LISTEN
const PORT = process.env.PORT || 5050;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

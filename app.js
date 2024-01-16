// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
const getUserInfo = require('./helpers/getUserInfo');
const jwt = require('jsonwebtoken');
const { caseMessageHandlers, writeMessageBatchToDB } = require('./socketHandler/caseMessageHandlers')
const appointment = require('./routes/appointment');
const cases = require('./routes/case');
const document = require('./routes/document');
const auth = require('./routes/auth');
const taskRoutes = require('./routes/task');
const statistic = require('./routes/statistic');
const Notification = require('./models/notification');

const mongoose = require('mongoose');
const Message = require('./models/message')
const User = require('./models/user')
const crmRoute = require('./routes/crm');
const { requireAuth } = require('./middlewares/authMiddleware');

mongoose.connect(process.env.MONGO_URL, {
  dbName: process.env.MONGO_DBNAME,
})
  .then(() => {
    console.log('Database connected');
  })
  .catch((e) => {
    console.log('Database not connected due to error, ', e);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));



const PORT = process.env.SERVER_PORT || 9000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// All routes
app.use('/api/appointments', appointment);
app.use('/api/documents', document);
app.use('/api/cases', cases);
app.use('/api/statistics', statistic);
app.use('/auth', auth);
app.use('/api/crm', crmRoute);
app.use('/api/tasks', taskRoutes);

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const onConnection = (socket) => {
  caseMessageHandlers(io, socket);
}

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  }
  else {
    next(new Error('Authentication error'));
  }
}).on('connection', onConnection);

// Set up periodic batch write (adjust the interval as needed)
setInterval(writeMessageBatchToDB, 5000); // 5000 milliseconds (5 seconds) as an example interval

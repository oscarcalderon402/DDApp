const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const path = require('path');
require('./database');

app.use(cors({ origin: true, credentials: true }));
// app.use(cors());
// io connection
io.on('connection', (socket) => {
  console.log(socket.id);
  socket.emit('connection', null);
  // socket.on("reload:client", (data) => {
  //   console.log("llego");
  //   socket.broadcast.emit("reload:server", data);
  // });

  socket.on('reload:client', (data, type, role) => {
    console.log('llego');
    socket.broadcast.emit('reload:server', data, type, role);
  });
  // socket.on("disconnect", () => {});
});

app.set('socketio', io);

//middleware
app.use(morgan('dev'));
app.use(express.json({ extended: false }));

//route
app.use('/api/cases', require('./routes/cases.routes'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });

http.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

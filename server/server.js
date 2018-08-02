const socketIo = require('socket.io');
const http = require('http').Server();

const PORT = 3001;

const io = socketIo(http);

http.listen(PORT, function(){
  console.log(`listening on *:${PORT}`);
});


io.on('connect', (socket) => {
  console.log('connected', socket.id);

  socket.on('message', (data) => {
    socket.broadcast.emit('message', data);
  })
});

const socketIo = require('socket.io');
const http = require('http').Server();

const PORT = 3001;

const io = socketIo(http);

http.listen(PORT, function(){
  console.log(`listening on *:${PORT}`);
});


io.on('connect', (socket) => {
  socket.emit('greeting', {channel: 'public', time: (new Date).toString()});

  socket.on('message', (text) => {
    socket.broadcast.emit('message', {from: socket.id, text: text});
  })
});

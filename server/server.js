const socketIo = require('socket.io');
const http = require('http').Server();

const PORT = 3001;

const io = socketIo(http);

http.listen(PORT, function(){
  console.log(`listening on *:${PORT}`);
});

let clients = 0;

io.on('connect', (socket) => {
  clients++;

  socket.emit('greeting', {
    channel: 'public',
    time: (new Date).toString(),
    members: getMemberCount(),
  });

  socket.on('message', (text) => {
    socket.broadcast.emit('message', {from: socket.id, text: text});
  });

  socket.on('req_channel_count', () => {
    socket.emit('res_channel_count', getMemberCount());
  });

  socket.on('disconnect', () => {
    clients--;
  });
});


function getMemberCount() {
  return clients;
}

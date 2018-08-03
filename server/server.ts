import socketIo, { Socket } from "socket.io"
import { createServer } from "http";

const http = createServer();

const PORT = 3001;

const io = socketIo(http);

http.listen(PORT, function () {
  console.log(`listening on *:${PORT}`);
});

let clients = 0;

io.on('connect', (socket) => {
  clients++;

  const helper = new SocketHelper(socket);

  socket.emit('greeting', {
    channel: 'public',
    time: (new Date).toString(),
    members: getMemberCount(),
  });

  socket.on('disconnect', () => {
    clients--;
  });

  socket.on('message', (text) => {
    socket.broadcast.emit('message', {from: socket.id, text: text});
  });

  helper.reqRes('req_channel_count', 'res_channel_count', () => [getMemberCount()]);
});


function getMemberCount() {
  return clients;
}

class SocketHelper {
  constructor(private socket: Socket) {
  }

  reqRes(reqName: string, resName: string, cb: () => any[]) {
    this.socket.on(reqName, async () => {
      const data = await cb();
      this.socket.emit(resName, ...data);
    });
  }
}


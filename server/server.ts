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

  helper.reqRes('req_message', 'res_message', (text: string) => {
    socket.broadcast.emit('message', {from: socket.id, text: text});
  });
  helper.reqRes('req_channel_count', 'res_channel_count', () => [getMemberCount()]);
  helper.reqRes('req_join_private', 'res_join_private', (secret) => {
    const secretCorrect = secret === "secret";

    return [secretCorrect];
  })
});


function getMemberCount() {
  return clients;
}

class SocketHelper {
  constructor(private _socket: Socket) {
  }

  get socket() {
    return this._socket;
  }

  reqRes(reqName: string, resName: string, cb: (...data: any[]) => any[] | void) {

    this._socket.on(reqName, async (...reqData: any[]) => {
      const resData = await cb(...reqData) || [];
      this._socket.emit(resName, ...resData);
    });
  }
}


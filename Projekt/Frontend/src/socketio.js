const io = require("socket.io-client");
let token = "";
if (localStorage.getItem("user-token"))
  token = localStorage.getItem("user-token");
const sock = io(`ws://localhost:3000?token=${token}`, {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
  transports: ["websocket"],
  upgrade: false,
});
sock.connect();

export default sock;

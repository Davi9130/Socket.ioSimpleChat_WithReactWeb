const Koa = require("koa");
const http = require("http");
const socket = require("socket.io");

const app = new Koa();
const server = http.createServer(app.callback());
const io = socket(server);

const SERVER_HOST = "localhost";
const SERVER_PORT = "8080";
io.on("connection", (socket) => {
  console.log("Nova Conexão - ServerSide");
  socket.on("message", (data) => {
    console.log("Socket Mensagem", data);
    io.emit("message", data);
  });
  socket.on("disconnect", (data) => {
    console.log("Socket Desconectado", data);
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(
    `HTTP Escultando => Server aberto em http://${SERVER_HOST}:${SERVER_PORT}`
  );
});

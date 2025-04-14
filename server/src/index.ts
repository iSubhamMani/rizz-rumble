import http from "http";
import SocketService from "./services/Socket";

async function init() {
  const socketService = new SocketService();
  const PORT = process.env.PORT || 8000;

  const httpServer = http.createServer();
  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  socketService.initListeners();
}

init();

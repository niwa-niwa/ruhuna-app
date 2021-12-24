import { createServer, Server } from "http";
import { io as client, Socket } from "socket.io-client";
import { io } from "../../sockets";
import { testTokens } from "../test_config/testData";

describe("TEST Web Socket io", () => {
  const port: string = process.env.PORT || "3000";
  const uri: string = `http://localhost:${port}`;
  const path: string = "/chatSockets";
  let clientSocket: Socket;

  beforeAll(() => {
    const server: Server = createServer();

    io.attach(server);

    server.listen(port);
  });

  afterEach(() => {
    clientSocket.close();
  });

  afterAll(() => {
    io.close();
  });

  test("join room", (done) => {
    clientSocket = client(uri, {
      path,
      query: {
        token: testTokens.admin_user,
      },
    });

    clientSocket.on("result_join", (data: any) => {
      expect(data.room).toBe("room_a");
      expect(data.status).toBe(true);
      done();
    });

    clientSocket.emit("join", {
      token: "a_token",
      room: "room_a",
      id: "my_id",
    });
  });

  test("not token user should be rejected", (done) => {
    const clientSocket: Socket = client(`http://localhost:${port}`, {
      path,
    });

    clientSocket.on("connect_error", (err: any) => {
      expect(err.data).toHaveProperty("errorObj");
      expect(err.data.errorObj).toHaveProperty("errorCode");
      expect(err.data.errorObj).toHaveProperty("errorMessage");
      done();
    });
  });
});

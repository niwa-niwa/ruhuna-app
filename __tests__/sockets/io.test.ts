import { createServer, Server } from "http";
import { io as client, Socket } from "socket.io-client";
import { io } from "../../sockets";

describe("TEST Web Socket io", () => {
  const port: string = process.env.PORT || "3000";

  const clientSocket_A: Socket = client(`http://localhost:${port}`, {
    path: "/sockets",
    query: {
      token: "aaa_token",
    },
  });

  let serverSocket: any;

  beforeAll(() => {
    const server: Server = createServer();

    io.attach(server);

    server.listen(port, () => {
      io.on("connection", (socket) => {
        serverSocket = socket;
      });

      // clientSocket_A.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket_A.close();
  });

  // test("should work", (done) => {
  //   clientSocket_A.on("hello", (arg: any) => {
  //     expect(arg).toBe("world");
  //     done();
  //   });
  //   serverSocket.emit("hello", "world");
  // });

  // test("should work (with ack)", (done) => {
  //   serverSocket.on("hi", (cb: any) => {
  //     cb("hallo");
  //   });
  //   clientSocket_A.emit("hi", (arg: any) => {
  //     expect(arg).toBe("hallo");
  //     done();
  //   });
  // });

  test("join room", (done) => {
    clientSocket_A.on("result_join", (data: any) => {
      expect(data.room).toBe("room_a");
      expect(data.status).toBe(true);
      done();
    });

    clientSocket_A.emit("join", {
      token: "a_token",
      room: "room_a",
      id: "my_id",
    });
  });

  test("not token user should be rejected", (done) => {
    const clientSocket_B: Socket = client(`http://localhost:${port}`, {
      path: "/sockets",
    });

    clientSocket_B.on("connect_error", (err: any) => {
      console.log("connect was rejected", err.message);
      expect(err.message).toBe("Unauthorized");
      done();
    });
  });
});

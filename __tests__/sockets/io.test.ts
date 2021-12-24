import { createServer, Server } from "http";
import { io as client, Socket } from "socket.io-client";
import { io } from "../../sockets";

describe("TEST Web Socket io", () => {

  const port: string = process.env.PORT || "3000";
  const uri: string = `http://localhost:${port}`;
  let clientSocket: Socket;
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

  afterEach(()=>{
    clientSocket.close()
  })

  afterAll(() => {
    io.close();
  });


  // test("should work", (done) => {
  //   clientSocket = client(uri, {
  //     path: "/sockets",
  //     query: {
  //       token: "aaa_token",
  //     },
  //   });

  //   clientSocket.on("hello", (arg: any) => {
  //     expect(arg).toBe("world");
  //     done();
  //   });

  //   serverSocket.emit("hello", "world");

  // });

  // test("should work (with ack)", (done) => {

  //   clientSocket = client(uri, {
  //     path: "/sockets",
  //     query: {
  //       token: "aaa_token",
  //     },
  //   });

  //   serverSocket.on("hi", (cb: any) => {
  //     cb("hallo");
  //   });

  //   clientSocket.emit("hi", (arg: any) => {
  //     expect(arg).toBe("hallo");
  //     done();
  //   });

  // });


  test("join room", (done) => {

    clientSocket = client(uri, {
      path: "/sockets",
      query: {
        token: "aaa_token",
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
      path: "/sockets",
    });

    clientSocket.on("connect_error", (err: any) => {
      expect(err.message).toBe("Unauthorized");
      done();
    });

  });


});

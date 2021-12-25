import { createServer, Server } from "http";
import { io as client, Socket } from "socket.io-client";
import { io } from "../../sockets";
import { testTokens, admin_user } from "../test_config/testData";
import { prismaClient } from "../../lib/prismaClient";
import { User } from "@prisma/client";

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

  test("subscribe the village", async () => {
    clientSocket = client(uri, {
      path,
      query: {
        token: testTokens.admin_user,
      },
    });

    const adminUser: User | null = await prismaClient.user.findUnique({
      where: { firebaseId: admin_user.uid },
    });

    const chatVillage = await prismaClient.village.create({
      data: {
        name: "chat village A",
        description: "chat village des",
        users: { connect: { id: adminUser?.id } },
      },
    });

    clientSocket.on("subscribe", (data: any) => {
      expect(data).not.toHaveProperty("errorObj");
      expect(data).toHaveProperty("village");
      expect(data.Village.id).toBe(chatVillage.id);
    });

    clientSocket.emit("subscribe", { villageId: chatVillage.id });
  });

  test("could not subscribe the village by not join", async () => {
    clientSocket = client(uri, {
      path,
      query: {
        token: testTokens.admin_user,
      },
    });

    const chatVillage = await prismaClient.village.findFirst();

    clientSocket.on("subscribe", (data: any) => {
      expect(data).not.toHaveProperty("village");
      expect(data).toHaveProperty("errorObj");
      expect(data.errorObj).toHaveProperty("errorCode");
      expect(data.errorObj).toHaveProperty("errorMessage");
    });

    clientSocket.emit("subscribe", { villageId: chatVillage?.id });
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

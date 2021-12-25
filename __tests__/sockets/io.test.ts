import { createServer, Server } from "http";
import { io as client, Socket } from "socket.io-client";
import { io } from "../../sockets";
import { testTokens, admin_user } from "../test_config/testData";
import { prismaClient } from "../../lib/prismaClient";
import { User, Village } from "@prisma/client";

describe("TEST Web Socket io", () => {
  const port: string = process.env.PORT || "3000";
  const uri: string = `http://localhost:${port}`;
  const path: string = "/chatSockets";
  let clientSocket: Socket;
  let chatVillage: Village;

  beforeAll(() => {
    const server: Server = createServer();

    io.attach(server);

    server.listen(port);
  });

  beforeEach(async () => {
    const adminUser: User | null = await prismaClient.user.findUnique({
      where: { firebaseId: admin_user.uid },
    });

    chatVillage = await prismaClient.village.create({
      data: {
        name: "chat village A",
        description: "chat village des",
        users: { connect: { id: adminUser?.id } },
      },
    });
  });

  afterEach(() => {
    clientSocket.close();
  });

  afterAll(() => {
    io.close();
  });

  test("subscribe the village", (done) => {
    clientSocket = client(uri, {
      path,
      query: {
        token: testTokens.admin_user,
      },
    });

    clientSocket.on("subscribe_village", (data: any) => {
      expect.hasAssertions();
      expect(data).not.toHaveProperty("errorObj");
      expect(data).toHaveProperty("village");
      expect(data.village.id).toBe(chatVillage.id);
      done();
    });

    clientSocket.emit("subscribe_village", { villageId: chatVillage.id });
  });

  test("could not subscribe the village by not join", (done) => {
    clientSocket = client(uri, {
      path,
      query: {
        token: testTokens.general_user,
      },
    });

    clientSocket.on("subscribe_village", (data: any) => {
      expect(data).not.toHaveProperty("village");
      expect(data).toHaveProperty("errorObj");
      expect(data.errorObj).toHaveProperty("errorCode");
      expect(data.errorObj).toHaveProperty("errorMessage");
      done();
    });

    clientSocket.emit("subscribe_village", { villageId: chatVillage?.id });
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

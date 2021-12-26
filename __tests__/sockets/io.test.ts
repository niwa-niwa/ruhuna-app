import { createServer, Server } from "http";
import { io as client, Socket } from "socket.io-client";
import { io } from "../../sockets";
import { testTokens, admin_user } from "../test_config/testData";
import { prismaClient } from "../../lib/prismaClient";
import { User, Village } from "@prisma/client";
import request from "supertest";
import { api } from "../../api";

describe("TEST Web Socket io", () => {
  const port: string = process.env.PORT || "3000";
  const uri: string = `http://localhost:${port}`;
  const path: string = "/chatSockets";
  let clientSocket: Socket;
  let privateChatVillage: Village;
  let publicChatVillage: Village;
  let adminUser: User | null;

  beforeAll(() => {
    /**
     * build server and attach chat socket
     */
    const server: Server = createServer();

    io.attach(server);

    server.listen(port);
  });

  beforeEach(async () => {
    /**
     * create private and public villages
     * the processes are not implemented in test-cases
     */
    adminUser = await prismaClient.user.findUnique({
      where: { firebaseId: admin_user.uid },
    });

    privateChatVillage = await prismaClient.village.create({
      data: {
        name: "chat village A",
        description: "chat village des",
        users: { connect: { id: adminUser?.id } },
      },
    });

    publicChatVillage = await prismaClient.village.create({
      data: {
        name: "chat village B",
        description: "chat village des",
        isPublic: true,
      },
    });
  });

  afterEach(() => {
    clientSocket.close();
  });

  afterAll(() => {
    io.close();
  });

  test("subscribe the village success", (done) => {
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
      expect(data.village.id).toBe(privateChatVillage.id);
      done();
    });

    clientSocket.emit("subscribe_village", {
      villageId: privateChatVillage.id,
    });
  });

  test("could not subscribe the village by not join handling error", (done) => {
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

    clientSocket.emit("subscribe_village", {
      villageId: privateChatVillage?.id,
    });
  });

  test("subscribe the public village success", (done) => {
    clientSocket = client(uri, {
      path,
      query: {
        token: testTokens.general_user,
      },
    });

    prismaClient.village
      .findUnique({
        where: { id: publicChatVillage?.id },
        include: { users: true },
      })
      .then((village) => {
        expect(village?.users).toHaveLength(0);

        clientSocket.on("subscribe_village", (data: any) => {
          expect(data).toHaveProperty("village");
          expect(data).not.toHaveProperty("errorObj");
          expect(data.village.id).toBe(publicChatVillage.id);
          done();
        });

        clientSocket.emit("subscribe_village", {
          villageId: publicChatVillage?.id,
        });
      });
  });

  test("not token user should be rejected handling error", (done) => {
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

  test("Send message with REST api and then receive the message with socket", (done) => {
    async function sendMessage() {
      const the_content = "this is the content";

      const { status, body } = await request(api)
        .post("/api/v1/messages" + "/create")
        .set("Authorization", `Bearer ${testTokens.admin_user}`)
        .send({
          content: the_content,
          userId: adminUser?.id,
          villageId: privateChatVillage?.id,
        });

      expect(status).toBe(200);
      expect(body).toHaveProperty("message");
    }

    clientSocket = client(uri, {
      path,
      query: {
        token: testTokens.admin_user,
      },
    });

    clientSocket.on("subscribe_village", (data: any) => {
      expect(data).toHaveProperty("village");
      expect(data.village.id).toBe(privateChatVillage.id);
      // send message after join the room
      sendMessage();
    });

    clientSocket.emit("subscribe_village", {
      villageId: privateChatVillage.id,
    });

    clientSocket.on("message", (data: any) => {
      expect(data).toHaveProperty("message");
      expect(data.message.user.id).toBe(adminUser?.id);
      expect(data.message.village.id).toBe(privateChatVillage.id);
      done();
    });
  });

  test("Send message with REST api and then confirm that the user who doesn't join can't receive the message", (done) => {
    async function sendMessage() {
      const the_content = "this is the content";

      const { status, body } = await request(api)
        .post("/api/v1/messages" + "/create")
        .set("Authorization", `Bearer ${testTokens.admin_user}`)
        .send({
          content: the_content,
          userId: adminUser?.id,
          villageId: privateChatVillage?.id,
        });

      expect(status).toBe(200);
      expect(body).toHaveProperty("message");
      done()
    }

    clientSocket = client(uri, {
      path,
      query: {
        token: testTokens.general_user,
      },
    });

    clientSocket.on("subscribe_village", (data: any) => {
      expect(data).toHaveProperty("village");
      expect(data.village.id).toBe(publicChatVillage.id);
      // send message after join the room
      sendMessage();
    });

    clientSocket.emit("subscribe_village", {
      villageId: publicChatVillage.id,
    });

    clientSocket.on("message", (data: any) => {
      // if receive admin message from his room that general_user is not exist, it was fault
      expect(data).toHaveProperty("message");
      expect(data.message.user.id).not.toBe(adminUser?.id);
      expect(data.message.village.id).not.toBe(privateChatVillage.id);
    });
  });

});

import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import { createUser, loginUser, registerUser } from "./utils";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || "", {});
  // await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("API Tests", () => {
  let adminToken: string;
  let userId: string;
  let userToken: string;
  let groupId: string;
  let messageId: string;

  beforeAll(async () => {
    await registerUser("adminuser", "password123", "admin");
    adminToken = await loginUser("adminuser", "password123");
    await createUser(adminToken, "normaluser", "password123", "user");
    userToken = await loginUser("normaluser", "password123");
  });

  describe("Authentication", () => {
    it("should logout the admin user", async () => {
      const response = await request(app).post("/api/auth/logout").set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logout successful.");
    });

    it("should logout the normal user", async () => {
      const response = await request(app).post("/api/auth/logout").set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logout successful.");
    });
  });

  describe("User Management", () => {
    const IUser = {
      username: expect.any(String),
      role: expect.any(String),
      _id: expect.any(String),
    };

    it("should create a new user by admin", async () => {
      const response = await request(app)
        .post("/api/users")
        .send({
          username: "testuser",
          password: "password123",
          role: "user",
        })
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User created successfully.");
      expect(response.body.data).toMatchObject(IUser);
      userId = response.body.data._id;
    });

    it("should edit an existing user by admin", async () => {
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({
          username: "updateduser",
          role: "admin",
        })
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User updated successfully.");
    });
  });

  describe("Group Management", () => {
    it("should create a new group by a user", async () => {
      const response = await request(app)
        .post("/api/groups")
        .send({
          name: "Test Group",
          members: [],
        })
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Group created successfully.");
      // groupId = response.body.data._id;
    });

    it("should search for a group by name and return member count", async () => {
      const response = await request(app)
        .get("/api/groups")
        .query({
          name: "Test Group",
        })
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("memberCount");
      groupId = response.body[0]._id;
    });

    it("should add a member to a group by username", async () => {
      const response = await request(app)
        .post("/api/groups/add-member")
        .send({
          groupId,
          userName: "updateduser",
        })
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Member added successfully.");
    });

    it("should delete a group", async () => {
      const response = await request(app).delete(`/api/groups/${groupId}`).set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Group deleted successfully.");
    });
  });

  describe("Messaging", () => {
    beforeAll(async () => {
      await request(app)
        .post("/api/groups")
        .send({
          name: "Messaging Group",
          members: [],
        })
        .set("Authorization", `Bearer ${userToken}`);

      const response = await request(app)
        .get("/api/groups")
        .query({
          name: "Messaging",
        })
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("memberCount");
      groupId = response.body[0]._id;
    });

    it("should send a message to the group", async () => {
      const response = await request(app)
        .post("/api/groups/send-message")
        .send({
          groupId,
          senderId: userId,
          content: "Hello, this is a test message!",
        })
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Message sent successfully.");
      messageId = response.body.data._id;
    });

    it("should like a message in the group", async () => {
      const response = await request(app).post(`/api/groups/like-message/${messageId}`).set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Message liked successfully.");
    });
  });
});

import request from "supertest";
import app from "../src/app";

export const registerUser = async (username: string, password: string, role: string = "user") => {
  await request(app).post("/api/auth/register").send({ username, password, role });
};

export const loginUser = async (username: string, password: string) => {
  const response = await request(app).post("/api/auth/login").send({ username, password });
  return response.body.token;
};

export const createUser = async (adminToken: string, username: string, password: string, role: string = "user") => {
  const response = await request(app).post("/api/users").send({ username, password, role }).set("Authorization", `Bearer ${adminToken}`);
  expect(response.status).toBe(201);
  expect(response.body.message).toBe("User created successfully.");
};

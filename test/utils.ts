import request from 'supertest';
import app from '../src/app';

export const createUser = async (username: string, password: string, role: string = 'user') => {
  await request(app).post('/api/auth/register').send({ username, password, role });
};

export const loginUser = async (username: string, password: string) => {
  const response = await request(app).post('/api/auth/login').send({ username, password });
  return response.body.token;
};

const express = require('express');
const request = require('supertest');
const apiRoutes = require('./apiRoutes'); // Adjust path as necessary

// Mock implementations of API functions with named exports
jest.mock('./start', () => ({
  start: jest.fn().mockImplementation((input) => ({ text: "start" }))
}));
jest.mock('./respond', () => ({
  respond: jest.fn().mockImplementation((input) => ({ text: "respond" }))
}));
jest.mock('./analyse', () => ({
  analyse: jest.fn().mockImplementation((input) => ({ text: "analyse" }))
}));

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use('/api', apiRoutes);

describe('Test API routes', () => {
  test('POST /api/start', async () => {
    const response = await request(app)
      .post('/api/start')
      .send({});
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ text: "start" });
  });

  test('POST /api/respond', async () => {
    const response = await request(app)
      .post('/api/respond')
      .send({});
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ text: "respond" });
  });

  test('POST /api/analyse', async () => {
    const response = await request(app)
      .post('/api/analyse')
      .send({});
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ text: "analyse" });
  });
});

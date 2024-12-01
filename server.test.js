const request = require('supertest');
const server = require('./server');
let app;

describe('Test API endpoints', () => {
  test('POST /api/start', async () => {
    const response = await request(server)
      .post('/api/start')
      .send({});
    expect(response.status).toBe(200);
  });

  test('POST /api/respond', async () => {
    const response = await request(server)
      .post('/api/respond')
      .send({});
    expect(response.status).toBe(200);
  });

  test('POST /api/analyse', async () => {
    const response = await request(server)
      .post('/api/analyse')
      .send({});
    expect(response.status).toBe(200);
  });
});

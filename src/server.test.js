const request = require('supertest');
const server = require('./server');
let app;

describe('Test API endpoints', () => {
  test('POST /api/start', async () => {
    const response = await request(server)
      .post('/api/start')
      .send({ jobTitle: 'Software Developer' });
    expect(response.status).toBe(200);
  });

  test('POST /api/respond', async () => {
    const response = await request(server)
      .post('/api/respond')
      .send({
        jobTitle: 'Software Developer',
        response: 'I have 5 years of experience',
        history: []
      });
    expect(response.status).toBe(200);
  });

  test('POST /api/analyse', async () => {
    const response = await request(server)
      .post('/api/analyse')
      .send({
        jobTitle: 'Software Developer',
        history: []
      });
    expect(response.status).toBe(200);
  });
});
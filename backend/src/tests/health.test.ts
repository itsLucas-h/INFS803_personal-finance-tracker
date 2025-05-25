import request from 'supertest';
import app from '../app';

describe('Health check endpoint', () => {
  it('should return "Server is healthy"', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Server is healthy');
  });
});

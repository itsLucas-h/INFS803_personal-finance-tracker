import request from 'supertest';
import app from '../app.js';

describe('Health check endpoint', () => {
  it('should return OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('✅ Server is healthy');
  });
});

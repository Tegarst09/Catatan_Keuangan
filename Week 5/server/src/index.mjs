import { resolve } from 'node:path';
import { createApiServer } from './app.mjs';
try {
  const { server } = await createApiServer({
    dataFile: resolve(process.env.DATA_FILE || './data/money-track.json'),
    secret: process.env.JWT_SECRET,
    ttlSeconds: Number(process.env.TOKEN_TTL_SECONDS || 1800),
    corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:8081,http://127.0.0.1:8081').split(','),
  });
  const port = Number(process.env.PORT || 3001);
  server.listen(port, process.env.HOST || '0.0.0.0', () => console.log(`Money Track API aktif pada port ${port}.`));
} catch (e) { console.error(e.message); process.exitCode = 1; }

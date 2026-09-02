import app, { ensureDbReady } from '../server/app.js';

export default async function handler(req, res) {
  await ensureDbReady();
  return app(req, res);
}